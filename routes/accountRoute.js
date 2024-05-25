const express = require("express")
const router = new express.Router()
const accountsController = require("../controllers/accountController")
const utilities = require("../utilities")
const regValidate = require("../utilities/account-validation")


router.get("/", utilities.checkLogin, utilities.handleErrors(accountsController.buildAccount))
router.get("/login", utilities.handleErrors(accountsController.buildLogin))
router.get("/logout", utilities.handleErrors(accountsController.logout))
router.get("/registration", utilities.handleErrors(accountsController.buildRegistration))
router.get(
  "/update/:account_id",
  utilities.handleErrors(accountsController.buildUpdateAccount)
)

router.post(
  "/registration",
  regValidate.registrationRules(),
  regValidate.checkRegData,
  utilities.handleErrors(accountsController.registerAccount)
)
router.post(
  "/login",
  regValidate.loginRules(),
  regValidate.checkLoginData,
  utilities.handleErrors(accountsController.accountLogin)
)

router.post(
  "/update",
  regValidate.accountUpdateRules(),
  regValidate.checkUpdatedData,
  utilities.handleErrors(accountsController.updateAccount)
)

router.post(
  "/update-password",
  regValidate.passwordRules(),
  regValidate.checkUpdatedPassword,
  utilities.handleErrors(accountsController.updateAccountPassword)
)

module.exports = router