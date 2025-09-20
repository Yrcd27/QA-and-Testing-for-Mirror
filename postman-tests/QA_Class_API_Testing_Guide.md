# API Testing Guide for QA & Testing Class

This guide is designed to help you understand how to implement and use API testing for your MERN project using Postman.

## What is API Testing?

API testing is a type of software testing that focuses on validating the functionality, reliability, performance, and security of application programming interfaces (APIs). In a MERN stack application, API testing ensures that the backend Node.js/Express server properly handles requests and delivers correct responses.

## Why API Testing is Important

1. **Early Bug Detection**: Find issues in the API before they affect the frontend
2. **Independent Testing**: Test backend functionality without needing a UI
3. **Integration Validation**: Ensure components work together properly
4. **Performance Assessment**: Measure response times and efficiency
5. **Security Verification**: Test authentication and authorization

## API Testing Implementation for Mirror Journal App

### Test Environment Setup

For this project, we've created a complete Postman testing suite with:

1. **Collection File**: Contains all the API test requests and assertions
2. **Environment File**: Contains variables like base URL and test credentials
3. **Documentation**: Detailed explanation of each test case
4. **Setup Script**: Helper script to create a test user

### Files Included in This Package

- `Mirror_API_Tests.postman_collection.json`
- `Mirror_API_Testing_Environment.postman_environment.json`
- `API_Testing_Documentation.md`
- `Test_Cases_Documentation.md`
- `setup-test-user.js`
- `package.json`
- `README.md`

## How to Execute the Tests (Step-by-Step Guide)

### 1. Setting Up Postman

1. Download and install Postman from [https://www.postman.com/downloads/](https://www.postman.com/downloads/)
2. Create a Postman account (free) or skip login if preferred
3. Import the collection and environment files:
   - Click "Import" in the top-left corner
   - Select the two JSON files provided in this folder
   - Confirm the import

### 2. Preparing Your Test Environment

1. Make sure your backend server (mirror-backend) is running:
   ```
   cd ../mirror-backend
   npm start
   ```

2. Create a test user using the provided script:
   ```
   cd ../postman-tests
   npm install
   npm run setup
   ```

3. In Postman, select the "Mirror API Testing Environment" from the dropdown menu in the top-right corner

### 3. Running the Tests

#### Method 1: Run Individual Tests

1. Expand the "Mirror API Tests" collection in the left sidebar
2. Expand the "Authentication" folder
3. Click on "Login - Successful"
4. Click the "Send" button to execute the request
5. View the test results in the "Tests" tab of the response panel
6. Continue with other tests in sequence

#### Method 2: Run as a Collection

1. Click on the three dots (...) next to the "Mirror API Tests" collection
2. Select "Run collection"
3. In the Collection Runner:
   - Ensure all tests are selected
   - Choose the correct environment
   - Set iterations to 1
   - Click "Run"
4. View the test results summary

## Test Case Analysis

### Authentication Tests

These tests validate the login functionality:

1. **Successful Login**: Tests that valid credentials return a token
2. **Invalid Credentials**: Tests that wrong credentials are rejected
3. **Missing Fields**: Tests validation for required fields

Key aspects to analyze:
- Is the token properly generated?
- Are error messages clear and helpful?
- Is validation working correctly?

### Journal Creation Tests

These tests validate the journal entry creation:

1. **Successful Creation**: Tests creating a journal entry
2. **Missing Content**: Tests validation for required content
3. **Unauthorized Access**: Tests authentication requirements
4. **Get Entries**: Tests retrieving journal entries

Key aspects to analyze:
- Is authentication required and working?
- Is data validation working?
- Is the created data accurately stored?
- Is pagination working for data retrieval?

## Writing Your Own Tests

To extend this test suite with additional tests:

1. **Clone an existing request**: Right-click an existing request and select "Duplicate"
2. **Modify the request details**:
   - Change the endpoint URL
   - Modify headers or body data
   - Update the test name and description

3. **Write test assertions**:
   - Click on the "Tests" tab in the request
   - Use Postman's test script syntax to add assertions:

   ```javascript
   pm.test("Your test name", function () {
       pm.response.to.have.status(200);
       var jsonData = pm.response.json();
       pm.expect(jsonData.property).to.eql("expected value");
   });
   ```

## Common API Testing Patterns to Implement

1. **CRUD Operations**:
   - Create (POST)
   - Read (GET)
   - Update (PUT/PATCH)
   - Delete (DELETE)

2. **Validation Testing**:
   - Missing required fields
   - Invalid data formats
   - Boundary values

3. **Authentication Testing**:
   - Valid credentials
   - Invalid credentials
   - Expired tokens
   - Insufficient permissions

4. **Error Handling**:
   - Server errors (500 series)
   - Client errors (400 series)
   - Custom error messages

## Reporting API Test Results

When submitting your API test results for the QA & Testing class:

1. **Test Execution Report**: Complete the table in Test_Cases_Documentation.md
2. **Screenshots**: Include screenshots of passed/failed tests
3. **Bug Reports**: Fill out the bug report template for any failures
4. **Analysis**: Write a brief analysis of what you discovered

## Automating API Tests

For continuous integration, you can:

1. Export Postman tests to Newman (Postman's CLI runner):
   ```
   npm install -g newman
   newman run Mirror_API_Tests.postman_collection.json -e Mirror_API_Testing_Environment.postman_environment.json
   ```

2. Add automated API testing to your project's CI/CD pipeline

## Conclusion

API testing is a critical component of quality assurance for web applications. By systematically testing your APIs with Postman, you can ensure reliability, performance, and security of your backend services.

## Additional Resources

- [Postman Learning Center](https://learning.postman.com/docs/getting-started/introduction/)
- [API Testing Best Practices](https://www.guru99.com/api-testing.html)
- [Newman Documentation](https://learning.postman.com/docs/running-collections/using-newman-cli/command-line-integration-with-newman/)