const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("./app/mongoose");
const routes = require("./app/routes");
const cors = require("cors");
const app = express();
// http://localhost:3000
// https://moonlit-pithivier-da5ced.netlify.app
// working server url: https://drmt-www.vercel.app
app.use(cors({ origin: "https://drmt-www.vercel.app" }));

mongoose.configure();

// Configure body-parser
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

routes.declare(app);

// Start the server
app.listen(5000, () => {
  console.log(`Server is running on http://localhost:${5000}`);
});
