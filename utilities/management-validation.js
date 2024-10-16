//Needed files
const utilities = require(".")
const { body, validationResult } = require("express-validator")
const validate = {}
const invModel = require("../models/inventory-model")

/*  **********************************
  *  Register Classificaiton Validation Rules
  * ********************************* */
validate.registClassRules = () => {
    return [
      // classification name is required and must be string
      body("classification_name")
        .trim()
        .escape()
        .notEmpty()
        .isLength({ min: 1 })
        .matches(/^[A-Za-z]+$/)
        .withMessage("Please provide a valid Classification Name"), // on error this message is sent.
    ]
  }

/* ******************************
* Check data and return errors or continue to Classification registration
* ***************************** */
validate.checkRegData = async (req, res, next) => {
  const { classification_name } = req.body
  let errors = []
  errors = validationResult(req)
  if (!errors.isEmpty()) {
    let nav = await utilities.getNav()
    res.render("inventory/add-classification", {
      errors,
      title: "Add a new Classification",
      nav,
      classification_name,
    })
    return
  }
  next()
}

/*  **********************************
  *  Register Classificaiton Validation Rules
  * ********************************* */
validate.registVehicleRules = () => {
  return [
    // classification name is required and must be string
      body("inv_make")
      .trim()
      .escape()
      .notEmpty()
      .isLength({ min: 1 })
      .withMessage("Please provide a valid Make name"), // on error this message is sent.

      body("inv_model")
      .trim()
      .escape()
      .notEmpty()
      .isLength({ min: 1 })
      .withMessage("Please provide a valid Model name"),

      body("inv_description")
      .trim()
      .escape()
      .notEmpty()
      .isLength({ min: 1 })
      .withMessage("Please provide a valid Description"),

      body("inv_year")
      .trim()
      .escape()
      .notEmpty()
      .isLength({ min: 4 })
      .withMessage("Please provide a valid four digits year"),

      body("inv_image")
      .trim()
      .notEmpty()
      .isLength({ min: 1 })
      .withMessage("Please provide a valid image path"),

      body("inv_thumbnail")
      .trim()
      .notEmpty()
      .isLength({ min: 1 })
      .withMessage("Please provide a valid thumbnail path"),

      body("inv_price")
      .trim()
      .escape()
      .notEmpty()
      .isLength({ min: 1 })
      .withMessage("Please provide a valid price"),

      body("inv_miles")
      .trim()
      .escape()
      .notEmpty()
      .isLength({ min: 1 })
      .withMessage("Please provide a valid miles number"),

      body("inv_color")
      .trim()
      .escape()
      .notEmpty()
      .isLength({ min: 1 })
      .withMessage("Please provide a valid color"),
  ]
}

/* ******************************
* Check data and return errors or continue to Vehicle registration
* ***************************** */
validate.checkVehicleData = async (req, res, next) => {
  const { classification_id, inv_make, inv_model, inv_description, inv_year, inv_image, inv_thumbnail, inv_price, inv_miles, inv_color } = req.body
  let errors = []
  let select = await utilities.buildClassificationList()
  errors = validationResult(req)
  if (!errors.isEmpty()) {
    let nav = await utilities.getNav()
    res.render("inventory/add-inventory", {
      errors,
      title: "Add a new Vehicle",
      nav,
      select,
      classification_id,
      inv_make, inv_model, 
      inv_description, 
      inv_year, inv_image, 
      inv_thumbnail, 
      inv_price, 
      inv_miles,
      inv_color
    })
    return
  }
  next()
}

/* ******************************
* Check data and return errors or continue to Vehicle editing
* ***************************** */
validate.checkUpdateData = async (req, res, next) => {
  const { inv_id, classification_id, inv_make, inv_model, inv_description, inv_year, inv_image, inv_thumbnail, inv_price, inv_miles, inv_color } = req.body
  let errors = []
  let select = await utilities.buildClassificationList(classification_id)
  errors = validationResult(req)
  if (!errors.isEmpty()) {
    let nav = await utilities.getNav()
    res.render("inventory/edit-inventory", {
      errors,
      title: "Edit " + inv_make + " " + inv_model,
      nav,
      select,
      inv_id,
      classification_id,
      inv_make, inv_model, 
      inv_description, 
      inv_year, inv_image, 
      inv_thumbnail, 
      inv_price, 
      inv_miles,
      inv_color
    })
    return
  }
  next()
}

module.exports = validate