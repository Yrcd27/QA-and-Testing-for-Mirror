const jwt = require("jsonwebtoken");

// Improved authentication middleware
module.exports = (req, res, next) => {
  try {
    // Get token from Authorization header (Bearer token)
    const authHeader = req.header("Authorization");
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ 
        message: "Authentication failed: No valid Authorization header"
      });
    }
    
    const token = authHeader.split(" ")[1];
    
    // Verify the token with proper error handling
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      
      // Check for token expiration - additional layer of validation
      const currentTimestamp = Math.floor(Date.now() / 1000);
      if (decoded.exp && decoded.exp < currentTimestamp) {
        return res.status(401).json({ 
          message: "Token expired",
          code: "TOKEN_EXPIRED" 
        });
      }
      
      // Add user data to request object
      req.user = {
        id: decoded.id,
        email: decoded.email,
        // Don't include sensitive data in JWT payload
      };
      
      next();
    } catch (error) {
      if (error.name === 'TokenExpiredError') {
        return res.status(401).json({ 
          message: "Token expired", 
          code: "TOKEN_EXPIRED" 
        });
      } else if (error.name === 'JsonWebTokenError') {
        return res.status(401).json({ 
          message: "Invalid token", 
          code: "INVALID_TOKEN" 
        });
      } else {
        return res.status(401).json({ 
          message: "Authentication failed", 
          code: "AUTH_FAILED" 
        });
      }
    }
  } catch (err) {
    console.error("Auth middleware error:", err);
    res.status(500).json({ message: "Server error" });
  }
};