const mongoose = require("mongoose");

exports.configure = () => {
  createConnection();
};

const createConnection = () => {
  mongoose.set("strictQuery", true);
  // Connect to MongoDB
  mongoose
    .connect("mongodb+srv://kalpesh:kalpesh@drmt.19iahtc.mongodb.net/test", {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    .then(() => console.log("Connected to MongoDB..."))
    .catch((err) => console.log("Cloud not connect to MongoDB..."));
};
