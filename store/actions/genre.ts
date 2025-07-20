import {createAsyncThunk} from "@reduxjs/toolkit";
import {AxiosRequestConfig} from "axios";
import CategoryService from "../../services/genre";

export const fetchCategories = createAsyncThunk(
    'category/fetchCategories',
    async ({locale, opt} : { locale: string, opt?: AxiosRequestConfig}, thunkApi) => {
        try {
            const response = await CategoryService.fetchCategories(locale, opt)
            return {
                results:  response.data.data,
                meta: response.data
            }
        }catch (err){
            return thunkApi.rejectWithValue('Ошибка при получение Категорий')
        }
    }
)

export const fetchCategoriesList = createAsyncThunk(
    'category/fetchCategoriesList',
    async ({locale, opt} : { locale: string, opt?: AxiosRequestConfig}, thunkApi) => {
        try {
            const response = await CategoryService.fetchCategoriesList(locale, opt)
            return response.data
        }catch (err){
            return thunkApi.rejectWithValue('Ошибка при получение Категорий')
        }
    }
)
