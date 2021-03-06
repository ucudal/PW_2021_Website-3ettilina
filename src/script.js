const btnOpenContactModal = document.getElementById('contact__btn--open')
const btnCloseContactModal = document.getElementById('contact__btn--close')
const btnSubmit = document.getElementById('contact__btn--submit')

const modalContent = document.getElementById('contact__modal--container')

let iptName = document.getElementById("contact__ipt--name")
let iptEmail = document.getElementById("contact__ipt--email")
let iptPhone = document.getElementById("contact__ipt--phone")
let iptSubject = document.getElementById("contact__ipt--subject")
let iptContent = document.getElementById("contact__ipt--content")

handleCloseModal()
setupButtons()

function setupButtons() {
    btnOpenContactModal.onclick = handleOpenModal
    btnCloseContactModal.onclick = handleCloseModal
    btnSubmit.onclick = sendFakeEmail

    // If user touches outside the modal, close it
    window.onclick = function(event) {
        if (event.target == modalContent) {
            handleCloseModal()
        }
    }
}

function handleOpenModal() {
    modalContent.classList.remove("contact__modal--hidden")
}

function handleCloseModal() {
    modalContent.classList.add("contact__modal--hidden")
}

function sendFakeEmail() {
    let details = {
        name: iptName.value,
        email: iptEmail.value,
        phone: iptEmail.value,
        subject: iptSubject.value,
        content: iptContent.value
    }

    clearModalFields()
    handleCloseModal()
    alert(`Thanks for contacting me, ${details.name}! I'll reply back as soon as possible :)`)
    console.log(details)
}

function clearModalFields() {
    iptName.value = ''
    iptEmail.value = ''
    iptPhone.value = ''
    iptSubject.value = ''
    iptContent.value = ''
}