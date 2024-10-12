const invModel = require("../models/inventory-model")
const utilities = require("../utilities/")

const invCont = {}

/* ***************************
 *  Build inventory by classification view
 * ************************** */
invCont.buildByClassificationId = async function (req, res, next) {
  const classification_id = req.params.classificationId
  const data = await invModel.getInventoryByClassificationId(classification_id)
  const grid = await utilities.buildClassificationGrid(data)
  let nav = await utilities.getNav()
  const className = data[0].classification_name
  res.render("./inventory/classification", {
    title: className + " vehicles",
    nav,
    grid,
  })
}

invCont.buildVehicleView = async function (req, res, next) {
  const vehicle_id = req.params.vehicleId
  const data = await invModel.getVehicleById(vehicle_id)
  const section = await utilities.buildVehicleCard(data)
  let nav = await utilities.getNav()
  const vehicleName = data[0].inv_make + ' ' + data[0].inv_model
  res.render("./inventory/vehicle", {
    title: vehicleName,
    nav,
    section,
  })
}

invCont.buildInvManagementView = async function (req, res, next) {
  let nav = await utilities.getNav()
  res.render("./inventory/management", {
    title: "Inventory Management",
    nav,
  })
}

/* ***************************
 *  Build  view to add a new Classificaiton
 * ************************** */
invCont.buildClassFormView = async function (req, res, next) {
  let nav = await utilities.getNav()
  res.render("inventory/add-classification", {
    title: "Add a new Classification",
    nav,
    errors: null
  })
}

/* ****************************************
*  Process new Classification
* *************************************** */
invCont.registerClassification = async function(req, res) {
  let nav = await utilities.getNav()
  const { classification_name } = req.body

  const regResult = await invModel.registerClassification(classification_name)

  if (regResult) {
    req.flash(
      "notice",
      `The new Classification ${classification_name} has been succesfully registered`
    )
    res.status(201).render("inventory/add-classification", {
      title: "Add a new Classification",
      nav,
      errors: null
    })
  } else {
    req.flash("notice", "Sorry, the registration failed.")
    res.status(501).render("inventory/add-classification", {
      title: "Add a new Classification",
      nav,
      errors:null
    })
  }
}

/* ***************************
 *  Build  view to add a new Vehicle
 * ************************** */
invCont.buildVehicleFormView = async function (req, res, next) {
  let nav = await utilities.getNav()
  let select = await utilities.buildClassificationList()
  res.render("inventory/add-inventory", {
    title: "Add a new Vehicle",
    nav,
    select,
    errors: null
  })
}

/* ****************************************
*  Process new Vehicle
* *************************************** */
invCont.registerVehicle = async function(req, res) {
  let nav = await utilities.getNav()
  const { classification_id, inv_make, inv_model, inv_description, inv_year, inv_image, inv_thumbnail, inv_price, inv_miles, inv_color } = req.body
  let select = await utilities.buildClassificationList()

  const regResult = await invModel.registerVehicle(classification_id, 
    inv_make, inv_model, inv_description, inv_year, inv_image, inv_thumbnail, inv_price, inv_miles, inv_color)

  if (regResult) {
    req.flash(
      "notice",
      `The new Vehicle ${inv_make} ${inv_model} has been succesfully registered`
    )
    res.status(201).render("inventory/add-inventory", {
      title: "Add a new Vehicle",
      nav,
      select,
      errors: null
    })
  } else {
    req.flash("notice", "Sorry, the registration failed.")
    res.status(501).render("inventory/add-inventory", {
      title: "Add a new Vehicle",
      nav,
      select,
      errors:null
    })
  }
}

module.exports = invCont