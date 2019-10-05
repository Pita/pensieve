document.getElementById('form-submit').addEventListener('submit', function (event) {
  event.preventDefault();

  const data = {
    firstName: event.target[0].value,
    lastName: event.target[1].value,
    email: event.target[2].value,
    phone: event.target[3].value,
  }

  console.log(data)
})

document.getElementsByClassName('close-btn')[0].addEventListener('click', (event) => {
  document.getElementsByClassName('form-overlay')[0].style.display = "none"
  document.body.style.overflow = "auto";
})

const trigger = document.getElementsByClassName('car-more-details')
for (let element of trigger) {
  element.addEventListener('click', () => {
    document.getElementsByClassName('form-overlay')[0].style.display = "block"
    document.body.style.overflow = "hidden"
  })
}
