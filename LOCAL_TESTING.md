# Running Tests Locally

This guide explains how to run the Mirror App tests on your local machine.

## Prerequisites

- Node.js installed
- MongoDB running locally
- Backend and frontend repositories cloned

## Setup

1. **Set up environment variables**

   Create a `.env` file in the `mirror-backend` directory:
   ```
   MONGO_URI=mongodb://localhost:27017/mirror
   JWT_SECRET=your-secret-key
   PORT=3000
   ```

2. **Install dependencies**

   ```bash
   # Install backend dependencies
   cd mirror-backend
   npm install

   # Install frontend dependencies
   cd ../mirror-frontend
   npm install

   # Install unit test dependencies
   cd ../unit-tests
   npm install

   # Install Selenium test dependencies
   cd ../selenium-tests
   npm install
   ```

## Running Tests

### Running Unit Tests

1. **Start the backend server**
   ```bash
   # Navigate to backend directory
   cd mirror-backend
   
   # Start the server
   node server.js
   ```

2. **Run the unit tests** (in a new terminal)
   ```bash
   cd unit-tests
   npm test
   ```

### Running Selenium Tests

1. **Start the backend server** (if not already running)
   ```bash
   # Navigate to backend directory
   cd mirror-backend
   
   # Start the server
   node server.js
   ```

2. **Start the frontend server** (in a new terminal)
   ```bash
   cd mirror-frontend
   npm run dev
   ```

3. **Run the Selenium tests** (in a new terminal)
   ```bash
   cd selenium-tests
   npm run test:login
   ```

## Troubleshooting

If you encounter errors while running the tests:

1. **Connection errors**:
   - Make sure your MongoDB server is running
   - Check that the backend server is running on port 3000
   - Verify that the frontend is running on port 5173

2. **Test failures**:
   - Check the error messages in the test output
   - Verify that your database has the required structure
   - Make sure your backend endpoints are working correctly

## Notes for CI/CD Testing

- The CI/CD workflow runs these same tests automatically in GitHub Actions
- The workflow configures its own environment and starts all services before running tests
- All failures are logged in the GitHub Actions interface for debugging