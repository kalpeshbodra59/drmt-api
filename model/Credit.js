const mongoose = require("mongoose");
const ObjectId = mongoose.Schema.Types.ObjectId;

const creditSchema = new mongoose.Schema({
  date: Date,
  credit: Boolean,
  price: Number,
  workerId: ObjectId,
});

module.exports = mongoose.model("Credit", creditSchema);
