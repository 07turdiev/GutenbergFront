import {createAsyncThunk} from "@reduxjs/toolkit";
import {AxiosRequestConfig} from "axios";
import AuthorService from "../../services/author";
import NovelService from "../../services/novels";
import {GetServerSidePropsContext} from "next";
import errorCatcher from "../../utils/errorCatcher";
import {FetchArgs} from "@reduxjs/toolkit/query";
import {FetchParams} from "../../models/Actions/Params";

export const fetchAuthors = createAsyncThunk(
    'author/fetchAuthors',
    async ({locale, config} : FetchParams, thunkApi) => {
        try {
            const response = await AuthorService.fetchAuthors({locale, config})
            return  {
                results: response.data.results,
                meta: response.data
            }
        }catch (err){
            errorCatcher(err, thunkApi)
        }
    }
)

export const fetchAuthorOne = createAsyncThunk(
    'author/fetchAuthorOne',
    async ({locale, slug, config, ctx} : FetchParams, thunkApi) => {
        try {
            const response = await AuthorService.fetchAuthorOne({locale, slug, config, ctx})
            return response.data
        }catch (err){
            errorCatcher(err, thunkApi)
        }
    }
)

export const fetchNovelsOfAuthor = createAsyncThunk(
    'author/fetchNovelsOfAuthor',
    async ({locale, slug, config, ctx} : FetchParams, thunkApi) => {
        try {
            const response = await NovelService.fetchNovelsOfAuthors(locale, slug, config, ctx)
            return response.data
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
            return  response.data
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
            return  response.data
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
            return  response.data
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
                results: response.data.results,
                meta: response.data
            }
        }catch (err){
            errorCatcher(err, thunkApi)
        }
    }
)