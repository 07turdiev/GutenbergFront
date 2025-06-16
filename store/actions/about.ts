import {createAsyncThunk} from "@reduxjs/toolkit";
import AboutService from "../../services/about";
import {FetchParams} from "../../models/Actions/Params";

export const fetchAbout = createAsyncThunk(
    'about/fetchAbout',
    async ({locale, config, ctx} : FetchParams, thunkApi) => {
        try {
            const response = await AboutService.fetchAbout({locale, config, ctx})
            return response.data

        }catch (err){
            return thunkApi.rejectWithValue('Ошибка при получение заказов')
        }
    }
)

export const fetchSocialLinks = createAsyncThunk(
    'about/fetchSocialLinks',
    async ({locale, config, ctx} : FetchParams, thunkApi) => {
        try {
            const response = await AboutService.fetchSocialLinks({locale, config, ctx})
            return response.data

        }catch (err){
            return thunkApi.rejectWithValue('Ошибка при получение заказов')
        }
    }
)

export const fetchContacts= createAsyncThunk(
    'about/fetchContacts',
    async ({locale, config, ctx} : FetchParams, thunkApi) => {
        try {
            const response = await AboutService.fetchContacts({locale, config, ctx})
            return response.data

        }catch (err){
            return thunkApi.rejectWithValue('Ошибка при получение заказов')
        }
    }
)

export const fetchStatistics= createAsyncThunk(
    'about/fetchStatistics',
    async ({locale, config, ctx} : FetchParams, thunkApi) => {
        try {
            const response = await AboutService.fetchStatistics({locale, config, ctx})
            return response.data

        }catch (err){
            return thunkApi.rejectWithValue('Ошибка при получение заказов')
        }
    }
)