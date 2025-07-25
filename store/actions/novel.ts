import {createAsyncThunk} from "@reduxjs/toolkit";
import NovelService from "../../services/novels";
import {AxiosRequestConfig} from "axios";
import {toast} from "react-toastify";
import {GetServerSidePropsContext} from "next";
import AddToMark from "../../components/Toasts/AddToMark";
import {FetchParams} from "../../models/Actions/Params";
import {adaptNovelData, adaptNovelsArray} from "../../utils/strapiAdapter";
import {IMeta} from "../../models/IMeta";


function adaptStrapiMetaToIMeta(meta): IMeta {
    if (!meta || !meta.pagination) return null;
    return {
        links: {
            next: null,
            previous: null
        },
        count: meta.pagination.total,
        page_size: meta.pagination.pageSize,
        num_pages: meta.pagination.pageCount,
        current_page: meta.pagination.page,
        countItemsOnPage: meta.pagination.pageSize
    };
}

export const fetchNovels = createAsyncThunk(
    'novel/fetchNovels',
    async ({locale, opt, ctx} : { locale: string, opt?: AxiosRequestConfig, ctx?: GetServerSidePropsContext}, thunkApi) => {
        try {
            // Build query params: always include locale and ensure cover (muqova) is populated
            const params = {
                locale,
                populate: 'muqova',
                ...(opt?.params || {})
            } as Record<string, any>;

            // Build axios config without the params field to avoid duplication
            const axiosConfig: AxiosRequestConfig = { ...(opt || {}) };
            if (axiosConfig.params) delete axiosConfig.params;

            const response = await NovelService.fetchNovels(params, axiosConfig, ctx);
            return {
                meta: adaptStrapiMetaToIMeta(response.data.meta),
                results: adaptNovelsArray(response.data.data)
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
            // For single item by slug, we get an array, take the first item
            const novelData = Array.isArray(response.data.data) ? response.data.data[0] : response.data.data;
            return adaptNovelData(novelData)
        }catch (err){
            return thunkApi.rejectWithValue('Ошибка при получение новелы')
        }
    }
)

export const fetchNovelByDocumentId = createAsyncThunk(
    'novel/fetchNovelByDocumentId',
    async (config: {
        locale: string,
        documentId: string,
        opt?: AxiosRequestConfig,
        ctx?: GetServerSidePropsContext
    }, thunkApi) => {
        try {
            const response = await NovelService.fetchNovelByDocumentId(config.locale, config.documentId, config.opt, config.ctx)
            return adaptNovelData(response.data.data)
        }catch (err){
            return thunkApi.rejectWithValue('Ошибка при получение новелы по documentId')
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
            // For single item by slug, we get an array, take the first item
            const novelData = Array.isArray(response.data.data) ? response.data.data[0] : response.data.data;
            return adaptNovelData(novelData)
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
                results: adaptNovelsArray(response.data.data)
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
            // For new Strapi API, audio is included in the novel data
            // So we'll return an empty array and let the novel data provide the audio
            // The audio_list is already set in adaptNovelData
            return []
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
                results: adaptNovelsArray(response.data.data),
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
                results: adaptNovelsArray(response.data.data),
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
                results: adaptNovelsArray(response.data.data)
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
                results: adaptNovelsArray(response.data.data)
            }
        }catch (err){
            return thunkApi.rejectWithValue('Ошибка при получение новых новелл')
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
                results: adaptNovelsArray(response.data.data)
            }
        }catch (err){
            return thunkApi.rejectWithValue('Ошибка при получение новелл по категории')
        }
    }
)
