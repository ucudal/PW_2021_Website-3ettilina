import { profileData } from '../store/profile_store'
import { baseUrl, response } from './base_api'

export function getProfileDetails() {
    fetch(`${baseUrl}/perfil`)
    .then(response => response.json()
        .then(data => {
            profileData.set(data)
        }))
    .catch(error => {
        console.log(error)
        return []
    })
}

export async function sendMessage(details, handleClose) {
    fetch(`${baseUrl}/enviar-formulario`, {
        method: 'POST',
        credentials: 'include',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(details)
    })
    .then(res => {
        switch (res.status) {
            case 200:
                res.text()
                .then(data => {
                    console.log("Message sent!")
                    handleClose()
                    alert(`Thanks for your message, ${data}. I'll reply as soon as possible`)
                    return data
                })
                break;
            case 400:
                res.text().then((text) => {
                    console.log("Something went wrong")
                    alert(`Unfortunately something went wrong. Check if you added at least your name on the form :)`)
                    return text
                })
            default:
                break;
        }
    })
}