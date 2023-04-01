const mongoose = require("mongoose");

const workerCollection = new mongoose.Schema({
  name: { type: String },
  address: { type: String },
  mobileNumber: { type: String },
});

// Define a simple worker model
module.exports = mongoose.model("worker", workerCollection);
