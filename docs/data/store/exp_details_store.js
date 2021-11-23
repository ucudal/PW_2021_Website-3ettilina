import { writable } from "svelte/store"

let jobExperienceDetails =
    {
        date: String,
        current: Boolean,
        title: String,
        place: {
            name: String,
            webpage: String
        },
        description: [String]
    }

let studyExperienceDetails =
    {
        date: String,
        completed: Boolean,
        title: String,
        place: {
            name: String,
            webpage: String,
            certificate: String
        },
        description: [String]
    }

export let jobDetails = writable([jobExperienceDetails])
export let studyDetails = writable([studyExperienceDetails])