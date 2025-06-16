import { createSelector } from '@reduxjs/toolkit'
import { AppState } from "../store";


export const selectGenres = (state:AppState) => state.genresReducer

export const selectGenreOptions = createSelector(selectGenres, (genres) => {
    const GenresOptions =  genres.genresList.map((genre) => {
        return {
            value: genre.slug,
            label: genre.name
        }
    })
    return  {
        genresOption: GenresOptions
    };
})