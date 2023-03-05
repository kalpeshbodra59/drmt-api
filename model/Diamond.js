const mongoose = require("mongoose");
const ObjectId = mongoose.Schema.Types.ObjectId;

const diamondSchema = new mongoose.Schema({
  date: Date,
  lot_no: Number,
  total_diamond: Number,
  total_diamond_weight: Number,
  worked_diamond: Number,
  worked_diamond_weight: Number,
  percentage: Number,
  customerId: ObjectId,
});

module.exports = mongoose.model("Diamond", diamondSchema);
