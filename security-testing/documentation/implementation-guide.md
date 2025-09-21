# Security Fixes Implementation Guide

This guide provides instructions for implementing the security fixes for the OWASP Top 10 vulnerabilities identified in the Mirror application.

## Prerequisites

- Node.js and npm installed
- Access to both backend and frontend codebases
- Ability to modify server configuration

## Implementation Steps

### 1. Authentication Security Fixes

#### Install Required Packages

```bash
# Navigate to backend directory
cd mirror-backend

# Install additional security packages
npm install cookie-parser express-rate-limit helmet
```

#### Create Refresh Token Model

1. Create the `RefreshToken.js` model in the `models` directory.
2. Copy the implementation from `security-testing/fixes/RefreshToken.js`.

#### Update Authentication Middleware

1. Replace the existing `authMiddleware.js` with the improved version from `security-testing/fixes/authMiddleware.js`.
2. This enhances token validation and error handling.

#### Update Authentication Routes

1. Replace the contents of `routes/authRoutes.js` with the secure implementation from `security-testing/fixes/authRoutes.js`.
2. This adds refresh token functionality, rate limiting, and secure password handling.

### 2. Access Control Security Fixes

#### Update Server Configuration

1. Replace the contents of `server.js` with the secure implementation from `security-testing/fixes/server.js`.
2. This adds proper CORS configuration, rate limiting, and security headers.

#### Update Environment Variables

1. Create a `.env` file in the backend root directory using `.env.example` as a template.
2. Ensure all required environment variables are set, especially JWT_SECRET.

#### Frontend API Configuration

1. Create a new file `src/utils/apiConfig.js` in the frontend project.
2. Copy the implementation from `security-testing/fixes/apiConfig.js`.
3. Create a `.env` file in the frontend root directory using `.env.frontend.example` as a template.

#### Update Frontend Components

Update all frontend components to use the new API configuration:

1. Replace direct axios imports with imports from the apiConfig.js file.
2. Remove all hardcoded API URLs.
3. Update API calls to use the appropriate module (authAPI, journalAPI, etc.).

Example of updated component:

```jsx
// Before
import axios from 'axios';
const res = await axios.get(`http://localhost:5000/api/journals?limit=10&page=${p}`, {
  headers: { Authorization: `Bearer ${token}` },
});

// After
import { journalAPI } from '../utils/apiConfig';
const res = await journalAPI.getJournals(p, 10);
```

### 3. Testing the Security Fixes

#### Test Authentication Flow

1. Test user registration with complex password
2. Test login functionality
3. Verify token refresh works correctly
4. Test logout and token invalidation

#### Test CORS and Access Control

1. Verify API requests work from allowed origins
2. Verify API requests are blocked from disallowed origins
3. Test rate limiting by making multiple quick requests

## Deployment Considerations

1. **Environment Variables**: Ensure all environment variables are properly set in production.
2. **HTTPS**: Configure HTTPS in production for secure communication.
3. **Monitoring**: Set up logging and monitoring for security events.
4. **Regular Updates**: Keep all dependencies updated to patch security vulnerabilities.

## Verification

After implementation, verify that:

1. Authentication works with the new secure token system
2. API requests are properly protected by CORS
3. Rate limiting prevents excessive requests
4. Tokens are securely stored and managed

## Troubleshooting

Common issues and solutions:

1. **CORS Errors**: Check that the frontend URL is correctly added to the allowed origins.
2. **Token Refresh Issues**: Ensure cookies are properly configured and the refresh route is working.
3. **Rate Limiting Problems**: Adjust rate limit settings if legitimate users are being blocked.