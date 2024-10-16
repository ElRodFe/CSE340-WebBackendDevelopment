// Needed Resources 
const express = require("express")
const router = new express.Router() 
const accountController = require("../controllers/accountController")
const utilities = require("../utilities")
const validate = require('../utilities/account-validation')

// Route to build Login page
router.get("/login", utilities.handleErrors(accountController.buildLogin));

// Route to build Registration page
router.get("/register", utilities.handleErrors(accountController.buildRegister));

// Route to register a new account
router.post("/register",
    validate.registationRules(),
    validate.checkRegData,
    utilities.handleErrors(accountController.registerAccount));

// Process the login attempt
router.post(
  "/login",
  validate.loginRules(),
  validate.checkLogData,
  utilities.handleErrors(accountController.accountLogin)
)

// Default route to the accounts
router.get("/account", utilities.checkLogin, utilities.handleErrors(accountController.buildAccountView))

module.exports = router;