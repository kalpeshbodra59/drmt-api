const Credit = require("../../model/Credit");
const { statusCodes, acknowlegements } = require("../../utilities/enums");
const { getAllCreditsPipeline } = require("./pipeline");
const mongoose = require("mongoose");
const ObjectId = mongoose.Types.ObjectId;

exports.addCredit = (req, res) => {
  const { date, credit, workerId, price } = req.body;
  const creditObj = new Credit({
    date,
    credit,
    price,
    workerId: ObjectId(workerId),
  });
  creditObj
    .save()
    .then((result) => {
      const pipeline = getAllCreditsPipeline({
        workerId: ObjectId(workerId),
      });
      Credit.aggregate(pipeline)
        .then((allData) => {
          res.status(statusCodes.success).json({
            status: statusCodes.create,
            success: acknowlegements.success,
            data: allData,
            message: "Credit created successfully",
          });
        })
        .catch((err) => {
          res.status(statusCodes.error).json({
            status: statusCodes.error,
            success: acknowlegements.failed,
            message: "Error retrieving Credits",
          });
        });
    })
    .catch((err) => {
      res.status(statusCodes.failed).json({
        status: statusCodes.failed,
        success: acknowlegements.failed,
        message: "Failed to add new credit",
      });
    });
};

exports.viewCredits = (req, res) => {
  const { workerId } = req.query;
  const pipeline = getAllCreditsPipeline({
    workerId: ObjectId(workerId),
  });
  Credit.aggregate(pipeline)
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
        message: "Error retrieving Credits",
      });
    });
};
