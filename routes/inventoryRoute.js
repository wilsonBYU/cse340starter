const express = require("express")
const router = new express.Router()
const invController = require("../controllers/invController")
const utilities = require("../utilities")
const invValidations = require("../utilities/inv-validations")
const invCont = require("../controllers/invController")

router.get("/", utilities.checkAccessRights, utilities.handleErrors(invController.buildInventoryManagement))
router.get("/type/:classificationId", utilities.handleErrors(invController.buildByClassificationId))
router.get("/detail/:vehicleId", utilities.handleErrors(invController.buildByVehicleId))
router.get("/add-classification", utilities.checkAccessRights, utilities.handleErrors(invController.buildAddClassification))
router.get("/getInventory/:classification_id", utilities.handleErrors(invCont.getInventoryJSON))
router.get("/edit/:inv_id", utilities.checkAccessRights, utilities.handleErrors(invCont.buildEditInventory))
router.get("/add-inventory", utilities.checkAccessRights, utilities.handleErrors(invController.buildAddInventory))
router.get("/delete/:inv_id", utilities.checkAccessRights, utilities.handleErrors(invController.buildDeleteInventory))

router.post("/add-classification",
  utilities.checkAccessRights,
  invValidations.classificationRules(),
  invValidations.checkClassificationData,
  utilities.handleErrors(invController.registerClassification)
)
router.post("/add-inventory",
  utilities.checkAccessRights,
  invValidations.inventoryRules(),
  invValidations.checkInventoryData,
  utilities.handleErrors(invController.registerIventory)
)

router.post("/update",
  utilities.checkAccessRights,
  invValidations.inventoryRules(),
  invValidations.checkUpdateData,
  utilities.handleErrors(invCont.updateInventory)
)

router.post("/delete",
  utilities.checkAccessRights,
  utilities.handleErrors(invController.deleteIventory)
)

module.exports = router