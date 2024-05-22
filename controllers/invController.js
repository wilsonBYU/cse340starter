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
  const classificationSelect = await utilities.buildClassificationList()
  res.render("./inventory/management", {
    title: "Vehicle Management",
    nav,
    errors: null,
    classificationSelect
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
    const classificationSelect = await utilities.buildClassificationList()
    res.status(201).render("./inventory/management", {
      classificationSelect,
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
    const classificationSelect = await utilities.buildClassificationList()
    res.status(201).render("./inventory/management", {
      classificationSelect,
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

invCont.getInventoryJSON = async (req, res, next) => {
  const classification_id = parseInt(req.params.classification_id)
  const invData = await invModel.getInventoryByClassificationId(classification_id)
  if (invData[0].inv_id) {
    return res.json(invData)
  } else {
    next(new Error("No data returned"))
  }
}

invCont.buildEditInventory = async (req, res, next) => {
  let inv_id = parseInt(req.params.inv_id)
  const nav = await utilities.getNav()
  const itemData = await invModel.getVehicleById(inv_id)
  const classificationSelect = await utilities.buildClassificationList(itemData.classification_id)
  const itemName = `${itemData.inv_make} ${itemData.inv_model}`
  res.render("./inventory/edit-inventory", {
    title: "Edit " + itemName,
    nav,
    classifications: classificationSelect,
    errors: null,
    inv_id: inv_id,
    inv_make: itemData.inv_make,
    inv_model: itemData.inv_model,
    inv_year: itemData.inv_year,
    inv_description: itemData.inv_description,
    inv_image: itemData.inv_image,
    inv_thumbnail: itemData.inv_thumbnail,
    inv_price: itemData.inv_price,
    inv_miles: itemData.inv_miles,
    inv_color: itemData.inv_color,
    classification_id: itemData.classification_id
  })
}

invCont.updateInventory = async (req, res, next) => {
  let nav = await utilities.getNav()
  const { classification_id, inv_make, inv_model, inv_description, inv_image, inv_thumbnail, inv_price, inv_year, inv_miles, inv_color, inv_id } = req.body
  const updateResult = await invModel.updateInventory(classification_id, inv_make, inv_model, inv_description, inv_image, inv_thumbnail, inv_price, inv_year, inv_miles, inv_color, inv_id)
  if (updateResult) {
    const itemName = updateResult.inv_make + " " + updateResult.inv_model
    req.flash("notice", `The ${itemName} was successfully updated.`)
    res.redirect("/inv/")
  } else {
    const classifications = await utilities.buildClassificationList(classification_id)
    const itemName = `${inv_make} ${inv_model}`
    req.flash("notice", "Sorry, the insert failed.")
    res.status(501).render("./inventory/edit-inventory", {
      title: "Edit " + itemName,
      nav,
      classifications,
      errors: null,
      classification_id,
      inv_make,
      inv_model,
      inv_description,
      inv_image,
      inv_thumbnail,
      inv_price,
      inv_year,
      inv_miles,
      inv_color,
      inv_id
    })
  }
}

invCont.buildDeleteInventory = async (req, res, next) => {
  const nav = await utilities.getNav()
  const inv_id = parseInt(req.params.inv_id)
  const itemData = await invModel.getVehicleById(inv_id)
  res.render("./inventory/delete-confirm", {
    title: `Delete ${itemData.inv_make} ${itemData.inv_model}`,
    nav,
    errors: null,
    inv_make: itemData.inv_make,
    inv_model: itemData.inv_model,
    inv_year: itemData.inv_year,
    inv_price: itemData.inv_price,
    inv_id
  })
}

invCont.deleteIventory = async (req, res, next) => {
  const { inv_id, inv_make, inv_model } = req.body
  const deleteResult = await invModel.deleteIventory(inv_id)
  console.log("###########################" + deleteResult)
  if (deleteResult) {
    req.flash("notice", `${inv_make} ${inv_model} was deleted successfully`)
    res.redirect("/inv")
  } else {
    req.flash("notice", `Error: ${inv_make} ${inv_model} was not deleted`)
    res.redirect(`/inv/delete/${inv_id}`)
  }
}

module.exports = invCont