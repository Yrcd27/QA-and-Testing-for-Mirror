// Test configuration file
export const config = {
  // Application URLs
  baseUrl: 'http://localhost:5173',
  apiUrl: 'http://localhost:5000',
  
  // Page URLs
  pages: {
    landing: 'http://localhost:5173/',
    login: 'http://localhost:5173/login',
    signup: 'http://localhost:5173/signup',
    dashboard: 'http://localhost:5173/dashboard',
    newEntry: 'http://localhost:5173/new-entry',
    profile: 'http://localhost:5173/profile'
  },

  // Test timeouts (in milliseconds)
  timeouts: {
    implicit: 10000,      // Default wait time for element searches
    explicit: 15000,      // Maximum wait time for specific conditions
    pageLoad: 30000       // Page load timeout
  },

  // Browser configuration
  browser: {
    name: 'chrome',
    headless: false,      // Set to true to run without browser window
    windowSize: {
      width: 1280,
      height: 720
    }
  },

  // Test user credentials for testing
  testUser: {
    email: 'test@example.com',
    password: 'TestPassword123!',
    name: 'Test User'
  },

  // Test data
  testData: {
    journal: {
      content: 'This is a test journal entry created by Selenium automation. Today was a great day for testing!',
      mood: '😃'  // Happy emoji
    }
  }
};