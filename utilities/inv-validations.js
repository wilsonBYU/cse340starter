const utilities = require(".")
const accountModel = require("../models/account-model")

const { body, validationResult } = require("express-validator")
const validate = {}

validate.classificationRules = () => {
  return [
    body("classification_name")
      .trim()
      .escape()
      .notEmpty()
      .isLength({ min: 3 })
      .withMessage("Pleasee provide a valid classification"),
  ]
}

validate.checkClassificationData = async (req, res, next) => {
  const { classification_name } = req.body
  let errors = []
  errors = validationResult(req)
  if (!errors.isEmpty()) {
    let nav = await utilities.getNav()
    res.render("./inventory/add-classification", {
      errors,
      title: "Add new classification",
      nav,
      classification_name
    })
    return
  }
  next()
}

validate.inventoryRules = () => {
  return [
    body("classification_id")
      .trim()
      .escape()
      .notEmpty()
      .withMessage("Pleasee provide a valid classification"),
    body("inv_make")
      .trim()
      .escape()
      .notEmpty()
      .isLength({ min: 3 })
      .withMessage("Pleasee provide a valid make"),
    body("inv_model")
      .trim()
      .escape()
      .notEmpty()
      .isLength({ min: 3 })
      .withMessage("Pleasee provide a valid model"),
    body("inv_description")
      .trim()
      .escape()
      .notEmpty()
      .withMessage("Pleasee provide a valid description"),
    body("inv_image")
      .trim()
      .escape()
      .notEmpty()
      .withMessage("Pleasee provide a valid image path"),
    body("inv_thumbnail")
      .trim()
      .escape()
      .notEmpty()
      .withMessage("Pleasee provide a valid image path"),
    body("inv_price")
      .trim()
      .escape()
      .notEmpty()
      .isNumeric()
      .withMessage("Pleasee provide a valid price"),
    body("inv_year")
      .trim()
      .escape()
      .notEmpty()
      .isNumeric()
      .isLength({ min: 4, max: 4 })
      .withMessage("Pleasee provide a valid year"),
    body("inv_miles")
      .trim()
      .escape()
      .notEmpty()
      .isNumeric()
      .withMessage("Pleasee provide a valid miles"),
    body("inv_color")
      .trim()
      .escape()
      .notEmpty()
      .withMessage("Pleasee provide a valid color"),
  ]
}

validate.checkInventoryData = async function (req, res, next) {
  const { classification_id, inv_make, inv_model, inv_description, inv_image, inv_thumbnail, inv_price, inv_year, inv_miles, inv_color } = req.body
  let classifications = await utilities.buildClassificationList(classification_id)
  let errors = []
  errors = validationResult(req)
  if (!errors.isEmpty()) {
    let nav = await utilities.getNav()
    res.render("./inventory/add-inventory", {
      classifications,
      errors,
      title: "Add new inventory",
      classification_id,
      nav,
      inv_make,
      inv_model,
      inv_description,
      inv_image,
      inv_thumbnail,
      inv_price,
      inv_year,
      inv_miles,
      inv_color
    })
    return
  }
  next()
}

module.exports = validate