import { skillsData } from "../store/skills_store"
import { baseUrl } from "./base_api"


export function getSkillsDetails() {
    fetch(`${baseUrl}/habilidades`)
    .then(response => response.json()
        .then(data => {
            skillsData.set(data)
        }))
    .catch(error => {
        console.log(error)
        return []
    })
}