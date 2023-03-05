const {
  addCustomer,
  viewCustomers,
  getCustomerById,
  updateCustomerById,
  deleteCustomerById,
} = require("../controllers/customer");
const {
  addDiamond,
  viewDiamonds,
  getDiamondById,
  updateDiamondById,
  deleteDiamondById,
} = require("../controllers/diamond");
const {
  userLogin,
  addUser,
  viewUsers,
  getUserById,
  updateUserById,
  deleteUserById,
} = require("../controllers/user");
const middleware = require("../middleware");

exports.declare = (app) => {
  // User
  // Create a new user
  app.post("/api/users", addUser);
  // Get all users
  app.get("/api/users", viewUsers);
  // Get a single user by id
  app.get("/api/users/:id", getUserById);
  // Update a user
  app.put("/api/users", updateUserById);
  // Delete a user
  app.delete("/api/users", deleteUserById);
  // login
  app.post("/api/login", userLogin);

  // Customer
  // Create a new customer
  app.post("/api/customers", middleware, addCustomer);
  // Get all customers
  app.get("/api/customers", middleware, viewCustomers);
  // Get a single customer by id
  app.get("/api/customers/:id", middleware, getCustomerById);
  // Update a customer by id
  app.put("/api/customers", middleware, updateCustomerById);
  // Delete a customer by id
  app.delete("/api/customers", middleware, deleteCustomerById);

  // Diamond
  // Create a new diamond
  app.post("/api/diamonds", middleware, addDiamond);
  // Get all diamonds
  app.get("/api/diamonds", middleware, viewDiamonds);
  // Get a single diamond by id
  app.get("/api/diamonds/:id", middleware, getDiamondById);
  // Update a diamond by id
  app.put("/api/diamonds", middleware, updateDiamondById);
  // Delete a diamond by id
  app.delete("/api/diamonds", middleware, deleteDiamondById);
};
