
import { AppState } from "../store";
import {createSelector} from "@reduxjs/toolkit";

export const selectAuthors = (state:AppState) => state.authorsReducer;

export const selectAuthorsOptions = createSelector(selectAuthors, (authors) => {
    const authorsOption =  authors.authorsList.map((author) => {
        return {
            value: author.slug,
            label: author.name
        }
    })
    return  {
        authorsOption
    };
})