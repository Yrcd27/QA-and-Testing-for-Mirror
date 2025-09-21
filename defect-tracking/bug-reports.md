# Bug Reports

## Bug ID: BUG-001

**Summary**: JWT Token Not Refreshing Properly Leading to Premature Session Expiry

**Description**:  
Users are being logged out unexpectedly before their session should expire because the JWT token refresh mechanism is not working correctly. This occurs after approximately 15 minutes of activity, even though the token should be valid for longer.

**Severity**: Critical

**Steps to Reproduce**:
1. Log in to the Mirror application with valid credentials
2. Keep the application open but do not interact with it for 15 minutes
3. Attempt to access a protected route (e.g., journal entries)
4. Observe that the user is redirected to the login page

**Expected Result**:  
The application should automatically refresh the JWT token in the background and maintain the user session for the configured duration (1 hour).

**Actual Result**:  
User is logged out after approximately 15 minutes and redirected to the login page, losing any unsaved data.

**Environment**:
- Browser: Chrome 128.0.6558.81
- OS: Windows 10
- Frontend Version: 2.3.0
- Backend Version: 1.5.2

**Screenshots/Evidence**:
- Console error showing: "Authentication error: Token expired"
- Network tab showing 401 Unauthorized response from the API

**Impact**:
This issue significantly affects user experience, potentially causing data loss and frustration for all users of the application.

---

## Bug ID: BUG-002

**Summary**: Cross-Site Scripting (XSS) Vulnerability in Journal Entry Comments

**Description**:  
The journal entry comments section is vulnerable to Cross-Site Scripting attacks. Malicious script tags entered in comments are executed when the page is rendered, allowing potential attackers to steal session information or perform actions on behalf of other users.

**Severity**: Major

**Steps to Reproduce**:
1. Log in to the Mirror application
2. Navigate to the journal entries section
3. Create a new journal entry or edit an existing one
4. In the comments section, enter the following text: `<script>alert('XSS vulnerability')</script>`
5. Save the journal entry
6. View the journal entry

**Expected Result**:  
The script tag should be sanitized and displayed as text, not executed.

**Actual Result**:  
The JavaScript alert is executed, demonstrating that the input is not being properly sanitized.

**Environment**:
- Browser: Firefox 124.0.1
- OS: Windows 11
- Frontend Version: 2.3.0
- Backend Version: 1.5.2

**Screenshots/Evidence**:
- Screenshot showing the alert dialog
- Browser inspector showing the unescaped script tag in the DOM

**Impact**:
This vulnerability could allow attackers to:
- Steal user session cookies
- Perform actions on behalf of users
- Redirect users to malicious websites
- Deface the application content

---

## Bug ID: BUG-003

**Summary**: Database Connection Timeout During High User Load

**Description**:  
During load testing, the application experiences database connection timeouts when concurrent user count exceeds 150 users. This causes API endpoints to return 500 Internal Server errors and disrupts user workflows.

**Severity**: Major

**Steps to Reproduce**:
1. Execute load test using JMeter with 150+ concurrent virtual users
2. Run test for at least 5 minutes targeting the login and journal API endpoints
3. Observe backend logs and API responses

**Expected Result**:  
The application should handle 200+ concurrent users as per the requirements specification without database connection errors.

**Actual Result**:  
After approximately 3 minutes with 150+ concurrent users, database connection errors appear in the logs and API endpoints start returning 500 errors.

**Environment**:
- Test Environment: AWS EC2 t2.medium instance
- Database: MongoDB 5.0.14
- Backend Version: 1.5.2
- Test Tool: Apache JMeter 5.5

**Screenshots/Evidence**:
- JMeter test results showing increased error rate after 3 minutes
- Server logs showing database connection timeout errors
- Performance graph showing response time degradation

**Impact**:
This issue would affect the application during peak usage times, potentially causing service disruption for a significant number of users.