# Mirror Authentication Unit Tests

This directory contains automated unit tests for the Mirror application's authentication system, including user registration and login functionality.

## Test Structure

- `/auth/registration.test.js` - Tests for user registration functionality
- `/auth/login.test.js` - Tests for user login functionality
- `/config/testConfig.js` - Configuration for tests including API endpoints and test user data

## Prerequisites

- Node.js and npm installed
- Mirror backend server running on `http://localhost:5000`
- MongoDB database connected to the backend server

## Installing Dependencies

```bash
npm install
```

## Running Tests

To run all authentication tests in the correct sequence:

```bash
npm test
```

This will ensure registration tests run before login tests, which is required for the tests to pass.

If you need to run tests individually (not recommended), use:

```bash
# Always run registration tests first
node ./node_modules/jest/bin/jest.js auth/registration.test.js

# Then run login tests
node ./node_modules/jest/bin/jest.js auth/login.test.js
```

Alternatively, use the provided PowerShell script that runs tests in the correct order:
- PowerShell: `run-auth-tests.ps1`

## Test Credentials

The tests use dynamic user credentials with timestamps to ensure uniqueness:
1. First test user format:
   - Name: TestUser_[timestamp]
   - Email: testuser_[timestamp]@example.com
   - Password: securePassword123

2. Second test user format:
   - Name: AnotherUser_[timestamp]
   - Email: anotheruser_[timestamp]@example.com
   - Password: anotherPassword456

These accounts will be created in your database when the tests are run, so ensure they don't already exist or modify the test data in `config/testConfig.js` if needed.

## Important Notes

- Tests are designed to run in sequence (`--runInBand`) as some tests depend on the results of previous tests
- The registration test for the main test user must run before the login tests for that user
- The server must be running before executing the tests