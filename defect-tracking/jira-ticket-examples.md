# Jira-Style Bug Template

Below is a sample Jira-style bug ticket template that you can use as a reference for how these bugs would appear in an actual issue tracking system like Jira or Bugzilla.

## BUG-001: JWT Token Not Refreshing Properly

**Type**: Bug  
**Status**: Resolved  
**Priority**: Highest  
**Severity**: Critical  
**Reporter**: QA Tester  
**Assignee**: Backend Developer  
**Sprint**: Sprint 14  
**Component/s**: Authentication  
**Fix Version/s**: v1.5.3  
**Due Date**: 2025-09-15  

**Description**:  
Users are being logged out unexpectedly before their session should expire because the JWT token refresh mechanism is not working correctly.

**Reproduction Steps**:
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

**Attachments**:
- Screenshot-JWT-Error.png
- Console-Log-Token-Expired.txt

**Epic Link**: User Authentication Improvements

**Time Tracking**:
- Original Estimate: 8h
- Time Spent: 6h
- Time Remaining: 0h

**Comments**:

*QA Tester - Sep 10, 2025*  
Created issue after multiple user reports of unexpected logouts.

*Backend Developer - Sep 11, 2025*  
Looking into this. Initial investigation shows issues with the token refresh mechanism.

*Backend Developer - Sep 12, 2025*  
Root cause identified - refresh token is stored insecurely and the refresh endpoint has implementation flaws. Working on a fix.

*Backend Developer - Sep 14, 2025*  
Fix implemented and pushed to development branch. Changes include:
1. Moving refresh token to HttpOnly cookies
2. Implementing proper token validation
3. Adding token rotation on refresh
4. Setting up axios interceptors for transparent token refresh

*QA Tester - Sep 15, 2025*  
Verified fix in development environment. No more unexpected logouts after 15 minutes. Session correctly maintained for 1 hour with automatic refresh.

*Project Manager - Sep 15, 2025*  
Approving for merge to main branch. Please schedule deployment for v1.5.3.

---

## BUG-002: XSS Vulnerability in Journal Entry Comments

**Type**: Bug  
**Status**: Resolved  
**Priority**: High  
**Severity**: Major  
**Reporter**: Security Tester  
**Assignee**: Frontend Developer  
**Sprint**: Sprint 14  
**Component/s**: Journal Module, Security  
**Fix Version/s**: v1.5.3  
**Due Date**: 2025-09-18  

**Description**:  
The journal entry comments section is vulnerable to Cross-Site Scripting attacks. Malicious script tags entered in comments are executed when the page is rendered.

**Reproduction Steps**:
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

**Attachments**:
- XSS-Alert-Proof.png
- DOM-Inspector-Screenshot.png

**Security Impact**:
- Potential for session stealing
- Possible user impersonation
- Risk of data theft
- OWASP Top 10: A7:2021-XSS

**Epic Link**: Security Hardening Initiative

**Time Tracking**:
- Original Estimate: 5h
- Time Spent: 4h
- Time Remaining: 0h

**Comments**:

*Security Tester - Sep 12, 2025*  
Discovered during security testing sprint. This is a significant security vulnerability that needs immediate attention.

*Frontend Developer - Sep 13, 2025*  
Investigating. The issue appears to be in the rendering of journal comments without proper sanitization.

*Frontend Developer - Sep 14, 2025*  
Fix implemented. Added DOMPurify library for sanitization of all user-generated content before rendering. Also added Content-Security-Policy headers to provide defense in depth.

*Security Tester - Sep 17, 2025*  
Verified fix. Attempted multiple XSS payload variations and none were executed. Content is properly escaped and rendered as text.

*Project Manager - Sep 17, 2025*  
Approving for merge to main branch. Please schedule security advisory with the release notes.

---

## BUG-003: Database Connection Timeout During High User Load

**Type**: Bug  
**Status**: In Progress  
**Priority**: High  
**Severity**: Major  
**Reporter**: Performance Tester  
**Assignee**: Backend Developer  
**Sprint**: Sprint 15  
**Component/s**: Database, API  
**Fix Version/s**: v1.6.0  
**Due Date**: 2025-09-25  

**Description**:  
During load testing, the application experiences database connection timeouts when concurrent user count exceeds 150 users. This causes API endpoints to return 500 Internal Server errors.

**Reproduction Steps**:
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

**Attachments**:
- JMeter-Test-Results.csv
- DB-Connection-Error-Logs.txt
- Performance-Graph.png

**Epic Link**: Scalability Improvements

**Time Tracking**:
- Original Estimate: 16h
- Time Spent: 8h
- Time Remaining: 8h

**Comments**:

*Performance Tester - Sep 16, 2025*  
Identified during load testing for the upcoming marketing campaign. This needs to be addressed before the expected traffic increase next month.

*Backend Developer - Sep 17, 2025*  
Initial investigation shows we're not properly managing the MongoDB connection pool. The default pool size is too small for our load pattern.

*Backend Developer - Sep 18, 2025*  
Working on implementing the following changes:
1. Increase MongoDB connection pool size
2. Add connection pooling monitoring
3. Implement retry mechanism for transient connection issues
4. Add circuit breaker pattern to prevent cascading failures

*DevOps Engineer - Sep 19, 2025*  
I've provisioned a larger test environment to help with this issue. Also considering adding MongoDB replica set to distribute read operations.

*Backend Developer - Sep 20, 2025*  
Progress update: Connection pooling configuration improved. Now seeing stable performance up to 180 users. Still working on the circuit breaker implementation to handle peak loads more gracefully.