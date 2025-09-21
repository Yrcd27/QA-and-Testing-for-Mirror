## OWASP Vulnerability Fix 2: Broken Access Control & CORS Configuration

### Vulnerability: A01:2021 - Broken Access Control

#### Original Implementation Issues:

```javascript
// Original server.js with basic CORS
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const authRoutes = require("./routes/authRoutes");
const journalRoutes = require("./routes/journalRoutes");
const profileRoutes = require("./routes/profileRoutes"); 

const app = express();

// Middleware
app.use(cors());  // Basic CORS with no restrictions
app.use(express.json());

app.use("/api/auth", authRoutes);        
app.use("/api/journals", journalRoutes); 
app.use("/api/profile", profileRoutes);  


mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB connected");
    app.listen(process.env.PORT, () =>
      console.log(`Server running on port ${process.env.PORT}`)
    );
  })
  .catch((err) => console.log(err));
```

```jsx
// Original frontend API call with hardcoded URL
const loadPage = async (p = 1, replace = false) => {
  if (fetching.current) return;
  fetching.current = true;
  try {
    setLoading(p === 1 && replace); 
    const token = localStorage.getItem("token");
    const res = await axios.get(`http://localhost:5000/api/journals?limit=10&page=${p}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const { items: newItems, hasMore: more } = res.data;
    setItems(replace ? newItems : [...items, ...newItems]);
    setHasMore(more);
    setPage(p + 1);
    setFadeIn(true);
  } catch (err) {
    console.error(err);
  } finally {
    fetching.current = false;
    setLoading(false);
  }
};
```

#### Security Issues:

1. **Permissive CORS configuration**: 
   - No origin restrictions, allowing any website to make requests to the API
   - No proper credential handling or preflight configuration
   - Missing security headers and proper CORS policy

2. **Hardcoded API URLs**:
   - API URLs hardcoded in frontend components
   - No centralized API configuration
   - No environment variable usage for base URLs
   - Different deployment environments would require code changes

3. **Missing rate limiting**:
   - No protection against API abuse or DDoS attacks
   - Endpoints could be hammered with requests

4. **Insufficient error handling**:
   - No proper error handling for security-related failures
   - Error information leakage in responses

#### Security Fixes:

1. **Enhanced CORS configuration**:
   - Implemented whitelist-based CORS policy
   - Proper configuration of allowed origins, methods, and headers
   - Enabled credentials for secure cookie handling
   - Added preflight caching for performance

2. **Centralized API Configuration**:
   - Created a centralized API client configuration
   - Environment variables for API URLs
   - Organized API calls by resource type
   - Implemented token handling and refresh logic

3. **Added comprehensive rate limiting**:
   - General API rate limits to prevent abuse
   - Stricter limits on authentication endpoints
   - Proper rate limit headers and messages

4. **Enhanced security headers and error handling**:
   - Added Helmet.js for securing HTTP headers
   - Implemented proper error handling without leaking details
   - Added content security policy headers

5. **Improved MongoDB connection security**:
   - Added SSL for database connections
   - Better error handling for database issues

These improvements significantly enhance the application's protection against broken access control vulnerabilities (OWASP A01:2021) by implementing proper API access controls, securing cross-origin requests, and preventing abuse through rate limiting.