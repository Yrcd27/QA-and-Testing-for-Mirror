# Mirror API Postman Tests

This folder contains Postman collections and environment files for testing the Mirror Journal application API endpoints.

## Contents

- `Mirror_API_Tests.postman_collection.json`: Postman collection with API tests
- `Mirror_API_Testing_Environment.postman_environment.json`: Environment variables for tests
- `API_Testing_Documentation.md`: Detailed documentation on the tests and how to use them
- `setup-test-user.js`: Helper script to create a test user for API testing
- `package.json`: NPM package file with dependencies for the setup script

## Quick Start

1. Make sure your backend server is running:
   ```
   cd ../mirror-backend
   npm install
   npm start
   ```

2. Install dependencies for test setup:
   ```
   npm install
   ```

3. Create a test user:
   ```
   npm run setup
   ```

4. Import both the collection and environment files into Postman

5. Select "Mirror API Testing Environment" in Postman

6. Run the tests in the following order:
   - Login (to get authentication token)
   - Journal creation tests

For detailed instructions, refer to `API_Testing_Documentation.md`.

## Test Coverage

These tests cover:

1. User Authentication (Login)
   - Successful login
   - Invalid credentials
   - Missing fields validation

2. Journal Creation
   - Successful creation
   - Missing content validation
   - Unauthorized access attempt
   - Retrieving journal entries

## Notes

- The test user credentials are set in the environment file as:
  - Email: test@example.com
  - Password: TestPassword123!

- The backend is expected to run on http://localhost:5000 by default. If your server runs on a different URL, update the `baseUrl` in the environment variables.