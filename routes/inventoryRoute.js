// Needed Resources 
const express = require("express")
const router = new express.Router() 
const invController = require("../controllers/invController")
const utilities = require("../utilities/index")
const validate = require("../utilities/management-validation")

// Route to build inventory by classification view
router.get("/type/:classificationId", utilities.handleErrors(invController.buildByClassificationId))

// Route to build vehicle view
router.get("/detail/:vehicleId", utilities.handleErrors(invController.buildVehicleView));

// Route to build inventory management view
router.get("/", utilities.handleErrors(invController.buildInvManagementView));

// Route to form to add a new Classification
router.get("/classform", utilities.handleErrors(invController.buildClassFormView));

// Route to form to add a new Vehicle
router.get("/vehicleform", utilities.handleErrors(invController.buildVehicleFormView));

// Route to register a new classification
router.post("/classform",
    validate.registClassRules(),
    validate.checkRegData,
    utilities.handleErrors(invController.registerClassification));

// Route to register a new vehicle
router.post("/vehicleform",
    validate.registVehicleRules(),
    validate.checkVehicleData,
    utilities.handleErrors(invController.registerVehicle));

//Route for JavaScript URL
router.get("/getInventory/:classification_id", utilities.handleErrors(invController.getInventoryJSON))

//Route for editing a Vehicle
router.get("/edit/:inv_id", utilities.handleErrors(invController.buildEditVehicleView))

//Route for submiting vehicle update
router.post("/update/", 
    validate.registVehicleRules(),
    validate.checkUpdateData,
    utilities.handleErrors(invController.updateVehicle))

//Route for deleting a Vehicle
router.get("/delete/:inv_id", utilities.handleErrors(invController.buildDeleteVehicleView))

//Route for submiting vehicle elimination
router.post("/remove/",
    utilities.handleErrors(invController.deleteVehicle))

module.exports = router;