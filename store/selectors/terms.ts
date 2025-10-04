import { createSelector } from '@reduxjs/toolkit'
import { AppState } from "../store";

export const selectTerms = (state: AppState) => state.termsReducer

export const selectTermsData = createSelector(selectTerms, (terms) => {
    return {
        data: terms.data,
        loading: terms.loading,
        error: terms.error
    }
})
