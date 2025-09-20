# Mirror API Testing with Postman

This documentation provides a comprehensive guide on how to test the API endpoints of the Mirror Journal application using Postman.

## Setup Instructions

### Prerequisites
- Postman Desktop or Web Application installed
- The Mirror backend server running on your local machine or a remote server
- MongoDB database properly configured and running
- Node.js environment set up correctly

### Importing the Collection and Environment

1. Open Postman
2. Click on the "Import" button in the top left corner
3. Select the two JSON files provided in this folder:
   - `Mirror_API_Tests.postman_collection.json` (contains all the test requests)
   - `Mirror_API_Testing_Environment.postman_environment.json` (contains environment variables)
4. After importing, you should see a new collection called "Mirror API Tests" in your collections list

### Setting Up the Environment

1. In Postman, click on the environments dropdown in the top right corner
2. Select "Mirror API Testing Environment"
3. Make sure the following variables are set correctly:
   - `baseUrl`: The URL where your backend server is running (default: http://localhost:5000)
   - `testEmail`: An email that exists in your database for testing login (default: test@example.com)
   - `testPassword`: The corresponding password for the test email (default: TestPassword123!)
4. Click "Save" to confirm your environment settings

## Test Cases Overview

The test collection includes two main API test cases:

### 1. User Authentication (Login Endpoint)

Tests for the `/api/auth/login` endpoint with three scenarios:

#### Login - Successful
- **Purpose**: Verify that a user can successfully login with valid credentials
- **Assertions**:
  - Status code is 200
  - Response contains "Login successful" message
  - Response includes a valid JWT token
  - Response includes user data (id, name, email)
  - Response time is acceptable (< 1000ms)

#### Login - Invalid Credentials
- **Purpose**: Verify that login fails with incorrect credentials
- **Assertions**:
  - Status code is 400
  - Response contains "Invalid email or password" message

#### Login - Missing Fields
- **Purpose**: Verify validation for required fields
- **Assertions**:
  - Status code is 400
  - Response contains "All fields are required" message

### 2. Journal Creation (Create Journal Endpoint)

Tests for the `/api/journals` endpoint with three scenarios:

#### Create Journal Entry - Successful
- **Purpose**: Verify that an authenticated user can create a journal entry
- **Assertions**:
  - Status code is 201
  - Response includes journal data (id, content, user_id, createdAt)
  - Submitted content matches the response
  - Response time is acceptable (< 1000ms)

#### Create Journal Entry - Missing Content
- **Purpose**: Verify validation for required content field
- **Assertions**:
  - Status code is 400
  - Response contains "Content is required" message

#### Create Journal Entry - Unauthorized
- **Purpose**: Verify authentication requirement
- **Assertions**:
  - Status code is 401 (unauthorized)

## Running the Tests

### Preparing Test Data

Before running the tests, make sure you have:

1. Created a test user in your database with the email and password matching your environment variables
2. Started your backend server

### Test Execution

For proper test execution, follow this sequence:

1. Run the "Login - Successful" test first. This will automatically store the authentication token for subsequent requests.
2. After successful login, run the journal creation tests.

### Running the Collection as a Test Suite

To run all tests sequentially:

1. Click on the three dots (...) next to the "Mirror API Tests" collection
2. Select "Run collection"
3. In the Collection Runner window, select the "Mirror API Testing Environment"
4. Choose the order of the requests to ensure authentication happens first
5. Click "Run" to execute all tests and view the results

## Test Result Analysis

After running the tests, Postman will show:

- The total number of tests passed/failed
- Response time for each request
- Status codes received
- Test assertions results

Review any failed tests to identify and fix issues in your API implementation.

## Extending the Test Suite

You can extend these tests by:

1. Adding more test scenarios for existing endpoints
2. Creating tests for other endpoints (profile, journal updates/deletion)
3. Adding more advanced assertions
4. Creating test data setup and cleanup scripts

## Troubleshooting

Common issues and solutions:

- **Connection refused**: Ensure your backend server is running and the baseUrl is correct
- **Authentication failures**: Verify that the test user exists with the correct credentials
- **Token expired**: Run the login test again to get a fresh token
- **MongoDB connection issues**: Check your database connection in the backend

## Best Practices for API Testing

1. Always test both positive and negative scenarios
2. Validate response structure, not just status codes
3. Test with various input data types and edge cases
4. Ensure proper authentication and authorization testing
5. Check performance metrics (response time)
6. Use environment variables for flexibility
7. Keep tests independent of each other when possible

## Additional Resources

- [Postman Documentation](https://learning.postman.com/docs/getting-started/introduction/)
- [Writing Postman Tests](https://learning.postman.com/docs/writing-scripts/test-scripts/)
- [Automating Postman Tests](https://learning.postman.com/docs/running-collections/using-newman-cli/command-line-integration-with-newman/)