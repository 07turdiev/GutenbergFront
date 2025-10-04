import { createSelector } from '@reduxjs/toolkit'
import { AppState } from "../store";

export const selectPrivacy = (state: AppState) => state.privacyReducer

export const selectPrivacyData = createSelector(selectPrivacy, (privacy) => {
    return {
        data: privacy.data,
        loading: privacy.loading,
        error: privacy.error
    }
})
