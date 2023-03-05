const Diamond = require("../../model/Diamond");
const { statusCodes, acknowlegements } = require("../../utilities/enums");
const { getAllDiamondsPipeline } = require("./pipeline");
const mongoose = require("mongoose");
const ObjectId = mongoose.Types.ObjectId;

exports.addDiamond = (req, res) => {
  const {
    date,
    lot_no,
    total_diamond,
    total_diamond_weight,
    worked_diamond,
    worked_diamond_weight,
    percentage,
    month = 0,
    year = 0,
    userId,
  } = req.body;
  const diamond = new Diamond({
    date,
    lot_no,
    total_diamond,
    total_diamond_weight,
    worked_diamond,
    worked_diamond_weight,
    percentage,
    customerId: ObjectId(userId),
  });
  diamond
    .save()
    .then((result) => {
      const pipeline = getAllDiamondsPipeline({
        month: parseInt(month),
        year: parseInt(year),
        customerId: ObjectId(userId),
      });
      Diamond.aggregate(pipeline)
        .then((allData) => {
          res.status(statusCodes.success).json({
            status: statusCodes.create,
            success: acknowlegements.success,
            data: allData,
            message: "Diamond created successfully",
          });
        })
        .catch((err) => {
          res.status(statusCodes.error).json({
            status: statusCodes.error,
            success: acknowlegements.failed,
            message: "Error retrieving Diamonds",
          });
        });
    })
    .catch((err) => {
      res.status(statusCodes.failed).json({
        status: statusCodes.failed,
        success: acknowlegements.failed,
        message: "Failed to add new diamond",
      });
    });
};

exports.viewDiamonds = (req, res) => {
  const { month = 0, year = 0, userId } = req.query;
  const pipeline = getAllDiamondsPipeline({
    month: parseInt(month),
    year: parseInt(year),
    customerId: ObjectId(userId),
  });
  Diamond.aggregate(pipeline)
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
        message: "Error retrieving Diamonds",
      });
    });
};

exports.getDiamondById = (req, res) => {
  const { id } = req.params || {};
  Diamond.findById(id)
    .then((result) => {
      if (!result) {
        return res.status(statusCodes.notFound).json({
          status: statusCodes.notFound,
          success: acknowlegements.failed,
          message: "Diamond not found",
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
          message: "Diamond not found",
        });
      }
      res.status(statusCodes.error).json({
        status: statusCodes.error,
        success: acknowlegements.failed,
        message: "Error retrieving Diamond",
      });
    });
};

exports.updateDiamondById = (req, res) => {
  const { id } = req.query || {};
  Diamond.findByIdAndUpdate(id, req.body, { new: true })
    .then((result) => {
      if (!result) {
        return res.status(statusCodes.notFound).json({
          status: statusCodes.notFound,
          success: acknowlegements.failed,
          message: "Diamond not found",
        });
      }
      const { month = 0, year = 0, userId } = req.body;
      const pipeline = getAllDiamondsPipeline({
        month: parseInt(month),
        year: parseInt(year),
        customerId: ObjectId(userId),
      });
      Diamond.aggregate(pipeline)
        .then((allData) => {
          res.status(statusCodes.success).json({
            status: statusCodes.success,
            success: acknowlegements.success,
            data: allData,
            message: "Diamond Updated successfully",
          });
        })
        .catch((err) => {
          res.status(statusCodes.error).json({
            status: statusCodes.error,
            success: acknowlegements.failed,
            message: "Error while updating Diamonds",
          });
        });
    })
    .catch((err) => {
      if (err.kind === "ObjectId") {
        return res.status(statusCodes.notFound).json({
          status: statusCodes.notFound,
          success: acknowlegements.failed,
          message: "Diamond not found",
        });
      }
      res.status(statusCodes.error).json({
        status: statusCodes.error,
        success: acknowlegements.failed,
        message: "Error retrieving Diamond",
      });
    });
};

exports.deleteDiamondById = (req, res) => {
  const { id, month = 0, year = 0, userId } = req.query || {};
  Diamond.findByIdAndDelete(id)
    .then((result) => {
      if (!result) {
        return res.status(statusCodes.notFound).json({
          status: statusCodes.notFound,
          success: acknowlegements.failed,
          message: "Diamond not found",
        });
      }
      const pipeline = getAllDiamondsPipeline({
        month: parseInt(month),
        year: parseInt(year),
        customerId: ObjectId(userId),
      });
      Diamond.aggregate(pipeline)
        .then((allData) => {
          res.status(statusCodes.success).json({
            status: statusCodes.success,
            success: acknowlegements.success,
            data: allData,
            message: "Diamond Deleted successfully",
          });
        })
        .catch((err) => {
          res.status(statusCodes.error).json({
            status: statusCodes.error,
            success: acknowlegements.failed,
            message: "Error while deleting Diamonds",
          });
        });
    })
    .catch((err) => {
      if (err.kind === "ObjectId") {
        return res.status(statusCodes.notFound).send({
          status: statusCodes.notFound,
          success: acknowlegements.failed,
          message: "Diamond not found",
        });
      }
      res.status(statusCodes.notFound).json({
        status: statusCodes.notFound,
        success: acknowlegements.failed,
        message: "Error retrieving Diamond",
      });
    });
};
