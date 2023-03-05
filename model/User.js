const mongoose = require("mongoose");

const userCollection = new mongoose.Schema({
  userName: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  password: { type: String, required: true },
});

// Define a simple User model
module.exports = mongoose.model("user", userCollection);
