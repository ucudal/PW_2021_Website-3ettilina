import { profileData } from '../store/profile_store'
import { baseUrl } from './base_api'

export function getProfileDetails() {
    fetch(`${baseUrl}/profile-details`)
    .then(response => response.json()
        .then(data => {
            profileData.set(data)
        }))
    .catch(error => {
        console.log(error)
        return []
    })
}