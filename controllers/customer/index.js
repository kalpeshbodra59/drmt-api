const Customer = require("../../model/Customer");
const { statusCodes, acknowlegements } = require("../../utilities/enums");

exports.addCustomer = (req, res) => {
  const customer = new Customer({
    name: req.body.name,
    address: req.body.address,
    mobileNumber: req.body.mobileNumber,
  });

  customer
    .save()
    .then((data) => {
      res.status(statusCodes.create).json({
        status: statusCodes.create,
        success: acknowlegements.success,
        data: data,
        message: "Customer created successfully",
      });
    })
    .catch((err) => {
      res.status(statusCodes.error).send({
        status: statusCodes.failed,
        success: acknowlegements.failed,
        message: "Failed to add new customer",
      });
    });
};

exports.viewCustomers = (req, res) => {
  Customer.find()
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
        message: "Error retrieving customers",
      });
    });
};

exports.getCustomerById = (req, res) => {
  const { id } = req.params;
  Customer.findById(id)
    .then((result) => {
      if (!result) {
        return res.status(statusCodes.notFound).json({
          status: statusCodes.notFound,
          success: acknowlegements.failed,
          message: "Customer not found",
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
          message: "Customer not found",
        });
      }
      res.status(statusCodes.error).json({
        status: statusCodes.error,
        success: acknowlegements.failed,
        message: "Error retrieving Customer",
      });
    });
};

exports.updateCustomerById = (req, res) => {
  const { id } = req.query || {};

  Customer.findByIdAndUpdate(id, req.body, { new: true })
    .then((customer) => {
      if (!customer) {
        return res.status(statusCodes.notFound).send({
          status: statusCodes.notFound,
          success: acknowlegements.failed,
          message: "Customer not found",
        });
      }
      res.json({
        status: statusCodes.success,
        success: acknowlegements.success,
        data: customer,
        message: "Customer Updated Successfully",
      });
    })
    .catch((err) => {
      if (err.kind === "ObjectId") {
        return res.status(statusCodes.notFound).send({
          status: statusCodes.notFound,
          success: acknowlegements.failed,
          message: "Customer not found",
        });
      }
      return res.status(statusCodes.error).send({
        status: statusCodes.error,
        success: acknowlegements.failed,
        message: "Error updating customer",
      });
    });
};

exports.deleteCustomerById = (req, res) => {
  const id = req.query.id;
  Customer.findByIdAndRemove(id)
    .then((customer) => {
      if (!customer) {
        return res.status(statusCodes.notFound).send({
          status: statusCodes.notFound,
          success: acknowlegements.failed,
          message: "Customer not found",
        });
      }
      res.json({
        status: statusCodes.success,
        success: acknowlegements.success,
        message: "Customer deleted successfully!",
      });
    })
    .catch((err) => {
      if (err.kind === "ObjectId" || err.name === "NotFound") {
        return res.status(statusCodes.notFound).send({
          status: statusCodes.notFound,
          success: acknowlegements.failed,
          message: "Customer not found",
        });
      }
      return res.status(statusCodes.error).send({
        status: statusCodes.error,
        success: acknowlegements.failed,
        message: "Could not delete customer",
      });
    });
};
