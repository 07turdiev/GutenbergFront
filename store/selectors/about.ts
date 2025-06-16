import { createSelector } from '@reduxjs/toolkit'
import { AppState } from "../store";


export const selectAbout = (state:AppState) => state.aboutReducer

export const selectSocialLinks = createSelector(selectAbout, (socialLinks) => {
    let links = []

    if(socialLinks.socialLinks){
        links = Object.entries(socialLinks.socialLinks)
    }

    return {
        social: links
    }
})
