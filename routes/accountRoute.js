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

// Process Logout
router.get("/logout", utilities.handleErrors(accountController.accountLogout))

//Route to edit account
router.get("/edit-account", utilities.handleErrors(accountController.buildEditAccountView))

// Process account info update
router.post(
  "/updateAccountInfo",
  validate.updateAccountInfoRules(),
  validate.checkUpdateData,
  utilities.handleErrors(accountController.editAccount))

// Process account password update
router.post(
  "/updatePassword",
  validate.passwordUpdateRules(),
  validate.checkUpdateData,
  utilities.handleErrors(accountController.editAccount))

module.exports = router;