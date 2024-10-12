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

module.exports = router;