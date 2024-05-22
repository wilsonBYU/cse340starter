'use strict'

const tableRowTemplate = (row) => {
  console.log(row.inv_id + " " + row.inv_model)
  return `
  <tr>
    <td>${row.inv_make} ${row.inv_model}</td>
    <td><a href='/inv/edit/${row.inv_id}' title="Click to update">Modify</a></td>
    <td><a href='/inv/delete/${row.inv_id}' title="Click to delete">Delete</a></td>
  </tr>
  `
}

const tableTemplate = (data) => {
  return `
  <thead>
    <tr>
      <th colspan="3">Vehicle Name</th>
    </tr>
  </thead>
  <tbody>
    ${data.map(tableRowTemplate).join("")}
  </tbody>
  `
}

function buildInventoryList(data) {
  let inventoryDisplay = document.getElementById("inventoryDisplay")
  let dataTable = tableTemplate(data)
  inventoryDisplay.innerHTML = dataTable
}

let classificationList = document.querySelector("#classificationList")
classificationList.addEventListener("change", function () {
  let classification_id = classificationList.value
  console.log(`Classification_id is: ${classification_id}`)
  let classIdURL = "/inv/getInventory/" + classification_id
  fetch(classIdURL)
    .then(function (response) {
      if (response.ok) {
        return response.json()
      }
      throw Error("Network response was not OK")
    })
    .then(function (data) {
      console.log(data)
      buildInventoryList(data)
    })
    .catch(function (error) {
      console.log('There was a problem: ', error.message)
    })
})