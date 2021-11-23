import { writable } from 'svelte/store'

let profile = {
    picUrl: "",
    name: "",
    position: "",
    label: "",
    social: {
      linkedIn: "",
      email: ""
    },
    description: ""
  }

export const profileData = writable(profile)