import { createSelector } from '@reduxjs/toolkit'
import { AppState } from "../store";


export const selectAbout = (state:AppState) => state.aboutReducer

export const selectSocialLinks = createSelector(selectAbout, (socialLinks) => {
    return {
        social: socialLinks.socialLinks?.social || []
    }
})
