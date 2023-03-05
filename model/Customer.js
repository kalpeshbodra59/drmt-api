const mongoose = require("mongoose");

const customerCollection = new mongoose.Schema({
  name: { type: String },
  address: { type: String },
  mobileNumber: { type: String },
});

// Define a simple customer model
module.exports = mongoose.model("customer", customerCollection);
