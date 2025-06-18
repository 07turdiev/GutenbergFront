import {createAsyncThunk} from "@reduxjs/toolkit";
import {AxiosRequestConfig} from "axios";
import AuthorService from "../../services/author";
import NovelService from "../../services/novels";
import {GetServerSidePropsContext} from "next";
import errorCatcher from "../../utils/errorCatcher";
import {FetchArgs} from "@reduxjs/toolkit/query";
import {FetchParams} from "../../models/Actions/Params";
import {adaptAuthorData, adaptAuthorsArray, adaptNovelsArray} from "../../utils/strapiAdapter";

export const fetchAuthors = createAsyncThunk(
    'author/fetchAuthors',
    async ({locale, config} : FetchParams, thunkApi) => {
        try {
            const response = await AuthorService.fetchAuthors({locale, config})
            return  {
                results: adaptAuthorsArray(response.data.data),
                meta: response.data.meta
            }
        }catch (err){
            console.error('fetchAuthors error:', err);
            return thunkApi.rejectWithValue('Error fetching authors');
        }
    }
)

export const fetchAuthorOne = createAsyncThunk(
    'author/fetchAuthorOne',
    async ({locale, slug, config, ctx} : FetchParams, thunkApi) => {
        try {
            const response = await AuthorService.fetchAuthorOne({locale, slug, config, ctx})
            // For single item by slug, we get an array, take the first item
            const authorData = Array.isArray(response.data.data) ? response.data.data[0] : response.data.data;
            return adaptAuthorData(authorData)
        }catch (err){
            errorCatcher(err, thunkApi)
        }
    }
)

export const fetchAuthorByDocumentId = createAsyncThunk(
    'author/fetchAuthorByDocumentId',
    async ({locale, documentId, config, ctx} : FetchParams & {documentId: string}, thunkApi) => {
        try {
            const response = await AuthorService.fetchAuthorByDocumentId({locale, documentId, config, ctx})
            return adaptAuthorData(response.data.data)
        }catch (err){
            console.error('fetchAuthorByDocumentId error:', err);
            return thunkApi.rejectWithValue('Error fetching author by documentId');
        }
    }
)

export const fetchNovelsOfAuthor = createAsyncThunk(
    'author/fetchNovelsOfAuthor',
    async ({locale, slug, config, ctx} : FetchParams, thunkApi) => {
        try {
            const response = await NovelService.fetchNovelsOfAuthors(locale, slug, config, ctx)
            return {
                results: adaptNovelsArray(response.data.data),
                meta: response.data.meta
            }
        }catch (err){
            errorCatcher(err, thunkApi)
        }
    }
)

export const fetchAuthorsList = createAsyncThunk(
    'author/fetchAuthorsList',
    async ({locale, config} : FetchParams, thunkApi) => {
        try {
            const response = await AuthorService.fetchAuthorsList({locale, config})
            return adaptAuthorsArray(response.data.data)
        }catch (err){
            errorCatcher(err, thunkApi)
        }
    }
)

export const followAuthor = createAsyncThunk(
    'author/followAuthor',
    async ({locale, slug, config, ctx} : FetchParams, thunkApi) => {
        try {
            const response = await AuthorService.followAuthor({locale, slug, config, ctx})
            return response.data
        }catch (err){
            errorCatcher(err, thunkApi)
        }
    }
)

export const unfollowAuthor = createAsyncThunk(
    'author/followAuthor',
    async ({locale, slug, config, ctx} : FetchParams, thunkApi) => {
        try {
            const response = await AuthorService.unfollowAuthor({locale, slug, config, ctx})
            return response.data
        }catch (err){
            errorCatcher(err, thunkApi)
        }
    }
)

export const fetchFollowedAuthors = createAsyncThunk(
    'author/fetchFollowedAuthors',
    async ({locale, config, ctx} : FetchParams, thunkApi) => {
        try {
            const response = await AuthorService.fetchFollowedAuthors(locale, config, ctx)

            return  {
                results: adaptAuthorsArray(response.data.data),
                meta: response.data.meta
            }
        }catch (err){
            errorCatcher(err, thunkApi)
        }
    }
)