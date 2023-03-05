const User = require("../../model/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { statusCodes, acknowlegements } = require("../../utilities/enums");

exports.addUser = async (req, res) => {
  const { userName, name, password } = req.body;

  try {
    let user = await User.findOne({ userName });

    if (user) {
      return res.status(statusCodes.failed).json({
        status: statusCodes.failed,
        success: acknowlegements.failed,
        message: "User already exists",
      });
    }

    user = new User({
      userName,
      name,
      password,
    });

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);

    await user
      .save()
      .then(() => {
        res.status(statusCodes.create).json({
          status: statusCodes.create,
          success: acknowlegements.success,
          message: "User created successfully",
        });
      })
      .catch((error) => {
        res.status(statusCodes.error).json({
          status: statusCodes.error,
          success: acknowlegements.failed,
          error: "Failed to add new user",
        });
      });
  } catch (err) {
    res.status(statusCodes.error).json({
      status: statusCodes.error,
      success: acknowlegements.failed,
      error: "Failed to add new user",
    });
  }
};

exports.viewUsers = async (req, res) => {
  User.find()
    .then((result) => {
      res.status(statusCodes.success).json({
        status: statusCodes.success,
        success: acknowlegements.success,
        data: result,
      });
    })
    .catch((err) => {
      res.status(statusCodes.error).json({
        status: statusCodes.error,
        success: acknowlegements.failed,
        message: "Error retrieving users",
      });
    });
};

exports.getUserById = async (req, res) => {
  const { id } = req.params || {};
  User.findById(id)
    .then((result) => {
      if (!result) {
        return res.status(statusCodes.notFound).json({
          status: statusCodes.notFound,
          success: acknowlegements.failed,
          message: "User not found with id " + id,
        });
      }
      res.status(statusCodes.success).json({
        status: statusCodes.success,
        success: acknowlegements.success,
        data: result,
      });
    })
    .catch((err) => {
      if (err.kind === "ObjectId") {
        return res.status(statusCodes.notFound).json({
          status: statusCodes.notFound,
          success: acknowlegements.failed,
          message: "User not found with id " + id,
        });
      }
      res.status(statusCodes.error).json({
        status: statusCodes.error,
        success: acknowlegements.failed,
        message: "Error retrieving User with id " + id,
      });
    });
};

exports.updateUserById = async (req, res) => {
  const { id } = req.query || {};

  const { userName, name, password } = req.body;

  // Build user object
  const userFields = {};
  if (userName) {
    userFields.userName = userName;
    let user = await User.findOne({ userName });

    if (user) {
      return res.status(statusCodes.failed).json({
        status: statusCodes.failed,
        success: acknowlegements.failed,
        message: "User already exists",
      });
    }
  }
  if (name) userFields.name = name;
  if (password) userFields.password = password;

  try {
    let user = await User.findById(id);

    if (!user)
      return res.status(statusCodes.notFound).json({
        status: statusCodes.notFound,
        success: acknowlegements.failed,
        message: "User not found",
      });

    // Update
    user = await User.findByIdAndUpdate(
      id,
      { $set: userFields },
      { new: true }
    );
    res.status(statusCodes.success).json({
      status: statusCodes.success,
      success: acknowlegements.success,
      data: user,
      message: "User Updated Successfully",
    });
  } catch (err) {
    res.status(statusCodes.error).json({
      status: statusCodes.error,
      success: acknowlegements.failed,
      message: "Failed to update user",
    });
  }
};

exports.deleteUserById = async (req, res) => {
  try {
    const { id } = req.query || {};

    let user = await User.findById(id);

    if (!user)
      return res.status(statusCodes.notFound).json({
        status: statusCodes.notFound,
        success: acknowlegements.failed,
        message: "User not found",
      });

    // Delete
    await User.findByIdAndRemove(id);

    res.json({
      status: statusCodes.success,
      success: acknowlegements.success,
      message: "User removed",
    });
  } catch (err) {
    res.status(statusCodes.error).json({
      status: statusCodes.error,
      success: acknowlegements.failed,
      message: "Failed to delete user",
    });
  }
};

exports.userLogin = async (req, res) => {
  const { userName, password } = req.body;
  try {
    let user = await User.findOne({ userName });
    if (!user) {
      return res.status(statusCodes.failed).json({
        status: statusCodes.failed,
        success: acknowlegements.failed,
        message: "Invalid User Name or Password",
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(statusCodes.failed).json({
        status: statusCodes.failed,
        success: acknowlegements.failed,
        message: "Invalid Password",
      });
    }

    const payload = {
      user: {
        id: user.id,
      },
    };

    jwt.sign(
      payload,
      "KALPESH",
      {
        expiresIn: 36000,
      },
      (err, token) => {
        if (err) throw err;
        res.json({
          status: statusCodes.success,
          success: acknowlegements.success,
          token,
        });
      }
    );
  } catch (err) {
    res.status(statusCodes.error).json({
      status: statusCodes.failed,
      success: acknowlegements.failed,
      message: "Error to login user",
    });
  }
};
