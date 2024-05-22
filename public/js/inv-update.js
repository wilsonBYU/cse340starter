const form = document.querySelector("#update-form")
form.addEventListener("change", function () {
  const updateBtn = document.getElementsByName("submit")[0]
  updateBtn.removeAttribute("disabled")
})