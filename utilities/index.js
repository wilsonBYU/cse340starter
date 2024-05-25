const invModel = require("../models/inventory-model")
const actModel = require("../models/account-model")
const Util = {}
const jwt = require("jsonwebtoken")
require("dotenv").config()


/***************************************
 * Construct the nav HTML unordered list
 **************************************/

// Creates a list item
const listItem = item => {
  return `
  <li>
    <a href="/inv/type/${item.classification_id}" title="See our inventory of ${item.classification_name} vehicles">
      ${item.classification_name}
    </a>
  </li>` //clean the string
}

// Takes a list and then construct an Unordered list with each item
const navTemplate = data => {
  return `
  <ul>
    <li><a href="/" title="Home page">Home</a></li>
    ${data.rows.map(listItem).join("")}
  </ul>`
}

// Fetchs the car types and return a constructed HTML unordered list
Util.getNav = async function (req, res, next) {
  let data = await invModel.getClassifications()
  let template = navTemplate(data)
  return template
}


/******************************************
 * Build the classification view HTML
 ****************************************/

// build the vehicle item
const classificationGridItem = (vehicle) => {
  return `
    <li>
      <a href="../../inv/detail/${vehicle.inv_id}" title="View ${vehicle.inv_make} ${vehicle.inv_model} detals">
        <img src="${vehicle.inv_thumbnail}" alt="${vehicle.inv_make} ${vehicle.inv_model} on CSE Motors">
      </a>
      <div class="namePrice">
        <hr />
        <h2>
          <a href="../../inv/detail/${vehicle.inv_id}" title="View ${vehicle.inv_make} ${vehicle.inv_model} details">
            ${vehicle.inv_make} ${vehicle.inv_model}
          </a>
        </h2>
        <span>
          $${new Intl.NumberFormat("en-US").format(vehicle.inv_price)}
        </span>
      </div>
    </li>
  `
}

Util.buildClassificationGrid = async function (data) {
  let grid
  let hasData
  if (data.length > 0) {
    grid = `
      <ul id="inv-display">
        ${data.map(classificationGridItem).join("")}
      </ul>`
    hasData = true
  } else {
    grid = `<p class="notice">Sorry, no matching vehicles could be found.</p>`
    hasData = false
  }
  return { grid, hasData }
}

Util.buildByVehicleId = async function (data) {
  let template
  if (data != null || data != undefined) {
    template = `
      <div id="inv-details">
        <div class="inv-details_image">
          <img src="${data.inv_image}" alt="${data.inv_make} ${data.inv_model} details">
        </div>
        <div class="inv-details_info">
          <h3>${data.inv_make} ${data.inv_model} Details</h3>
          <p><strong>Price: $${new Intl.NumberFormat("en-US").format(data.inv_price)}</strong></p>
          <p><strong>Description: </strong>${data.inv_description}</p>
          <p><strong>Color: </strong>${data.inv_color}</p>
          <p><strong>Miles: </strong>${new Intl.NumberFormat("en-US").format(data.inv_miles)}</p>

        </div>
      </div>
    `
  } else {
    template = `<p class="notice">Sorry, no matching vehicles could be found.</p>`
  }
  return template

}

let classficiationListItemTemplate = (c_id, row) => {
  let option = `
    <option value="${row.classification_id}" ${row.classification_id != null && row.classification_id == c_id ? "selected" : ""}>
      ${row.classification_name}
    </option>
  `.split("\n").join(" ")
  return option
}

let classificationListTemplate = (classification_id, data) => {
  return `
  <select name="classification_id" id="classificationList" required>
    <option value="--">Choose a classification</option>
    ${data.rows.map(row => classficiationListItemTemplate(classification_id, row)).join(" ")}
  </select >`
}

Util.buildClassificationList = async function (classification_id = null) {
  let data = await invModel.getClassifications()
  let classificationList = classificationListTemplate(classification_id, data)
  return classificationList
}

Util.checkJWTToken = (req, res, next) => {
  if (req.cookies.jwt) {
    jwt.verify(
      req.cookies.jwt,
      process.env.ACCESS_TOKEN_SECRET,
      function (err, accountData) {
        if (err) {
          req.flash("Please log in")
          res.clearCookie("jwt")
          return res.redirect("/account/login")
        }
        res.locals.accountData = accountData
        res.locals.loggedin = 1
        next()
      })
  } else {
    next()
  }
}

Util.checkLogin = (req, res, next) => {
  if (res.locals.loggedin) {
    next()
  } else {
    req.flash("notice", "Please login in.")
    return res.redirect("/account/login")
  }
}


//Check if the user tye is allowed to access the routes
Util.checkAccessRights = async (req, res, next) => {
  if (req.cookies.jwt) {
    const { account_type } = jwt.verify(req.cookies.jwt, process.env.ACCESS_TOKEN_SECRET)
    if (["Employee", "Admin"].includes(account_type)) {
      next()
    }
  } else {
    req.flash("notice", "Access forbidden")
    res.redirect("/account/login")
  }
}

Util.updateJWTAccountInfo = async (data, req, res, next) => {
  if (req.cookies.jwt) {
    let jwtoken = req.cookies.jwt
    const { exp } = jwt.verify(jwtoken, process.env.ACCESS_TOKEN_SECRET)
    const newExp = (new Date(exp * 1000).getTime() - new Date().getTime()) / 1000
    const newAccessToken = jwt.sign(data, process.env.ACCESS_TOKEN_SECRET, { expiresIn: Math.round(newExp) })
    if (process.env.NODE_ENV === "development") {
      res.cookie("jwt", newAccessToken, { httpOnly: true, maxAge: 3600 * 1000 })
    } else {
      res.cookie("jwt", newAccessToken, { httpOnly: true, secure: true, maxAge: 3600 * 1000 })
    }
    return
  }
}

/************************************
 * Middleware for handling errors
 * wrap other function in this for
 * General error handling
 ************************************/
Util.handleErrors = fn => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next)



module.exports = Util