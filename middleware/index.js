const jwt = require("jsonwebtoken");
const User = require("../model/User");
const { statusCodes } = require("../utilities/enums");

// Verify Token Middleware
module.exports = (req, res, next) => {
  // Get the token from the header
  let token = req.header("Authorization");
  token = token.split(" ")[1];

  // Check if there is no token
  if (!token) {
    return res.status(401).json({
      status: statusCodes.unAuthorized,
      message: "No token, authorization denied",
    });
  }

  // Verify the token
  try {
    const decoded = jwt.verify(token, "KALPESH");
    req.user = decoded.user;

    // Check if the user exists in the database
    User.findById(req.user.id)
      .then((user) => {
        if (!user) {
          return res.status(401).json({
            status: statusCodes.unAuthorized,
            message: "Token is not valid",
          });
        }
        next();
      })
      .catch((err) =>
        res.status(401).json({
          status: statusCodes.unAuthorized,
          message: "Token is not valid",
        })
      );
  } catch (err) {
    res.status(401).json({
      status: statusCodes.unAuthorized,
      message: "Token is not valid",
    });
  }
};
