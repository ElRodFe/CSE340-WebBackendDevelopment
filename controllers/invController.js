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

  const classificationSelect = await utilities.buildClassificationList()

  res.render("./inventory/management", {
    title: "Inventory Management",
    nav,
    classificationSelect
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

/* ***************************
 *  Return Inventory by Classification As JSON
 * ************************** */
invCont.getInventoryJSON = async (req, res, next) => {
  const classification_id = parseInt(req.params.classification_id)
  const invData = await invModel.getInventoryByClassificationId(classification_id)
  if (invData[0].inv_id) {
    return res.json(invData)
  } else {
    next(new Error("No data returned"))
  }
}

/* ***************************
 *  Build  view to edit Vehicle
 * ************************** */
invCont.buildEditVehicleView = async function (req, res, next) {
  const inv_id = parseInt(req.params.inv_id)
  let nav = await utilities.getNav()
  const item = await invModel.getVehicleById(inv_id)
  const itemData = item[0]
  let select = await utilities.buildClassificationList(itemData.classification_id)
  const itemName = `${itemData.inv_make} ${itemData.inv_model}`
  res.render("inventory/edit-inventory", {
    title: "Edit " + itemName,
    nav,
    select,
    errors: null,
    inv_id: itemData.inv_id,
    inv_make: itemData.inv_make,
    inv_model: itemData.inv_model,
    inv_year: itemData.inv_year,
    inv_description: itemData.inv_description,
    inv_image: itemData.inv_image,
    inv_thumbnail: itemData.inv_thumbnail,
    inv_price: itemData.inv_price,
    inv_miles: itemData.inv_miles,
    inv_color: itemData.inv_color,
    classification_id: itemData.classification_id
  })
}

/* ****************************************
*  Process Vehicle Update
* *************************************** */
invCont.updateVehicle = async function(req, res) {
  let nav = await utilities.getNav()
  const { inv_id, classification_id, inv_make, inv_model, inv_description, inv_year, inv_image, inv_thumbnail, inv_price, inv_miles, inv_color } = req.body
  let select = await utilities.buildClassificationList(classification_id)

  const updateResult = await invModel.updateVehicle(inv_id, classification_id, 
    inv_make, inv_model, inv_description, inv_year, inv_image, inv_thumbnail, inv_price, inv_miles, inv_color)

  if (updateResult) {
    req.flash(
      "notice",
      `The Vehicle ${inv_make} ${inv_model} has been succesfully updated`
    )
    res.status(201).redirect("/inv/")
  } else {
    const itemName = `${inv_make} ${inv_model}`
    req.flash("notice", "Sorry, the insert failed.")
    res.status(501).render("inventory/edit-inventory", {
    title: "Edit " + itemName,
    nav,
    select,
    errors: null,
    inv_id,
    inv_make,
    inv_model,
    inv_year,
    inv_description,
    inv_image,
    inv_thumbnail,
    inv_price,
    inv_miles,
    inv_color,
    classification_id
    })
  }
}

/* ***************************
 *  Build  view to delete Vehicle
 * ************************** */
invCont.buildDeleteVehicleView = async function (req, res, next) {
  const inv_id = parseInt(req.params.inv_id)
  let nav = await utilities.getNav()
  const item = await invModel.getVehicleById(inv_id)
  const itemData = item[0]
  const itemName = `${itemData.inv_make} ${itemData.inv_model}`
  res.render("inventory/delete-confirm", {
    title: "Delete " + itemName,
    nav,
    errors: null,
    inv_id: itemData.inv_id,
    inv_make: itemData.inv_make,
    inv_model: itemData.inv_model,
    inv_year: itemData.inv_year,
    inv_price: itemData.inv_price,
  })
}

/* ****************************************
*  Process Vehicle Update
* *************************************** */
invCont.deleteVehicle = async function(req, res) {
  let nav = await utilities.getNav()
  const { inv_id, inv_make, inv_model, inv_year, inv_price } = req.body

  const deleteResult = await invModel.deleteVehicle(inv_id)

  if (deleteResult) {
    req.flash(
      "notice",
      `The Vehicle ${inv_make} ${inv_model} has been deleted`
    )
    res.status(201).redirect("/inv/")
  } else {
    const itemName = `${inv_make} ${inv_model}`
    req.flash("notice", "Sorry, the deletion failed.")
    res.status(501).render("inventory/delete-confirm", {
    title: "Delete " + itemName,
    nav,
    errors: null,
    inv_id,
    inv_make,
    inv_model,
    inv_year,
    inv_price,
    })
  }
}

module.exports = invCont