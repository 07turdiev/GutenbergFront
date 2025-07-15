import { createSelector } from '@reduxjs/toolkit'
import { AppState } from "../store";


export const selectGenres = (state:AppState) => state.genresReducer

export const selectGenreOptions = createSelector(selectGenres, (genres) => {
    console.log('DEBUG genresList:', genres.genresList);
    const GenresOptions =  genres.genresList.map((genre) => {
        return {
            value: genre.slug,
            label: genre.nomi || genre.name
        }
    })
    return  {
        genresOption: GenresOptions
    };
})