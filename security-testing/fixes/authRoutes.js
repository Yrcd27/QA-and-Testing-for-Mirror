const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const User = require("../models/User");
const RefreshToken = require("../models/RefreshToken");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

// Helper functions for security
const generateTokens = async (user, req) => {
  // Access token - short lived (15 minutes)
  const accessToken = jwt.sign(
    { id: user._id, email: user.email },
    process.env.JWT_SECRET,
    { expiresIn: "15m" } // Shorter expiration time for security
  );
  
  // Refresh token - longer lived (7 days)
  const refreshTokenString = crypto.randomBytes(40).toString("hex");
  
  // Store refresh token with device info
  const refreshToken = new RefreshToken({
    user_id: user._id,
    token: refreshTokenString,
    ip: req.ip,
    userAgent: req.headers["user-agent"] || "unknown",
    isValid: true,
    expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
  });
  
  await refreshToken.save();
  
  return {
    accessToken,
    refreshToken: refreshTokenString,
  };
};

// Rate limiting variables (simple implementation)
const loginAttempts = {};
const MAX_ATTEMPTS = 5;
const LOCKOUT_TIME = 15 * 60 * 1000; // 15 minutes

// Input validation middleware
const validateLoginInput = (req, res, next) => {
  const { email, password } = req.body;
  
  // Email validation
  if (!email || typeof email !== 'string') {
    return res.status(400).json({ message: "Valid email is required" });
  }
  
  // Password validation
  if (!password || typeof password !== 'string') {
    return res.status(400).json({ message: "Password is required" });
  }
  
  next();
};

// User signup - with improved validation
router.post("/signup", async (req, res) => {
  try {
    const { Name, email, password } = req.body;

    // Enhanced validation
    if (!Name || typeof Name !== 'string' || Name.length < 2) {
      return res.status(400).json({ message: "Name must be at least 2 characters" });
    }
    
    if (!email || !email.includes('@') || !email.includes('.')) {
      return res.status(400).json({ message: "Valid email is required" });
    }

    // Stronger password requirements
    if (!password || password.length < 8) {
      return res.status(400).json({
        message: "Password must be at least 8 characters long"
      });
    }
    
    // Check for password complexity
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumbers = /[0-9]/.test(password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);
    
    if (!(hasUpperCase && hasLowerCase && hasNumbers && hasSpecialChar)) {
      return res.status(400).json({
        message: "Password must contain uppercase, lowercase, number, and special character"
      });
    }

    // Check if email already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email already exists" });
    }

    // Increased cost factor for bcrypt (10 → 12) for stronger hashing
    const hashedPassword = await bcrypt.hash(password, 12);

    // Create new user
    const newUser = new User({ Name, email, password: hashedPassword });
    await newUser.save();

    res.status(201).json({ message: "User registered successfully" });
  } catch (err) {
    console.error("Signup error:", err);
    res.status(500).json({ message: "Server error during registration" });
  }
});

// User login with rate limiting
router.post("/login", validateLoginInput, async (req, res) => {
  try {
    const { email, password } = req.body;
    const ipAddress = req.ip;
    
    // Check for too many login attempts
    if (loginAttempts[ipAddress]) {
      const attempts = loginAttempts[ipAddress];
      
      if (attempts.count >= MAX_ATTEMPTS && Date.now() - attempts.timestamp < LOCKOUT_TIME) {
        return res.status(429).json({ 
          message: "Too many failed login attempts. Please try again later." 
        });
      }
      
      // Reset if lockout period has passed
      if (Date.now() - attempts.timestamp >= LOCKOUT_TIME) {
        loginAttempts[ipAddress] = { count: 1, timestamp: Date.now() };
      }
    } else {
      // First attempt
      loginAttempts[ipAddress] = { count: 1, timestamp: Date.now() };
    }

    // Find user
    const user = await User.findOne({ email });
    if (!user) {
      // Track failed attempt
      loginAttempts[ipAddress].count++;
      loginAttempts[ipAddress].timestamp = Date.now();
      
      // Use the same message for both cases to prevent user enumeration
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // Compare passwords
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      // Track failed attempt
      loginAttempts[ipAddress].count++;
      loginAttempts[ipAddress].timestamp = Date.now();
      
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // Success - generate tokens
    const tokens = await generateTokens(user, req);

    // Reset login attempts on success
    delete loginAttempts[ipAddress];

    // Set refresh token in HTTP-only cookie
    res.cookie('refreshToken', tokens.refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production', // Only send over HTTPS in production
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    // Send access token in response body
    res.json({
      message: "Login successful",
      token: tokens.accessToken, // Access token for immediate use
      user: { id: user._id, name: user.Name, email: user.email }
    });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ message: "Server error during login" });
  }
});

// Token refresh endpoint
router.post("/refresh-token", async (req, res) => {
  try {
    // Get refresh token from cookie
    const refreshTokenFromCookie = req.cookies?.refreshToken;
    
    // Alternatively, get from request body (less secure but more compatible)
    const refreshTokenFromBody = req.body.refreshToken;
    
    const refreshToken = refreshTokenFromCookie || refreshTokenFromBody;
    
    if (!refreshToken) {
      return res.status(401).json({ message: "Refresh token required" });
    }
    
    // Find the token in database
    const storedToken = await RefreshToken.findOne({ 
      token: refreshToken,
      isValid: true,
      expiresAt: { $gt: new Date() }
    });
    
    if (!storedToken) {
      return res.status(401).json({ message: "Invalid or expired refresh token" });
    }
    
    // Get associated user
    const user = await User.findById(storedToken.user_id);
    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }
    
    // Generate new tokens
    const tokens = await generateTokens(user, req);
    
    // Invalidate the old refresh token (one-time use)
    storedToken.isValid = false;
    await storedToken.save();
    
    // Set new refresh token in cookie
    res.cookie('refreshToken', tokens.refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });
    
    // Return new access token
    res.json({
      accessToken: tokens.accessToken,
    });
  } catch (err) {
    console.error("Refresh token error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// Logout endpoint
router.post("/logout", authMiddleware, async (req, res) => {
  try {
    // Get refresh token from cookie
    const refreshToken = req.cookies?.refreshToken || req.body.refreshToken;
    
    if (refreshToken) {
      // Invalidate the refresh token
      await RefreshToken.updateOne(
        { token: refreshToken },
        { isValid: false }
      );
    }
    
    // Clear the refresh token cookie
    res.clearCookie('refreshToken');
    
    res.json({ message: "Logged out successfully" });
  } catch (err) {
    console.error("Logout error:", err);
    res.status(500).json({ message: "Server error during logout" });
  }
});

// Get current user (protected route example)
router.get("/me", authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json(user);
  } catch (err) {
    console.error("Get user error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;