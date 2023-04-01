const Worker = require("../../model/Worker");
const { statusCodes, acknowlegements } = require("../../utilities/enums");

exports.addWorker = (req, res) => {
  const worker = new Worker({
    name: req.body.name,
    address: req.body.address,
    mobileNumber: req.body.mobileNumber,
  });

  worker
    .save()
    .then((data) => {
      res.status(statusCodes.create).json({
        status: statusCodes.create,
        success: acknowlegements.success,
        data: data,
        message: "Worker created successfully",
      });
    })
    .catch((err) => {
      res.status(statusCodes.error).send({
        status: statusCodes.failed,
        success: acknowlegements.failed,
        message: "Failed to add new worker",
      });
    });
};

exports.viewWorkers = (req, res) => {
  Worker.find()
    .then((results) => {
      res.status(statusCodes.success).json({
        status: statusCodes.success,
        success: acknowlegements.success,
        data: results,
      });
    })
    .catch((err) => {
      res.status(statusCodes.error).json({
        status: statusCodes.error,
        success: acknowlegements.failed,
        message: "Error retrieving workers",
      });
    });
};

exports.getWorkerById = (req, res) => {
  const { id } = req.params;
  Worker.findById(id)
    .then((result) => {
      if (!result) {
        return res.status(statusCodes.notFound).json({
          status: statusCodes.notFound,
          success: acknowlegements.failed,
          message: "Worker not found",
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
          message: "Worker not found",
        });
      }
      res.status(statusCodes.error).json({
        status: statusCodes.error,
        success: acknowlegements.failed,
        message: "Error retrieving Worker",
      });
    });
};

exports.updateWorkerById = (req, res) => {
  const { id } = req.query || {};

  Worker.findByIdAndUpdate(id, req.body, { new: true })
    .then((worker) => {
      if (!worker) {
        return res.status(statusCodes.notFound).send({
          status: statusCodes.notFound,
          success: acknowlegements.failed,
          message: "Worker not found",
        });
      }
      res.json({
        status: statusCodes.success,
        success: acknowlegements.success,
        data: worker,
        message: "Worker Updated Successfully",
      });
    })
    .catch((err) => {
      if (err.kind === "ObjectId") {
        return res.status(statusCodes.notFound).send({
          status: statusCodes.notFound,
          success: acknowlegements.failed,
          message: "Worker not found",
        });
      }
      return res.status(statusCodes.error).send({
        status: statusCodes.error,
        success: acknowlegements.failed,
        message: "Error updating worker",
      });
    });
};

exports.deleteWorkerById = (req, res) => {
  const id = req.query.id;
  Worker.findByIdAndRemove(id)
    .then((worker) => {
      if (!worker) {
        return res.status(statusCodes.notFound).send({
          status: statusCodes.notFound,
          success: acknowlegements.failed,
          message: "Worker not found",
        });
      }
      res.json({
        status: statusCodes.success,
        success: acknowlegements.success,
        message: "Worker deleted successfully!",
      });
    })
    .catch((err) => {
      if (err.kind === "ObjectId" || err.name === "NotFound") {
        return res.status(statusCodes.notFound).send({
          status: statusCodes.notFound,
          success: acknowlegements.failed,
          message: "Worker not found",
        });
      }
      return res.status(statusCodes.error).send({
        status: statusCodes.error,
        success: acknowlegements.failed,
        message: "Could not delete worker",
      });
    });
};
