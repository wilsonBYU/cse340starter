const express = require("express")
const router = new express.Router()
const invController = require("../controllers/invController")
const utilities = require("../utilities")
const invValidations = require("../utilities/inv-validations")


router.get("/", utilities.handleErrors(invController.buildInventoryManagement))
router.get("/type/:classificationId", utilities.handleErrors(invController.buildByClassificationId))
router.get("/detail/:vehicleId", utilities.handleErrors(invController.buildByVehicleId))
router.get("/add-classification", utilities.handleErrors(invController.buildAddClassification))
router.post("/add-classification",
  invValidations.classificationRules(),
  invValidations.checkClassificationData,
  utilities.handleErrors(invController.registerClassification)
)
router.get("/add-inventory", utilities.handleErrors(invController.buildAddInventory))
router.post("/add-inventory",
  invValidations.inventoryRules(),
  invValidations.checkInventoryData,
  utilities.handleErrors(invController.registerIventory)
)
module.exports = router