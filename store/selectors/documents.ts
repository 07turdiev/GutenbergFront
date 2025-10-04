import { createSelector } from '@reduxjs/toolkit'
import { AppState } from "../store";

export const selectDocuments = (state: AppState) => state.documentsReducer

export const selectDocumentsData = createSelector(selectDocuments, (documents) => {
    return {
        data: documents.data,
        loading: documents.loading,
        error: documents.error
    }
})
