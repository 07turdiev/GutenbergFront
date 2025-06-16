import {createAsyncThunk} from "@reduxjs/toolkit";
import {AxiosRequestConfig} from "axios";
import AdvertisingService from "../../services/advertising";

export const fetchAdvertisingRight = createAsyncThunk(
    'advertising/fetchAdvertisingRight',
    async ({locale, type, opt} : { locale: string, type: string; opt?: AxiosRequestConfig}, thunkApi) => {
        try {
            const response = await AdvertisingService.fetchAdvertising(locale, type, opt)
            return response.data
        }catch (err){
            return thunkApi.rejectWithValue('Ошибка при получение баннера')
        }
    }
)

export const fetchAdvertisingMainTop = createAsyncThunk(
    'advertising/fetchAdvertisingMainTop',
    async ({locale, type, opt} : { locale: string, type: string; opt?: AxiosRequestConfig}, thunkApi) => {
        try {
            const response = await AdvertisingService.fetchAdvertising(locale, type, opt)
            return response.data
        }catch (err){
            return thunkApi.rejectWithValue('Ошибка при получение баннера')
        }
    }
)

export const fetchAdvertisingMainBottom = createAsyncThunk(
    'advertising/fetchAdvertisingMainBottom',
    async ({locale, type, opt} : { locale: string, type: string; opt?: AxiosRequestConfig}, thunkApi) => {
        try {
            const response = await AdvertisingService.fetchAdvertising(locale, type, opt)
            return response.data
        }catch (err){
            return thunkApi.rejectWithValue('Ошибка при получение баннера')
        }
    }
)

export const fetchAdvertisingSection = createAsyncThunk(
    'advertising/fetchAdvertisingSection',
    async ({locale, type, opt} : { locale: string, type: string; opt?: AxiosRequestConfig}, thunkApi) => {
        try {
            const response = await AdvertisingService.fetchAdvertising(locale, type, opt)
            return response.data
        }catch (err){
            return thunkApi.rejectWithValue('Ошибка при получение баннера')
        }
    }
)

