const mongoose = require("mongoose");
const userSchema = new mongoose.Schema({
  name: { type: String, required: true, minlength: 3, maxLength: 255 },
  googleID: { type: String },
  date: {
    type: Date,
    default: Date.now,
  },
  thumbnail: { type: String },
  // local Login
  email: {
    type: String,
  },
  password: {
    type: String,
    minLength: 8,
    maxLength: 1024,
  },
});

module.exports = mongoose.model("User", userSchema);
