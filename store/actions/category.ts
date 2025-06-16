import {createAsyncThunk} from "@reduxjs/toolkit";
import {AxiosRequestConfig} from "axios";
import CategoriesService from "../../services/categories";

export const fetchCategories = createAsyncThunk(
    'category/fetchCategories',
    async ({locale, opt} : { locale: string, opt?: AxiosRequestConfig}, thunkApi) => {
        try {
            const response = await CategoriesService.fetchCategories(locale, opt)
            return response.data
        }catch (err){
            return thunkApi.rejectWithValue('Ошибка при получение новелл')
        }
    }
)

export const fetchCategoriesList = createAsyncThunk(
    'category/fetchCategoriesList',
    async ({locale, opt} : { locale: string, opt?: AxiosRequestConfig}, thunkApi) => {
        try {
            const response = await CategoriesService.fetchCategoriesList(locale, opt)
            return response.data
        }catch (err){
            return thunkApi.rejectWithValue('Ошибка при получение новелл')
        }
    }
)
