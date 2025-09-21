const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const helmet = require("helmet");
const cookieParser = require("cookie-parser");
const rateLimit = require("express-rate-limit");
require("dotenv").config();

const authRoutes = require("./routes/authRoutes");
const journalRoutes = require("./routes/journalRoutes");
const profileRoutes = require("./routes/profileRoutes"); 

const app = express();

// Security-enhanced middleware
// 1. Helmet for securing HTTP headers
app.use(helmet());

// 2. Proper CORS configuration with whitelisting
const corsOptions = {
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    const allowedOrigins = [
      process.env.FRONTEND_URL || 'http://localhost:3000', // Primary frontend
      'http://localhost:5173',  // Development server
      /\.your-domain\.com$/ // Any subdomain of your-domain.com (in production)
    ];
    
    if (!origin || allowedOrigins.some(allowedOrigin => {
      if (allowedOrigin instanceof RegExp) {
        return allowedOrigin.test(origin);
      }
      return allowedOrigin === origin;
    })) {
      callback(null, true);
    } else {
      callback(new Error('CORS policy violation'));
    }
  },
  credentials: true, // Allow cookies to be sent with requests
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  exposedHeaders: ['Content-Length', 'X-Rate-Limit'],
  maxAge: 86400 // Cache preflight requests for 24 hours
};

app.use(cors(corsOptions));

// 3. Cookie parser for secure cookie handling
app.use(cookieParser());

// 4. Body parser with size limits to prevent abuse
app.use(express.json({ limit: '100kb' })); // Limit body size
app.use(express.urlencoded({ extended: true, limit: '100kb' }));

// 5. Rate limiting for all routes
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per window
  standardHeaders: true, // Return rate limit info in RateLimit-* headers
  legacyHeaders: false, // Disable X-RateLimit-* headers
  message: { error: 'Too many requests, please try again later.' }
});

// Apply rate limiting to all routes
app.use(apiLimiter);

// Stronger rate limits for authentication endpoints
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10, // Limited attempts for auth routes
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many authentication attempts, please try again later.' }
});

// Apply routes with security enhancements
app.use("/api/auth", authLimiter, authRoutes);
app.use("/api/journals", journalRoutes);
app.use("/api/profile", profileRoutes);

// General error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  
  // Don't expose error details in production
  const message = process.env.NODE_ENV === 'production'
    ? 'An unexpected error occurred'
    : err.message;
    
  res.status(err.status || 500).json({
    error: {
      message,
      // Only include stack trace in development
      ...(process.env.NODE_ENV !== 'production' && { stack: err.stack })
    }
  });
});

// Connect to MongoDB with improved security options
mongoose
  .connect(process.env.MONGO_URI, {
    // Security-enhanced connection options
    ssl: process.env.NODE_ENV === 'production', // Use SSL in production
    sslValidate: process.env.NODE_ENV === 'production',
  })
  .then(() => {
    console.log("MongoDB connected");
    app.listen(process.env.PORT, () =>
      console.log(`Server running on port ${process.env.PORT}`)
    );
  })
  .catch((err) => console.error("MongoDB connection error:", err));

// Handle uncaught exceptions and unhandled rejections
process.on('uncaughtException', (err) => {
  console.error('Uncaught exception:', err);
  // Gracefully shutdown in production
  if (process.env.NODE_ENV === 'production') {
    process.exit(1);
  }
});

process.on('unhandledRejection', (err) => {
  console.error('Unhandled promise rejection:', err);
  // Gracefully shutdown in production
  if (process.env.NODE_ENV === 'production') {
    process.exit(1);
  }
});