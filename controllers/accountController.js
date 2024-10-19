//Needed files
const utilities = require("../utilities")
const accountModel = require("../models/account-model")
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
require("dotenv").config()

//Deliver Login View
async function buildLogin(req, res, next) {
    let nav = await utilities.getNav()
    res.render("account/login", {
        title: "Login",
        nav,
        errors: null
    })
}

//Deliver Registration view
async function buildRegister(req, res, next) {
    let nav = await utilities.getNav()
    req.flash("notice", "All fields are required to sumbission.")
    res.render("account/register", {
        title: "Register",
        nav,
        errors: null
    })
}

/* ****************************************
*  Process Registration
* *************************************** */
async function registerAccount(req, res) {
    let nav = await utilities.getNav()
    const { account_firstname, account_lastname, account_email, account_password } = req.body

    // Hash the password before storing
   let hashedPassword
   try {
     // regular password and cost (salt is generated automatically)
     hashedPassword = await bcrypt.hashSync(account_password, 10)
   } catch (error) {
     req.flash("notice", 'Sorry, there was an error processing the registration.')
     res.status(500).render("account/register", {
       title: "Registration",
       nav,
       errors: null,
     })
   }
  
    const regResult = await accountModel.registerAccount(
      account_firstname,
      account_lastname,
      account_email,
      hashedPassword
    )
  
    if (regResult) {
      req.flash(
        "notice",
        `Congratulations, you\'re registered ${account_firstname}. Please log in.`
      )
      res.status(201).render("account/login", {
        title: "Login",
        nav,
        errors: null
      })
    } else {
      req.flash("notice", "Sorry, the registration failed.")
      res.status(501).render("account/register", {
        title: "Registration",
        nav,
        errors:null
      })
    }
  }

/* ****************************************
 *  Process login request
 * ************************************ */
async function accountLogin(req, res) {
  let nav = await utilities.getNav()
  const { account_email, account_password } = req.body
  const accountData = await accountModel.getAccountByEmail(account_email)
  if (!accountData) {
   req.flash("notice", "Please check your credentials and try again.")
   res.status(400).render("account/login", {
    title: "Login",
    nav,
    errors: null,
    account_email,
   })
  return
  }
  try {
   if (await bcrypt.compare(account_password, accountData.account_password)) {
   delete accountData.account_password
   const accessToken = jwt.sign(accountData, process.env.ACCESS_TOKEN_SECRET, { expiresIn: 3600 })
   if(process.env.NODE_ENV === 'development') {
     res.cookie("jwt", accessToken, { httpOnly: true, maxAge: 3600 * 1000 })
     } else {
       res.cookie("jwt", accessToken, { httpOnly: true, secure: true, maxAge: 3600 * 1000 })
     }
   return res.redirect("/account/account")
   }
  } catch (error) {
   return new Error('Access Forbidden')
  }
 }

 /* ****************************************
 *  Account view
 * ************************************ */
 async function buildAccountView(req, res, next) {
  let nav = await utilities.getNav()
  const account_name = res.locals.accountData.account_firstname;
  const account_type = res.locals.accountData.account_type;
  res.render("account/account", {
      title: "Account Management",
      nav,
      account_name,
      account_type,
      errors: null
  })
}

 /* ****************************************
 *  Process Logout
 * ************************************ */
async function accountLogout(req, res, next) {
  res.clearCookie('jwt');
  req.flash("notice", "You are successfully Logged Out")
  return res.status(201).redirect("./login")
}

 /* ****************************************
 *  Edit account view
 * ************************************ */
 async function buildEditAccountView(req, res, next) {
  let nav = await utilities.getNav()
  const account_name = res.locals.accountData.account_firstname;
  const account_type = res.locals.accountData.account_type;
  res.render("account/edit-account", {
      title: "Edit Account",
      nav,
      account_name,
      account_type,
      errors: null
  })
}

/* ****************************************
*  Process Account Update
* *************************************** */
async function editAccount(req, res, next) {
  let nav = await utilities.getNav()
  const { account_id, account_firstname, account_lastname, account_email, account_password } = req.body

  let hashedPassword

  if (account_password) {
    // Hash the password before storing
    try {
      // regular password and cost (salt is generated automatically)
      hashedPassword = await bcrypt.hashSync(account_password, 10)
    } catch (error) {
      req.flash("notice", 'Sorry, there was an error processing the registration.')
      return res.status(500).render("account/edit_account", {
        title: "Edit Account",
        nav,
        errors: null,
      })
    }
  } else {
    hashedPassword = await accountModel.getPasswordById(account_id)
  }

  const updateResult = await accountModel.editAccount(account_id, account_firstname, account_lastname, account_email, hashedPassword)

  if (updateResult) {
    req.flash(
      "notice",
      `The account information has been updated`
    )
    return res.status(201).redirect("/account/account")
  } else {
    req.flash("notice", "Sorry, the insert failed.")
    return res.status(501).render("account/edit-account", {
    title: "Edit Account",
    nav,
    errors: null,
    })
  }
}

module.exports = {buildLogin, buildRegister, registerAccount, accountLogin, buildAccountView, accountLogout, buildEditAccountView, editAccount}