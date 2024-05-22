const express = require("express")
const router = new express.Router()
const accountsController = require("../controllers/accountController")
const utilities = require("../utilities")
const regValidate = require("../utilities/account-validation")


router.get(
  "/",
  utilities.checkLogin,
  utilities.handleErrors(accountsController.buildAccount))
router.get("/login", utilities.handleErrors(accountsController.buildLogin))
router.get("/registration", utilities.handleErrors(accountsController.buildRegistration))
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


module.exports = router