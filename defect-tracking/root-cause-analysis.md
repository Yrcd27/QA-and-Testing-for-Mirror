# Root Cause Analysis

## Bug ID: BUG-001 - JWT Token Not Refreshing Properly

### Issue Summary

Users are being logged out unexpectedly before their session should expire because the JWT token refresh mechanism is not working correctly. This occurs after approximately 15 minutes of activity, even though the token should be valid for longer.

### Root Cause Analysis

#### What Happened?

The application was using JWT tokens for authentication with an access token validity of 15 minutes and a refresh token validity of 7 days. However, the token refresh mechanism was failing because:

1. The refresh token endpoint (`/api/auth/refresh`) was implemented incorrectly
2. The frontend was not properly storing the refresh token in HttpOnly cookies
3. The timing for token refresh was misconfigured, causing it to attempt refresh after the token had already expired

#### Why It Happened?

Upon investigating the code, the following issues were identified:

1. **Backend Issues**:
   ```javascript
   // In authRoutes.js
   // INCORRECT IMPLEMENTATION
   router.post('/refresh', async (req, res) => {
     const { refreshToken } = req.body; // Getting token from request body is insecure
     
     if (!refreshToken) {
       return res.status(401).json({ message: 'No refresh token provided' });
     }
     
     try {
       const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
       // No check if the refresh token exists in the database or if it's been revoked
       
       const accessToken = jwt.sign(
         { userId: decoded.userId },
         process.env.ACCESS_TOKEN_SECRET,
         { expiresIn: '15m' }
       );
       
       res.json({ accessToken });
     } catch (error) {
       res.status(401).json({ message: 'Invalid refresh token' });
     }
   });
   ```

2. **Frontend Issues**:
   ```javascript
   // In apiConfig.js
   // INCORRECT IMPLEMENTATION
   const refreshToken = async () => {
     try {
       const refreshToken = localStorage.getItem('refreshToken'); // Storing in localStorage is insecure
       
       const response = await axios.post('/api/auth/refresh', { refreshToken });
       const { accessToken } = response.data;
       
       localStorage.setItem('token', accessToken);
       return accessToken;
     } catch (error) {
       // No proper error handling or fallback
       localStorage.removeItem('token');
       localStorage.removeItem('refreshToken');
       window.location.href = '/login';
     }
   };
   ```

3. **Security Configuration Issues**:
   - Refresh tokens were stored in localStorage instead of HttpOnly cookies
   - CSRF protection was not implemented
   - Token validation did not include proper checks against a token blacklist

#### How It Was Fixed

##### Backend Fixes:

```javascript
// In security-testing/fixes/authRoutes.js
router.post('/refresh', async (req, res) => {
  // Get the refresh token from HttpOnly cookie
  const refreshToken = req.cookies.refreshToken;
  
  if (!refreshToken) {
    return res.status(401).json({ message: 'No refresh token provided' });
  }
  
  try {
    // Verify the refresh token
    const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
    
    // Check if the token exists in the database and hasn't been revoked
    const tokenDoc = await RefreshToken.findOne({ 
      token: refreshToken,
      userId: decoded.userId,
      revoked: false 
    });
    
    if (!tokenDoc) {
      return res.status(401).json({ message: 'Invalid refresh token' });
    }
    
    // Create new tokens
    const accessToken = jwt.sign(
      { userId: decoded.userId },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: '1h' } // Extended from 15m to 1h
    );
    
    const newRefreshToken = jwt.sign(
      { userId: decoded.userId },
      process.env.REFRESH_TOKEN_SECRET,
      { expiresIn: '7d' }
    );
    
    // Revoke the old refresh token
    tokenDoc.revoked = true;
    await tokenDoc.save();
    
    // Save the new refresh token
    await RefreshToken.create({
      userId: decoded.userId,
      token: newRefreshToken,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      revoked: false
    });
    
    // Set the refresh token as HttpOnly cookie
    res.cookie('refreshToken', newRefreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
    });
    
    res.json({ accessToken });
  } catch (error) {
    res.status(401).json({ message: 'Invalid refresh token' });
  }
});
```

##### Frontend Fixes:

```javascript
// In security-testing/fixes/apiConfig.js
// Setting up axios interceptors
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    
    // If error is 401 and we haven't tried to refresh yet
    if (error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      try {
        // Call refresh endpoint (cookies are sent automatically)
        const response = await axios.post('/api/auth/refresh');
        const { accessToken } = response.data;
        
        // Store the new access token
        localStorage.setItem('token', accessToken);
        
        // Update the Authorization header
        originalRequest.headers['Authorization'] = `Bearer ${accessToken}`;
        axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;
        
        // Retry the original request
        return axiosInstance(originalRequest);
      } catch (refreshError) {
        // Handle refresh failure - redirect to login
        localStorage.removeItem('token');
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }
    
    return Promise.reject(error);
  }
);

// Token refresh happens automatically with the interceptor
// No need for a separate refreshToken function
```

##### Additional Security Fixes:

1. Created a dedicated `RefreshToken` model to track and manage refresh tokens:

```javascript
// In security-testing/fixes/RefreshToken.js
const mongoose = require('mongoose');

const RefreshTokenSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  token: {
    type: String,
    required: true
  },
  expiresAt: {
    type: Date,
    required: true
  },
  revoked: {
    type: Boolean,
    default: false
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Add indexes for faster lookups
RefreshTokenSchema.index({ token: 1 });
RefreshTokenSchema.index({ userId: 1 });
RefreshTokenSchema.index({ expiresAt: 1 });

// Add method to check if token is expired
RefreshTokenSchema.methods.isExpired = function() {
  return this.expiresAt < new Date();
};

const RefreshToken = mongoose.model('RefreshToken', RefreshTokenSchema);

module.exports = RefreshToken;
```

2. Updated server configuration to enhance security:

```javascript
// In security-testing/fixes/server.js
// Added CORS configuration
app.use(cors({
  origin: process.env.CLIENT_URL,
  credentials: true
}));

// Added cookie parser
app.use(cookieParser());

// Added CSRF protection
app.use(csrf({ cookie: true }));
app.use((req, res, next) => {
  res.cookie('XSRF-TOKEN', req.csrfToken());
  next();
});
```

### Prevention Strategies

To prevent similar issues in the future, the following measures have been implemented:

1. **Code Review Process**:
   - Implemented mandatory security-focused code reviews for all authentication-related code
   - Created a security checklist for reviewers to follow
   - Added automated security linting rules to CI/CD pipeline

2. **Testing Enhancements**:
   - Added specific unit tests for token refresh functionality
   - Created integration tests that verify the full authentication flow
   - Implemented automated security scanning in the CI/CD pipeline

3. **Documentation and Standards**:
   - Developed authentication best practices document for the development team
   - Created a security standards guide for handling JWT tokens
   - Implemented regular security training sessions for developers

4. **Monitoring and Alerting**:
   - Added logging for authentication failures
   - Set up alerts for unusual authentication patterns
   - Implemented monitoring for token-related operations

### Lessons Learned

1. **Security by Design**: Authentication mechanisms should be designed with security as a priority from the beginning, not as an afterthought.

2. **Proper Token Storage**: Always store sensitive tokens (like refresh tokens) in HttpOnly cookies, never in localStorage.

3. **Token Management**: Implement proper token lifecycle management, including revocation capabilities.

4. **Testing Edge Cases**: Test authentication flows thoroughly, including edge cases like token expiry and refresh scenarios.

5. **Error Handling**: Implement robust error handling for authentication failures to provide a good user experience while maintaining security.