# Implementing MTTF Tracking in Mirror Application

This document provides practical guidance on implementing Mean Time to Failure (MTTF) tracking in the Mirror application. By collecting and analyzing failure data systematically, the development team can improve reliability over time.

## 1. Data Collection Setup

### 1.1 Error Logging System

Implement a comprehensive error logging system to capture failures automatically:

```javascript
// error-logger.js
const winston = require('winston');
const mongoose = require('mongoose');

// Define error schema for database storage
const ErrorSchema = new mongoose.Schema({
  timestamp: { type: Date, default: Date.now },
  component: { type: String, required: true },
  errorType: { type: String, required: true },
  severity: { type: String, enum: ['Critical', 'Major', 'Minor'], required: true },
  message: { type: String, required: true },
  stackTrace: { type: String },
  userImpact: { type: Boolean, default: true },
  resolution: {
    status: { type: String, enum: ['Open', 'In Progress', 'Resolved'], default: 'Open' },
    timeToResolve: { type: Number }, // in minutes
    notes: { type: String }
  }
});

const Error = mongoose.model('Error', ErrorSchema);

// Configure Winston logger
const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
  defaultMeta: { service: 'mirror-app' },
  transports: [
    // Log to console
    new winston.transports.Console(),
    // Log to file
    new winston.transports.File({ filename: 'error.log' }),
    // Custom transport to save to MongoDB
    new winston.transports.MongoDB({
      db: mongoose.connection,
      collection: 'error_logs',
      storeHost: true,
      options: { useUnifiedTopology: true }
    })
  ]
});

// Custom error recording function with severity
const logError = (component, errorType, severity, message, error = null) => {
  // Log to Winston
  logger.error({
    component,
    errorType,
    severity,
    message,
    stack: error?.stack || new Error().stack
  });

  // Save to dedicated Errors collection for MTTF analysis
  const newError = new Error({
    component,
    errorType,
    severity,
    message,
    stackTrace: error?.stack || new Error().stack
  });

  newError.save()
    .catch(saveError => console.error('Error saving to database:', saveError));
};

module.exports = {
  logger,
  logError
};
```

### 1.2 Centralized Error Handler for Express

```javascript
// errorHandler.js
const { logError } = require('./error-logger');

const errorHandler = (err, req, res, next) => {
  // Determine component from route path
  const routePath = req.route?.path || 'unknown';
  const component = routePath.includes('auth') ? 'Authentication' :
                   routePath.includes('journal') ? 'Journal' :
                   routePath.includes('profile') ? 'User Profile' :
                   'API Services';
  
  // Determine error type and severity
  let errorType = 'Server Error';
  let severity = 'Major';
  
  if (err.name === 'ValidationError') {
    errorType = 'Validation Error';
    severity = 'Minor';
  } else if (err.name === 'UnauthorizedError' || err.message.includes('authentication')) {
    errorType = 'Authentication Error';
    severity = 'Major';
  } else if (err.name === 'MongoError' && err.code === 11000) {
    errorType = 'Database Duplicate Key';
    severity = 'Minor';
  } else if (err.code === 'LIMIT_FILE_SIZE') {
    errorType = 'File Size Error';
    severity = 'Minor';
  } else if (err.message.includes('ECONNREFUSED') || err.name === 'MongoNetworkError') {
    errorType = 'Database Connection Error';
    severity = 'Critical';
  }
  
  // Log the error with our custom logger
  logError(component, errorType, severity, err.message, err);
  
  // Send appropriate response to client
  const status = err.statusCode || 500;
  res.status(status).json({
    message: err.message || 'Internal Server Error',
    error: process.env.NODE_ENV === 'development' ? err : {}
  });
};

module.exports = errorHandler;
```

### 1.3 Frontend Error Tracking

```javascript
// errorBoundary.jsx
import React from 'react';
import axios from 'axios';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, errorInfo: null };
  }
  
  static getDerivedStateFromError(error) {
    return { hasError: true };
  }
  
  componentDidCatch(error, errorInfo) {
    // Log to server
    axios.post('/api/errors/client', {
      component: this.props.componentName || 'Frontend UI',
      errorType: error.name || 'React Error',
      severity: 'Minor', // Default for UI errors, unless specified otherwise
      message: error.message || 'Unknown client error',
      stackTrace: error.stack || errorInfo.componentStack
    }).catch(err => console.error('Failed to report error:', err));
    
    this.setState({
      errorInfo: errorInfo
    });
  }
  
  render() {
    if (this.state.hasError) {
      return (
        <div className="error-container">
          <h2>Something went wrong</h2>
          <button 
            className="retry-button"
            onClick={() => this.setState({ hasError: false })}
          >
            Try again
          </button>
        </div>
      );
    }
    
    return this.props.children;
  }
}

export default ErrorBoundary;
```

## 2. MTTF Calculation Script

Create a script to calculate and visualize MTTF metrics:

```javascript
// mttf-analyzer.js
const mongoose = require('mongoose');
const moment = require('moment');
const { createObjectCsvWriter } = require('csv-writer');

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Import Error model
const Error = mongoose.model('Error');

// Function to calculate MTTF for a given time period and component
async function calculateMTTF(startDate, endDate, component = null) {
  // Build query
  let query = {
    timestamp: {
      $gte: startDate,
      $lte: endDate
    },
    userImpact: true // Only count errors that actually impact users
  };
  
  if (component) {
    query.component = component;
  }
  
  // Get all errors in the time period
  const errors = await Error.find(query).sort('timestamp');
  
  if (errors.length < 2) {
    return {
      component: component || 'All',
      mttf: 'Not enough data',
      errorCount: errors.length
    };
  }
  
  // Calculate time between failures
  let totalTimeBetweenFailures = 0;
  
  for (let i = 1; i < errors.length; i++) {
    const timeDiff = moment(errors[i].timestamp).diff(
      moment(errors[i-1].timestamp),
      'hours',
      true // floating point
    );
    totalTimeBetweenFailures += timeDiff;
  }
  
  const mttf = totalTimeBetweenFailures / (errors.length - 1);
  
  // Calculate weighted MTTF
  let totalWeightedTime = 0;
  let totalWeight = 0;
  
  for (let i = 0; i < errors.length; i++) {
    // Assign weights based on severity
    const weight = errors[i].severity === 'Critical' ? 5 :
                  errors[i].severity === 'Major' ? 3 : 1;
                  
    totalWeight += weight;
  }
  
  const weightedMTTF = totalTimeBetweenFailures / totalWeight;
  
  return {
    component: component || 'All',
    period: `${moment(startDate).format('YYYY-MM-DD')} to ${moment(endDate).format('YYYY-MM-DD')}`,
    errorCount: errors.length,
    mttf: mttf.toFixed(2),
    weightedMTTF: weightedMTTF.toFixed(2),
    criticalCount: errors.filter(e => e.severity === 'Critical').length,
    majorCount: errors.filter(e => e.severity === 'Major').length,
    minorCount: errors.filter(e => e.severity === 'Minor').length
  };
}

// Main function to generate MTTF report
async function generateMTTFReport() {
  const endDate = new Date();
  const startDate = moment(endDate).subtract(30, 'days').toDate();
  
  // Components to analyze
  const components = [
    'Authentication',
    'Journal',
    'User Profile',
    'API Services',
    'Frontend UI'
  ];
  
  // Calculate overall MTTF
  const overallMTTF = await calculateMTTF(startDate, endDate);
  
  // Calculate MTTF for each component
  const componentMTTFs = [];
  for (const component of components) {
    const result = await calculateMTTF(startDate, endDate, component);
    componentMTTFs.push(result);
  }
  
  // Log results
  console.log('===== MTTF REPORT =====');
  console.log(`Period: ${moment(startDate).format('YYYY-MM-DD')} to ${moment(endDate).format('YYYY-MM-DD')}`);
  console.log(`Overall MTTF: ${overallMTTF.mttf} hours`);
  console.log(`Weighted MTTF: ${overallMTTF.weightedMTTF} hours`);
  console.log('\nComponent Breakdown:');
  componentMTTFs.forEach(c => {
    console.log(`${c.component}: MTTF = ${c.mttf} hours, Errors = ${c.errorCount} (${c.criticalCount} Critical, ${c.majorCount} Major, ${c.minorCount} Minor)`);
  });
  
  // Export to CSV
  const csvWriter = createObjectCsvWriter({
    path: './mttf-report.csv',
    header: [
      {id: 'component', title: 'Component'},
      {id: 'period', title: 'Period'},
      {id: 'errorCount', title: 'Error Count'},
      {id: 'mttf', title: 'MTTF (hours)'},
      {id: 'weightedMTTF', title: 'Weighted MTTF (hours)'},
      {id: 'criticalCount', title: 'Critical Errors'},
      {id: 'majorCount', title: 'Major Errors'},
      {id: 'minorCount', title: 'Minor Errors'}
    ]
  });
  
  await csvWriter.writeRecords([overallMTTF, ...componentMTTFs]);
  console.log('\nReport exported to mttf-report.csv');
  
  // Disconnect from MongoDB
  mongoose.disconnect();
}

// Run the report
generateMTTFReport().catch(console.error);
```

## 3. Implementing MTTF Monitoring Dashboard

To visualize MTTF trends over time, create a simple dashboard component:

```jsx
// MTTFDashboard.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Line } from 'react-chartjs-2';
import moment from 'moment';

const MTTFDashboard = () => {
  const [mttfData, setMttfData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [timeRange, setTimeRange] = useState('month'); // week, month, quarter, year
  
  useEffect(() => {
    fetchMTTFData();
  }, [timeRange]);
  
  const fetchMTTFData = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`/api/metrics/mttf?range=${timeRange}`);
      setMttfData(response.data);
      setLoading(false);
    } catch (err) {
      setError('Failed to fetch MTTF data');
      setLoading(false);
    }
  };
  
  if (loading) return <div>Loading MTTF metrics...</div>;
  if (error) return <div className="error">{error}</div>;
  if (!mttfData) return null;
  
  // Prepare chart data
  const chartData = {
    labels: mttfData.timePoints.map(t => moment(t).format('MMM DD')),
    datasets: [
      {
        label: 'Overall MTTF (hours)',
        data: mttfData.overallMTTF,
        borderColor: '#3e95cd',
        fill: false
      },
      {
        label: 'Authentication MTTF',
        data: mttfData.authMTTF,
        borderColor: '#8e5ea2',
        fill: false
      },
      {
        label: 'API Services MTTF',
        data: mttfData.apiMTTF,
        borderColor: '#3cba9f',
        fill: false
      },
      {
        label: 'Journal MTTF',
        data: mttfData.journalMTTF, 
        borderColor: '#e8c3b9',
        fill: false
      },
      {
        label: 'User Profile MTTF',
        data: mttfData.profileMTTF,
        borderColor: '#c45850',
        fill: false
      },
      {
        label: 'Frontend UI MTTF',
        data: mttfData.uiMTTF,
        borderColor: '#ffcc00',
        fill: false
      }
    ]
  };
  
  return (
    <div className="mttf-dashboard">
      <h2>Mean Time to Failure (MTTF) Analysis</h2>
      
      <div className="time-range-selector">
        <button 
          className={timeRange === 'week' ? 'active' : ''} 
          onClick={() => setTimeRange('week')}
        >
          Week
        </button>
        <button 
          className={timeRange === 'month' ? 'active' : ''} 
          onClick={() => setTimeRange('month')}
        >
          Month
        </button>
        <button 
          className={timeRange === 'quarter' ? 'active' : ''} 
          onClick={() => setTimeRange('quarter')}
        >
          Quarter
        </button>
        <button 
          className={timeRange === 'year' ? 'active' : ''} 
          onClick={() => setTimeRange('year')}
        >
          Year
        </button>
      </div>
      
      <div className="chart-container">
        <Line 
          data={chartData} 
          options={{
            responsive: true,
            title: {
              display: true,
              text: 'MTTF Trend Analysis'
            },
            scales: {
              yAxes: [{
                scaleLabel: {
                  display: true,
                  labelString: 'Hours'
                },
                ticks: {
                  beginAtZero: true
                }
              }]
            }
          }} 
        />
      </div>
      
      <div className="mttf-summary">
        <h3>Current MTTF Summary</h3>
        <table>
          <thead>
            <tr>
              <th>Component</th>
              <th>Current MTTF</th>
              <th>Previous Period</th>
              <th>Change</th>
            </tr>
          </thead>
          <tbody>
            {mttfData.summary.map(item => (
              <tr key={item.component}>
                <td>{item.component}</td>
                <td>{item.currentMTTF} hours</td>
                <td>{item.previousMTTF} hours</td>
                <td className={item.change > 0 ? 'positive' : item.change < 0 ? 'negative' : ''}>
                  {item.change > 0 ? '+' : ''}{item.change}%
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default MTTFDashboard;
```

## 4. Setting Up MTTF Simulation Testing

To simulate failures in a controlled environment and measure MTTF accurately:

```javascript
// mttf-simulation.js
const axios = require('axios');
const { performance } = require('perf_hooks');
const fs = require('fs');

// Endpoints to test
const endpoints = [
  { url: '/api/auth/login', method: 'post', data: { email: 'test@example.com', password: 'password123' } },
  { url: '/api/auth/signup', method: 'post', data: { Name: 'Test User', email: 'new_user_${timestamp}@example.com', password: 'Password123!' } },
  { url: '/api/journal/entries', method: 'get', auth: true },
  { url: '/api/journal/entry', method: 'post', auth: true, data: { title: 'Test Entry', content: 'This is a test journal entry' } },
  { url: '/api/profile', method: 'get', auth: true },
];

// Configuration
const config = {
  baseURL: 'http://localhost:5000',
  simulationHours: 24, // Simulate this many hours of operation
  requestsPerHour: 100, // Average number of requests per hour
  token: null, // Will be populated after login
};

// Results tracking
const failures = [];
const requests = [];
let startTime;

// Helper to get random endpoint
const getRandomEndpoint = () => {
  const index = Math.floor(Math.random() * endpoints.length);
  return endpoints[index];
};

// Track a request
const trackRequest = (endpoint, success, errorMessage = null) => {
  const timestamp = performance.now();
  requests.push({
    endpoint: endpoint.url,
    method: endpoint.method,
    timestamp,
    success,
    errorMessage
  });
  
  if (!success) {
    failures.push({
      endpoint: endpoint.url,
      method: endpoint.method,
      timestamp,
      errorMessage
    });
    
    console.log(`Failure at ${new Date().toISOString()}: ${endpoint.method.toUpperCase()} ${endpoint.url} - ${errorMessage}`);
  }
};

// Make request
const makeRequest = async (endpoint) => {
  try {
    const config = {
      baseURL: 'http://localhost:5000'
    };
    
    if (endpoint.auth && token) {
      config.headers = {
        'Authorization': `Bearer ${token}`
      };
    }
    
    let response;
    if (endpoint.method === 'get') {
      response = await axios.get(endpoint.url, config);
    } else if (endpoint.method === 'post') {
      // Handle dynamic data like unique emails
      let data = { ...endpoint.data };
      if (endpoint.url.includes('signup')) {
        data.email = data.email.replace('${timestamp}', Date.now());
      }
      response = await axios.post(endpoint.url, data, config);
    }
    
    // Save token from login response
    if (endpoint.url.includes('login') && response.data.token) {
      token = response.data.token;
    }
    
    trackRequest(endpoint, true);
  } catch (error) {
    trackRequest(endpoint, false, error.message || 'Unknown error');
  }
};

// Run the simulation
const runSimulation = async () => {
  startTime = performance.now();
  console.log(`Starting MTTF simulation at ${new Date().toISOString()}`);
  
  // Login first to get token
  await makeRequest(endpoints[0]);
  
  // Calculate total requests for the simulation
  const totalRequests = config.simulationHours * config.requestsPerHour;
  
  // Run the simulation
  for (let i = 0; i < totalRequests; i++) {
    const endpoint = getRandomEndpoint();
    await makeRequest(endpoint);
    
    // Random delay between requests (0-1000ms)
    const delay = Math.random() * 1000;
    await new Promise(resolve => setTimeout(resolve, delay));
    
    // Log progress
    if (i % 100 === 0) {
      console.log(`Completed ${i} of ${totalRequests} requests`);
    }
  }
  
  // Calculate results
  const endTime = performance.now();
  const totalTime = (endTime - startTime) / 1000 / 60 / 60; // Convert to hours
  
  const mttf = failures.length > 0 ? totalTime / failures.length : 'No failures';
  
  const results = {
    simulationTime: totalTime.toFixed(2) + ' hours',
    totalRequests: requests.length,
    totalFailures: failures.length,
    failureRate: ((failures.length / requests.length) * 100).toFixed(2) + '%',
    mttf: typeof mttf === 'string' ? mttf : mttf.toFixed(2) + ' hours',
    failures: failures
  };
  
  console.log('\nSimulation Results:');
  console.log(`Simulation Time: ${results.simulationTime}`);
  console.log(`Total Requests: ${results.totalRequests}`);
  console.log(`Total Failures: ${results.totalFailures}`);
  console.log(`Failure Rate: ${results.failureRate}`);
  console.log(`MTTF: ${results.mttf}`);
  
  // Write results to file
  fs.writeFileSync('simulation-results.json', JSON.stringify(results, null, 2));
  console.log('\nResults saved to simulation-results.json');
};

// Run the simulation
runSimulation().catch(console.error);
```

## 5. Integrating MTTF Into CI/CD Pipeline

Add MTTF tracking to your CI/CD pipeline to ensure reliability improvements over time:

```yaml
# .github/workflows/mttf-analysis.yml
name: MTTF Analysis

on:
  schedule:
    # Run weekly on Sunday
    - cron: '0 0 * * 0'
  workflow_dispatch:
    # Allow manual triggering

jobs:
  analyze-mttf:
    runs-on: ubuntu-latest
    
    steps:
    - name: Checkout code
      uses: actions/checkout@v2
      
    - name: Setup Node.js
      uses: actions/setup-node@v2
      with:
        node-version: '14'
        
    - name: Install dependencies
      run: npm ci
      
    - name: Generate MTTF Report
      run: node scripts/mttf-analyzer.js
      env:
        MONGO_URI: ${{ secrets.MONGO_URI }}
        
    - name: Archive MTTF report
      uses: actions/upload-artifact@v2
      with:
        name: mttf-report
        path: mttf-report.csv
        
    - name: Check MTTF threshold
      run: |
        # Extract the weighted MTTF value
        WEIGHTED_MTTF=$(grep 'All' mttf-report.csv | cut -d ',' -f 5)
        
        # Compare with threshold
        THRESHOLD=12
        
        echo "Current weighted MTTF: $WEIGHTED_MTTF hours"
        echo "Threshold: $THRESHOLD hours"
        
        if (( $(echo "$WEIGHTED_MTTF < $THRESHOLD" | bc -l) )); then
          echo "⚠️ Warning: MTTF below threshold! Review required."
          # Could trigger a notification or create an issue
          # github.event.repository.owner.email
        else
          echo "✅ MTTF above threshold."
        fi
```

## 6. MTTF-Driven Development Process

Implement these practices to continuously improve MTTF:

1. **Weekly MTTF Review Meeting**
   - Review latest MTTF metrics
   - Identify components with decreasing reliability
   - Prioritize fixes for components with lowest MTTF

2. **Failure Post-Mortems**
   - For critical failures, conduct detailed analysis
   - Document root cause, impact, and mitigation
   - Update test cases to prevent similar failures

3. **MTTF Improvement Targets**
   - Set quarterly targets for MTTF improvement
   - Track progress in sprint retrospectives
   - Celebrate improvements in reliability

4. **Reliability Testing Requirements**
   - Define specific reliability testing for each component
   - Include stress tests, recovery tests, and long-duration tests
   - Update test suite as new failures are discovered

5. **Developer Education**
   - Train team on common failure patterns
   - Share best practices for error handling
   - Regular code reviews focused on reliability aspects

By implementing these processes and tools, you'll establish a continuous improvement cycle that steadily increases the MTTF of your application, resulting in improved user experience and reduced maintenance costs.