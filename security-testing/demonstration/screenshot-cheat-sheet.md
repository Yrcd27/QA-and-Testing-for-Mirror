# Security Testing Screenshots Cheat Sheet

This document provides a quick reference for capturing all necessary screenshots for documenting the security improvements in the Mirror application.

## Authentication Security Screenshots

| Screenshot ID | Description | How to Capture |
|---------------|-------------|----------------|
| 1 | Password Complexity Requirements | 1. Go to signup page<br>2. Enter weak password (e.g., "pass123")<br>3. Submit form<br>4. Capture error message |
| 2 | HTTP-only Refresh Token Cookie | 1. Login to the application<br>2. Open dev tools (F12)<br>3. Go to Application > Storage > Cookies<br>4. Capture the refreshToken cookie showing HTTP-only flag |
| 3 | Access Token in Local Storage | 1. After logging in<br>2. Open dev tools<br>3. Go to Application > Storage > Local Storage<br>4. Capture the token value |
| 4 | Token Refresh Mechanism | 1. Open dev tools Network tab<br>2. Modify access token to be invalid<br>3. Perform authenticated action<br>4. Capture the refresh token request |
| 5 | New Access Token After Refresh | 1. After token refresh occurs<br>2. Go to Application > Storage > Local Storage<br>3. Capture the new token value |
| 6 | Rate Limiting Protection | 1. In Postman, send multiple failed login attempts<br>2. Capture the rate limit error response |
| 7 | Rate Limit Headers | 1. In Postman response headers<br>2. Capture headers showing rate limit info |

## Access Control Screenshots

| Screenshot ID | Description | How to Capture |
|---------------|-------------|----------------|
| 8 | CORS Protection | 1. Open a different site (e.g., jsfiddle.net)<br>2. Try to fetch from your API<br>3. Capture console showing CORS error |
| 9 | Successful Authorized Request | 1. In application, perform authenticated action<br>2. Capture Network tab showing successful API call |
| 10 | CORS Headers | 1. In Network tab, select a response<br>2. Go to Headers tab<br>3. Capture CORS-related headers |
| 11 | Centralized API Config | 1. In Sources tab, find apiConfig.js<br>2. Capture code showing centralized configuration |
| 12 | API Request Using Config | 1. Set breakpoint in API call<br>2. Perform action<br>3. Capture debugger showing request using config |
| 13 | API Rate Limiting | 1. In Postman, send many rapid requests to API<br>2. Capture rate limit error response |
| 14 | API Rate Limit Headers | 1. In Postman response headers<br>2. Capture headers showing API rate limit info |

## Additional Security Screenshots

| Screenshot ID | Description | How to Capture |
|---------------|-------------|----------------|
| 15 | Secure HTTP Headers | 1. Make any request to application<br>2. In Network tab, select response<br>3. Go to Headers tab<br>4. Capture security-related headers |
| 16 | Secure Error Handling | 1. Cause an error (e.g., access invalid resource)<br>2. Capture error response showing sanitized message |

## Before/After Comparison Screenshots

For each of the following areas, try to create before/after comparison screenshots if possible:

1. **JWT Implementation**:
   - Before: Original JWT code with simple token generation
   - After: Enhanced JWT code with refresh tokens

2. **CORS Configuration**:
   - Before: Basic CORS setup with no restrictions
   - After: Enhanced CORS with proper origin restrictions

3. **Password Validation**:
   - Before: Basic password length check
   - After: Comprehensive password validation

4. **API Request Pattern**:
   - Before: Hardcoded API URLs in components
   - After: Centralized API configuration usage

## Screenshot Annotations

For clear documentation, consider adding annotations to your screenshots:

1. Use red boxes or circles to highlight important elements
2. Add numbered callouts to explain specific features
3. Blur or black out any sensitive information
4. Include descriptive captions with each screenshot

## Organizing Screenshots

Name your screenshots systematically for easy reference:

```
security-screenshot-[category]-[number]-[brief-description].png
```

Examples:
- security-screenshot-auth-01-password-requirements.png
- security-screenshot-cors-01-unauthorized-origin.png

Store all screenshots in the `security-testing/demonstration/screenshots` directory.

## Screenshot Checklist

Use this checklist to ensure you've captured all necessary screenshots:

- [ ] Password complexity requirements
- [ ] HTTP-only refresh token cookie
- [ ] Access token in local storage
- [ ] Token refresh mechanism
- [ ] New access token after refresh
- [ ] Rate limiting protection
- [ ] Rate limit headers
- [ ] CORS protection for unauthorized origins
- [ ] Successful request from authorized origin
- [ ] CORS headers for authorized origin
- [ ] Centralized API configuration
- [ ] API request using centralized configuration
- [ ] API rate limiting protection
- [ ] API rate limit headers
- [ ] Secure HTTP headers
- [ ] Secure error handling