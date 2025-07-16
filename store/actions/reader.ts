import {createAsyncThunk} from "@reduxjs/toolkit";
import {AxiosRequestConfig} from "axios";
import ReaderService from "../../services/reader";
import AuthorService from "../../services/author";
import NovelService from "../../services/novels";

export const fetchReaders = createAsyncThunk(
    'reader/fetchReaders',
    async ({locale, opt} : { locale: string, opt?: AxiosRequestConfig}, thunkApi) => {
        try {
            const response = await ReaderService.fetchReaders(locale, opt)
            return {
                meta: response.data,
                results: response.data.data
            }
        }catch (err){
            return thunkApi.rejectWithValue('Ошибка при получение исполнителей')
        }
    }
)

export const fetchReaderOne = createAsyncThunk(
    'reader/fetchReaderOne',
    async ({locale, slug, opt} : { locale: string, slug: string, opt?: AxiosRequestConfig}, thunkApi) => {
        try {
            const response = await ReaderService.fetchReaderOne(locale, slug, opt)
            return response.data
        }catch (err){
            return thunkApi.rejectWithValue('Ошибка при получение исполнителя')
        }
    }
)

export const fetchNovelsOfReader = createAsyncThunk(
    'reader/fetchNovelsOfReader',
    async ({locale, slug, opt} : { locale: string, slug: string, opt?: AxiosRequestConfig}, thunkApi) => {
        try {
            const response = await NovelService.fetchNovelsOfReaders(locale, slug, opt)
            return {
                results: response.data.data,
                meta: response.data
            }
        }catch (err){
            return thunkApi.rejectWithValue('Ошибка при получение новелл')
        }
    }
)
