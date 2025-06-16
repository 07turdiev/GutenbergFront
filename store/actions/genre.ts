import {createAsyncThunk} from "@reduxjs/toolkit";
import {AxiosRequestConfig} from "axios";
import GenreService from "../../services/genre";

export const fetchGenres = createAsyncThunk(
    'genre/fetchGenres',
    async ({locale, opt} : { locale: string, opt?: AxiosRequestConfig}, thunkApi) => {
        try {
            const response = await GenreService.fetchGenres(locale, opt)
            return {
                results:  response.data.results,
                meta: response.data
            }
        }catch (err){
            return thunkApi.rejectWithValue('Ошибка при получение Жанров')
        }
    }
)

export const fetchGenresList = createAsyncThunk(
    'genre/fetchGenresList',
    async ({locale, opt} : { locale: string, opt?: AxiosRequestConfig}, thunkApi) => {
        try {
            const response = await GenreService.fetchGenresList(locale, opt)
            return response.data
        }catch (err){
            return thunkApi.rejectWithValue('Ошибка при получение Жанров')
        }
    }
)
