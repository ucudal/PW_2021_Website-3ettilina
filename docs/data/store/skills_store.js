import { writable } from "svelte/store"

let skills = {
    expertise: {
        title: String,
        list: [String]
    },
    main: {
        title: String,
        list: [String]
    }
}

export const skillsData = writable(skills)