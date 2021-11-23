import { jobDetails, studyDetails } from "../store/exp_details_store";
import { baseUrl } from "./base_api";

export function getExperienceDetails() {
    fetch(`${baseUrl}/experience`)
    .then(response => response.json()
        .then(data => {
            console.log(data)
            jobDetails.set(data.job)
            studyDetails.set(data.study)
        }))
    .catch(error => {
        console.log(error)
        return []
    })
}