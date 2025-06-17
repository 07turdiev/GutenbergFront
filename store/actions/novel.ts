import {createAsyncThunk} from "@reduxjs/toolkit";
import NovelService from "../../services/novels";
import {AxiosRequestConfig} from "axios";
import {toast} from "react-toastify";
import {GetServerSidePropsContext} from "next";
import AddToMark from "../../components/Toasts/AddToMark";
import {FetchParams} from "../../models/Actions/Params";


export const fetchNovels = createAsyncThunk(
    'novel/fetchNovels',
    async ({locale, opt, ctx} : { locale: string, opt?: AxiosRequestConfig, ctx?: GetServerSidePropsContext}, thunkApi) => {
        try {
            const response = await NovelService.fetchNovels(locale, opt, ctx)
            return {
                meta: response.data.meta,
                results: response.data.data
            }

        }catch (err){
            return thunkApi.rejectWithValue('Ошибка при получение новелл')
        }
    }
)

export const fetchNovelOne = createAsyncThunk(
    'novel/fetchNovelOne',
    async (config: {
        locale: string,
        slug: string,
        opt?: AxiosRequestConfig,
        ctx?: GetServerSidePropsContext
    }, thunkApi) => {
        try {
            const response = await NovelService.fetchNovelOne(config.locale, config.slug, config.opt, config.ctx)
            return response.data.data
        }catch (err){
            return thunkApi.rejectWithValue('Ошибка при получение новелы')
        }
    }
)

export const fetchPlayerNovel= createAsyncThunk(
    'novel/fetchPlayerNovel',
    async (config: {
        locale: string,
        slug: string,
        opt?: AxiosRequestConfig,
        ctx?: GetServerSidePropsContext
    }, thunkApi) => {
        try {
            const response = await NovelService.fetchNovelOne(config.locale, config.slug, config.opt, config.ctx)
            return response.data.data
        }catch (err){
            return thunkApi.rejectWithValue('Ошибка при получение новелы')
        }
    }
)


export const fetchNovelActual = createAsyncThunk(
    'novel/fetchNovelActual',
    async (config: {
        locale: string,
        opt?: AxiosRequestConfig,
        ctx?: GetServerSidePropsContext
    }, thunkApi) => {
        try {
            const response = await NovelService.fetchNovelActual(config.locale, config.opt, config.ctx)
            return {
                meta: response.data.meta,
                results: response.data.data
            }
        }catch (err){
            return thunkApi.rejectWithValue('Ошибка при получение новелы')
        }
    }
)

export const fetchAudiosOfNovel = createAsyncThunk(
    'novel/fetchAudiosOfNovel',
    async (config: {
        locale: string,
        slug: string;
        opt?: AxiosRequestConfig,
        ctx?: GetServerSidePropsContext
    }, thunkApi) => {
        try {
            const response = await NovelService.fetchAudiosOfNovel(config.locale, config.slug, config.opt, config.ctx)
            return response.data.audio_list
        }catch (err){
            return thunkApi.rejectWithValue('Ошибка при получение списка аудио')
        }
    }
)

export const rateNovel = createAsyncThunk(
    'novel/rateNovel',
    async ({locale, slug, rating}: {locale: string, slug: string, rating: number}, thunkApi) => {
        try {
            const response = await NovelService.rateNovel({locale, slug, rating})
            toast('Вашь рейтинг отправлен', {
                position: "bottom-center",
                hideProgressBar: true,
                className: 'player-bar',
                autoClose: 1000
            })
        }catch (err){
            toast.error('Ошибка при отправке рейтинга')
            return thunkApi.rejectWithValue('Ошибка при отправке рейтинга')
        }
    }
)


export const saveNovel = createAsyncThunk(
    'novel/saveNovel',
    async ({locale, slug}: {locale: string, slug: string}, thunkApi) => {
        try {
            await NovelService.saveNovel({locale, slug})
            toast.dismiss();
            toast(AddToMark(locale), {
                position: "bottom-center",
                hideProgressBar: true,
                className: 'player-bar',
                autoClose: 1000
            })
            return slug;
        }catch (err){
            toast.error('Ошибка при добавлении')
            return thunkApi.rejectWithValue('Ошибка при добавлении')
        }
    }
)

export const deleteFromSavedNovel = createAsyncThunk(
    'novel/deleteFromSavedNovel',
    async ({locale, slug}: {locale: string, slug: string}, thunkApi) => {
        try {
            await NovelService.saveNovel({locale, slug})
            toast.dismiss();
            toast('Книга удалена из закладок', {
                position: "bottom-center",
                hideProgressBar: true,
                className: 'player-bar',
                autoClose: 1000
            })
            return slug;
        }catch (err){
            toast.error('Ошибка при удалении')
            return thunkApi.rejectWithValue('Ошибка при удалении')
        }
    }
)

export const fetchSavedNovels = createAsyncThunk(
    'novel/fetchSavedNovels',
    async ({locale, opt, ctx} : { locale: string, opt?: AxiosRequestConfig, ctx?: GetServerSidePropsContext}, thunkApi) => {
        try {
            const response = await NovelService.fetchSavedNovels(locale, opt, ctx)
            return {
                results: response.data.data,
                meta: response.data.meta
            }
        }catch (err){
            return thunkApi.rejectWithValue('Ошибка при получение списка новелл')
        }
    }
)

export const fetchFollowedNovels = createAsyncThunk(
    'novel/fetchFollowedNovels',
    async ({locale, config, ctx} : FetchParams, thunkApi) => {
        try {
            const response = await NovelService.fetchFollowedNovels({locale, config, ctx})
            return {
                results: response.data.data,
                meta: response.data.meta
            }
        }catch (err){
            return thunkApi.rejectWithValue('Ошибка при получение списка новелл')
        }
    }
)

// Yangi action'lar
export const fetchAudioNovels = createAsyncThunk(
    'novel/fetchAudioNovels',
    async ({locale, opt, ctx} : { locale: string, opt?: AxiosRequestConfig, ctx?: GetServerSidePropsContext}, thunkApi) => {
        try {
            const response = await NovelService.fetchAudioNovels(locale, opt, ctx)
            return {
                meta: response.data.meta,
                results: response.data.data
            }
        }catch (err){
            return thunkApi.rejectWithValue('Ошибка при получение аудио новелл')
        }
    }
)

export const fetchNewNovels = createAsyncThunk(
    'novel/fetchNewNovels',
    async ({locale, opt, ctx} : { locale: string, opt?: AxiosRequestConfig, ctx?: GetServerSidePropsContext}, thunkApi) => {
        try {
            const response = await NovelService.fetchNewNovels(locale, opt, ctx)
            return {
                meta: response.data.meta,
                results: response.data.data
            }
        }catch (err){
            return thunkApi.rejectWithValue('Ошибка при получение новых новелл')
        }
    }
)

export const fetchNovelsByGenre = createAsyncThunk(
    'novel/fetchNovelsByGenre',
    async ({locale, genreSlug, opt, ctx} : { locale: string, genreSlug: string, opt?: AxiosRequestConfig, ctx?: GetServerSidePropsContext}, thunkApi) => {
        try {
            const response = await NovelService.fetchNovelsByGenre(locale, genreSlug, opt, ctx)
            return {
                meta: response.data.meta,
                results: response.data.data
            }
        }catch (err){
            return thunkApi.rejectWithValue('Ошибка при получение новелл по жанру')
        }
    }
)

export const fetchNovelsByCategory = createAsyncThunk(
    'novel/fetchNovelsByCategory',
    async ({locale, categorySlug, opt, ctx} : { locale: string, categorySlug: string, opt?: AxiosRequestConfig, ctx?: GetServerSidePropsContext}, thunkApi) => {
        try {
            const response = await NovelService.fetchNovelsByCategory(locale, categorySlug, opt, ctx)
            return {
                meta: response.data.meta,
                results: response.data.data
            }
        }catch (err){
            return thunkApi.rejectWithValue('Ошибка при получение новелл по категории')
        }
    }
)
