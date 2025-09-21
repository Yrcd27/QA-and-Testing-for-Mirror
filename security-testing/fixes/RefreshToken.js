const mongoose = require("mongoose");

const RefreshTokenSchema = new mongoose.Schema({
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  token: {
    type: String,
    required: true,
  },
  ip: {
    type: String,
    required: true,
  },
  userAgent: {
    type: String,
    required: true,
  },
  isValid: {
    type: Boolean,
    default: true,
  },
  expiresAt: {
    type: Date,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
    expires: '30d', // Automatically remove documents after 30 days
  },
});

// Index for faster lookups and to enforce uniqueness
RefreshTokenSchema.index({ token: 1 }, { unique: true });
RefreshTokenSchema.index({ user_id: 1 });

module.exports = mongoose.model("RefreshToken", RefreshTokenSchema);