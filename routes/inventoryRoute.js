const express = require("express")
const router = new express.Router()
const invController = require("../controllers/invController")
const utilities = require("../utilities")
const invValidations = require("../utilities/inv-validations")
const invCont = require("../controllers/invController")


router.get("/", utilities.handleErrors(invController.buildInventoryManagement))
router.get("/type/:classificationId", utilities.handleErrors(invController.buildByClassificationId))
router.get("/detail/:vehicleId", utilities.handleErrors(invController.buildByVehicleId))
router.get("/add-classification", utilities.handleErrors(invController.buildAddClassification))
router.get("/getInventory/:classification_id", utilities.handleErrors(invCont.getInventoryJSON))
router.get("/edit/:inv_id", utilities.handleErrors(invCont.buildEditInventory))
router.get("/add-inventory", utilities.handleErrors(invController.buildAddInventory))

router.post("/add-classification",
  invValidations.classificationRules(),
  invValidations.checkClassificationData,
  utilities.handleErrors(invController.registerClassification)
)
router.post("/add-inventory",
  invValidations.inventoryRules(),
  invValidations.checkInventoryData,
  utilities.handleErrors(invController.registerIventory)
)

router.post("/update",
  invValidations.inventoryRules(),
  invValidations.checkUpdateData,
  utilities.handleErrors(invCont.updateInventory)
)

module.exports = router