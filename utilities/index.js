const invModel = require("../models/inventory-model")
const Util = {}


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
        <h2/>
        <span>
          $${new Intl.NumberFormat("en-US").format(vehicle.inv_price)}
        </span>
      </div>
    </li>
  `
}

Util.buildClassificationGrid = async function (data) {
  let grid
  if (data.length > 0) {
    grid = `
      <ul id="inv-display">
        ${data.map(classificationGridItem).join("")}
      </ul>`
  } else {
    grid = `<p class="notice">Sorry, no matching vehicles could be found.</p>`
  }
  return grid
}


/************************************
 * Middleware for handling errors
 * wrap other function in this for
 * General error handling
 ************************************/
Util.handleErrors = fn => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next)


module.exports = Util