import { writable } from "svelte/store"

let jobExperienceDetails =
    {
        fechaInicio: String,
        fechaFin: String,
        actual: Boolean,
        puesto: String,
        empresa: {
            nombre: String,
            web: String
        },
        descripcion: [String]
    }

let studyExperienceDetails =
    {
        fechaInicio: String,
        fechaFin: String,
        completado: Boolean,
        titulo: String,
        instituto: {
            nombre: String,
            web: String,
            certificado: String
        },
        descripcion: [String]
    }

export let jobDetails = writable([jobExperienceDetails])
export let studyDetails = writable([studyExperienceDetails])