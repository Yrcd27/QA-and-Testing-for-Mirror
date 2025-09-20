# API Test Cases Documentation

## Test Case 1: User Authentication (Login)

### Test ID: API-AUTH-001

**Objective**: Verify that the login endpoint correctly authenticates users and returns appropriate responses for various scenarios.

**Prerequisites**:
- Backend server is running
- Test user exists in the database with credentials:
  - Email: test@example.com
  - Password: password123

### Test Scenarios:

#### 1.1: Successful Login

**Steps**:
1. Send a POST request to `/api/auth/login`
2. Include valid credentials in the request body:
   ```json
   {
     "email": "test@example.com",
     "password": "password123"
   }
   ```

**Expected Results**:
- Status code: 200 OK
- Response includes:
  - Success message: "Login successful"
  - Valid JWT token
  - User data (id, name, email)
- Response time < 1000ms

**Actual Results**: [To be filled during testing]

**Status**: [Pass/Fail]

#### 1.2: Invalid Credentials

**Steps**:
1. Send a POST request to `/api/auth/login`
2. Include invalid credentials in the request body:
   ```json
   {
     "email": "wrong@example.com",
     "password": "wrongpassword"
   }
   ```

**Expected Results**:
- Status code: 400 Bad Request
- Response includes error message: "Invalid email or password"

**Actual Results**: [To be filled during testing]

**Status**: [Pass/Fail]

#### 1.3: Missing Fields

**Steps**:
1. Send a POST request to `/api/auth/login`
2. Include empty credentials in the request body:
   ```json
   {
     "email": "",
     "password": ""
   }
   ```

**Expected Results**:
- Status code: 400 Bad Request
- Response includes error message: "All fields are required"

**Actual Results**: [To be filled during testing]

**Status**: [Pass/Fail]

---

## Test Case 2: Journal Creation

### Test ID: API-JOURNAL-001

**Objective**: Verify that the journal creation endpoint correctly creates journal entries and validates input.

**Prerequisites**:
- Backend server is running
- Test user is logged in
- Authentication token is available

### Test Scenarios:

#### 2.1: Successful Journal Creation

**Steps**:
1. Send a POST request to `/api/journals`
2. Include authentication token in the Authorization header: `Bearer {token}`
3. Include journal data in the request body:
   ```json
   {
     "content": "This is a test journal entry",
     "mood": "happy"
   }
   ```

**Expected Results**:
- Status code: 201 Created
- Response includes:
  - Journal ID
  - Content matching input
  - Mood matching input
  - User ID
  - Creation timestamp
- Response time < 1000ms

**Actual Results**: [To be filled during testing]

**Status**: [Pass/Fail]

#### 2.2: Missing Content Validation

**Steps**:
1. Send a POST request to `/api/journals`
2. Include authentication token in the Authorization header: `Bearer {token}`
3. Include journal data with empty content:
   ```json
   {
     "content": "",
     "mood": "happy"
   }
   ```

**Expected Results**:
- Status code: 400 Bad Request
- Response includes error message: "Content is required"

**Actual Results**: [To be filled during testing]

**Status**: [Pass/Fail]

#### 2.3: Unauthorized Access

**Steps**:
1. Send a POST request to `/api/journals`
2. Do NOT include authentication token
3. Include valid journal data:
   ```json
   {
     "content": "This is a test journal entry",
     "mood": "happy"
   }
   ```

**Expected Results**:
- Status code: 401 Unauthorized

**Actual Results**: [To be filled during testing]

**Status**: [Pass/Fail]

#### 2.4: Get Journal Entries

**Steps**:
1. Send a GET request to `/api/journals?page=1&limit=10`
2. Include authentication token in the Authorization header: `Bearer {token}`

**Expected Results**:
- Status code: 200 OK
- Response includes:
  - Array of journal items
  - Pagination data (page, limit, hasMore)
  - Each journal entry contains ID, creation date, and content excerpt

**Actual Results**: [To be filled during testing]

**Status**: [Pass/Fail]

---

## Test Case Execution Report

| Test ID | Test Name | Status | Comments |
|---------|-----------|--------|----------|
| API-AUTH-001-1.1 | Successful Login | | |
| API-AUTH-001-1.2 | Invalid Credentials | | |
| API-AUTH-001-1.3 | Missing Fields | | |
| API-JOURNAL-001-2.1 | Successful Journal Creation | | |
| API-JOURNAL-001-2.2 | Missing Content Validation | | |
| API-JOURNAL-001-2.3 | Unauthorized Access | | |
| API-JOURNAL-001-2.4 | Get Journal Entries | | |

---

## Bug Report Template

If any test fails, use this template to report the bug:

### Bug ID: [e.g., BUG-001]

**Test Case Reference**: [Test ID]

**Severity**: [Critical/High/Medium/Low]

**Description**: 
[Detailed description of the bug]

**Steps to Reproduce**:
1. [Step 1]
2. [Step 2]
3. [Step 3]

**Expected Result**:
[What should happen]

**Actual Result**:
[What actually happened]

**Screenshots/Logs**:
[If applicable]

**Additional Notes**:
[Any other relevant information]