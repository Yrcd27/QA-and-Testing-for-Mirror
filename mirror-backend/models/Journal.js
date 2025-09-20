const mongoose = require("mongoose");

const journalSchema = new mongoose.Schema({
  user_id: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  content: { type: String, required: true },
  mood: { type: String }, // optional
  image: { type: String }, // optional (URL or base64)
}, { timestamps: true }); // createdAt, updatedAt automatically added

module.exports = mongoose.model("Journal", journalSchema);
