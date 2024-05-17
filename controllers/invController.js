const invModel = require("../models/inventory-model")
const utilities = require("../utilities/")

const invCont = {}

/***************************
 *  Build inventory by classification view
 ***************************/

invCont.buildByClassificationId = async function (req, res, next) {
  const classification_id = req.params.classificationId
  const data = await invModel.getInventoryByClassificationId(classification_id)
  const { grid, hasData } = await utilities.buildClassificationGrid(data)
  let nav = await utilities.getNav()
  const className = hasData ? data[0].classification_name : "No "
  res.render("./inventory/classification", {
    title: className + " vehicles",
    nav,
    grid
  })
}

invCont.buildByVehicleId = async function (req, res, next) {
  const vehicle_id = req.params.vehicleId
  const data = await invModel.getVehicleById(vehicle_id)
  const template = await utilities.buildByVehicleId(data)
  let nav = await utilities.getNav()
  res.render("./inventory/vehicle", {
    title: `${data.inv_year} ${data.inv_make} ${data.inv_model}`,
    nav,
    template,
    errors: null
  })
}

invCont.buildInventoryManagement = async function (req, res, next) {
  let nav = await utilities.getNav()
  res.render("./inventory/management", {
    title: "Management",
    nav,
    errors: null
  })
}

invCont.buildAddClassification = async function (req, res, next) {
  let nav = await utilities.getNav()
  res.render("./inventory/add-classification", {
    title: "Add new classification",
    nav,
    errors: null
  })
}

invCont.registerClassification = async function (req, res, next) {
  let nav = await utilities.getNav()
  let { classification_name } = req.body
  const classificationResult = invModel.registerClassification(classification_name)
  if (classificationResult) {
    req.flash("notice", `The new classification ${classification_name} has been added.`)
    res.status(201).render("./inventory/management", {
      title: "Management",
      nav,
      errors: null
    })
  } else {
    req.flash("notice", `There was an error adding ${classification_name}`)
    res.status(501).render("./inventory/add-classification", {
      title: "Add new classification",
      nav,
      errors: null
    })
  }
}

invCont.buildAddInventory = async function (req, res, next) {
  let nav = await utilities.getNav()
  let classifications = await utilities.buildClassificationList()

  res.render("./inventory/add-inventory", {
    classifications,
    title: "Add inventory",
    nav,
    errors: null
  })
}

invCont.registerIventory = async function (req, res, next) {
  let nav = await utilities.getNav()
  let { classification_id, inv_make, inv_model, inv_description, inv_image, inv_thumbnail, inv_price, inv_year, inv_miles, inv_color } = req.body
  const inventoryResult = await invModel.registerInventory(classification_id, inv_make, inv_model, inv_description, inv_image, inv_thumbnail, inv_price, inv_year, inv_miles, inv_color)
  if (inventoryResult) {
    req.flash("notice", `The new inventory has been added successfuly.`)
    res.status(201).render("./inventory/management", {
      title: "Management",
      nav,
      errors: null
    })
  } else {
    let classifications = await utilities.buildClassificationList(classification_id)
    req.flash("notice", `There was an error adding the new inventory`)
    res.status(501).render("./inventory/add-inventory", {
      classifications,
      title: "Add new inventory",
      nav,
      errors: null,
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
  }
}

module.exports = invCont