const mongoose = require("mongoose");

const userProfileSchema = new mongoose.Schema({
  user_id: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, unique: true },
  full_name: { type: String },
  gender: { type: String, enum: ["Male", "Female", "Other"] },
  date_of_birth: { type: Date },
  phone_number: { type: String },
  bio: { type: String },
  profile_picture: { type: String } // Store image as URL or Base64
}, { timestamps: true });

module.exports = mongoose.model("UserProfile", userProfileSchema);
