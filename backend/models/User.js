const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: String,
  username: { type: String, unique: true },
  email: { type: String, unique: true },
  password: String,   // Already stored in your authStorage
  area: String,
}, { timestamps: true });

module.exports = mongoose.model("User", userSchema);
