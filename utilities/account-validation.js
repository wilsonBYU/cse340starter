const utilities = require(".")
const accountModel = require("../models/account-model")

const { body, validationResult } = require("express-validator")
const validate = {}

validate.registrationRules = () => {
  return [
    body("account_firstname")
      .trim()
      .escape()
      .notEmpty()
      .isLength({ min: 1 })
      .withMessage("Please provide first name."),
    body("account_lastname")
      .trim()
      .escape()
      .notEmpty()
      .isLength({ min: 2 })
      .withMessage("Please provide last name."),
    body("account_email")
      .trim()
      .escape()
      .notEmpty()
      .isEmail()
      .normalizeEmail()
      .withMessage("A valid email is required.")
      .custom(async (account_email) => {
        const emailExists = await accountModel.checkExistingEmail(account_email)
        if (emailExists) {
          throw new Error("Email exists. Please log in or use different email")
        }
      }),
    body("account_password")
      .trim()
      .notEmpty()
      .isStrongPassword({
        minLength: 12,
        minLowercase: 1,
        minUppercase: 1,
        minNumbers: 1,
        minSymbols: 1
      })
      .withMessage("Password does not meet requirements.")
  ]
}

validate.checkRegData = async (req, res, next) => {
  const { account_firstname, account_lastname, account_email } = req.body
  let errors = []
  errors = validationResult(req)
  if (!errors.isEmpty()) {
    let nav = await utilities.getNav()
    res.render("account/registration", {
      errors,
      title: "Registration",
      nav,
      account_firstname,
      account_lastname,
      account_email
    })
    return
  }
  next()
}


validate.loginRules = () => {

  return [
    body("account_email")
      .trim()
      .escape()
      .notEmpty()
      .isEmail()
      .normalizeEmail()
      .withMessage("A valid email is required"),
    body("account_password")
      .trim()
      .escape()
      .notEmpty()
      .withMessage("Invalid password")
  ]
}


validate.checkLoginData = async (req, res, next) => {

  const { account_email } = req.body
  let errors = []
  errors = validationResult(req)
  if (!errors.isEmpty()) {
    let nav = await utilities.getNav()
    res.render("account/registration", {
      errors,
      title: "Login",
      nav,
      account_email
    })
    return
  }
  next()
}

validate.accountUpdateRules = () => {
  return [
    body("account_firstname")
      .trim()
      .escape()
      .notEmpty()
      .withMessage("A valid first name is required"),
    body("account_lastname")
      .trim()
      .escape()
      .notEmpty()
      .withMessage("A valid last name is required"),
    body("account_email")
      .trim()
      .escape()
      .notEmpty()
      .isEmail()
      .normalizeEmail()
      .withMessage("A valid email is required")
      .custom(async (account_email, { req }) => {
        const emailExists = await accountModel.checkExistingEmail(account_email)
        const { account_id } = req.res.locals.accountData
        const account = await accountModel.getAccountById(account_id)

        if (account_email === account.account_email) {
          return
        }

        if (emailExists) {
          throw new Error("Email exists. Please log in or use different email")
        }
      }),
  ]
}

validate.checkUpdatedData = async (req, res, next) => {
  const { account_firstname, account_lastname, account_email, account_id } = req.body
  let errors = []
  errors = validationResult(req)
  if (!errors.isEmpty()) {
    let nav = await utilities.getNav()
    const { account_id } = req.body
    const accountResult = await accountModel.getAccountById(account_id)
    res.status(501).render("./account/update-account", {
      title: "Edit Account",
      nav,
      errors,
      accountData: accountResult
    })
    return
  }
  next()
}

validate.passwordRules = () => {
  return [body("account_password")
    .trim()
    .notEmpty()
    .isStrongPassword({
      minLength: 12,
      minLowercase: 1,
      minUppercase: 1,
      minNumbers: 1,
      minSymbols: 1
    })
    .withMessage("Password does not meet requirements.")]
}

validate.checkUpdatedPassword = async (req, res, next) => {
  let errors = []
  errors = validationResult(req)
  if (!errors.isEmpty()) {
    const { account_id } = req.body
    const accountResult = await accountModel.getAccountById(account_id)
    let nav = await utilities.getNav()
    res.status(501).render("./account/update-account", {
      title: "Edit Account",
      nav,
      errors,
      accountData: accountResult
    })
    return
  }
  next()
}



module.exports = validate