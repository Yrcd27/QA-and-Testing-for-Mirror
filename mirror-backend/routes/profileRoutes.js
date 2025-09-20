
const express = require("express");
const multer = require("multer");
const UserProfile = require("../models/UserProfile");
const User = require("../models/User");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

// Multer config for image upload
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// Create or Update Profile
router.post("/", authMiddleware, upload.single("profile_picture"), async (req, res) => {
  try {
    const updateData = {
      full_name: req.body.full_name,
      gender: req.body.gender,
      date_of_birth: req.body.date_of_birth,
      phone_number: req.body.phone_number,
      bio: req.body.bio
    };

    if (req.file) {
      updateData.profile_picture = req.file.buffer.toString("base64");
    }

    const profile = await UserProfile.findOneAndUpdate(
      { user_id: req.user.id },
      { $set: updateData },
      { new: true, upsert: true }
    );

    res.json(profile);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get Profile
router.get("/", authMiddleware, async (req, res) => {
  try {
    const profile = await UserProfile.findOne({ user_id: req.user.id });
    const user = await User.findById(req.user.id).select("Name email");
    res.json({ ...profile?._doc, Name: user.Name, email: user.email });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Delete Account (User + Profile)
router.delete("/", authMiddleware, async (req, res) => {
  try {
    await UserProfile.deleteOne({ user_id: req.user.id });
    await User.findByIdAndDelete(req.user.id);
    res.json({ message: "Account deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
