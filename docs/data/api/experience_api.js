import { jobDetails, studyDetails } from "../store/exp_details_store";
import { baseUrl } from "./base_api";

export function getJobExperience() {
    fetch(`${baseUrl}/experiencia-laboral`)
    .then(response => response.json()
        .then(data => {
            jobDetails.set(data['experiencia-laboral'])
        }))
    .catch(error => {
        console.log(error)
        return []
    })
}

export function getStudies() {
    fetch(`${baseUrl}/estudios`)
    .then(response => response.json()
        .then(data => {
            studyDetails.set(data)
        }))
    .catch(error => {
        console.log(error)
        return []
    })
}