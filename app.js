const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("./app/mongoose");
const routes = require("./app/routes");
const cors = require("cors");
const PORT = precess.env.PORT || 5000;
const app = express();
app.use(cors({ origin: "http://localhost:3000" }));

mongoose.configure();

// Configure body-parser
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

routes.declare(app);

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
