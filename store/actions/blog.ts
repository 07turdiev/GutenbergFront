import {createAsyncThunk} from "@reduxjs/toolkit";
import BlogService from "../../services/blog";
import {FetchParams} from "../../models/Actions/Params";
import {IListResponse} from "../../models/Response/IListResponse";
import {IBlogPost} from "../../models/IBlog";

export const fetchBlogPosts = createAsyncThunk(
    'blog/fetchBlogPosts',
    async ({locale, config, ctx, page = 1, pageSize = 9}: FetchParams & {page?: number, pageSize?: number}, thunkApi) => {
        try {
            const response = await BlogService.fetchBlogPosts({locale, config, ctx, page, pageSize})
            return response.data as IListResponse<IBlogPost[]>
        } catch (err) {
            console.error('fetchBlogPosts error:', err);
            return thunkApi.rejectWithValue('Error fetching blog posts')
        }
    }
)

export const fetchBlogPostBySlug = createAsyncThunk(
    'blog/fetchBlogPostBySlug',
    async ({locale, slug, config, ctx}: FetchParams & {slug: string}, thunkApi) => {
        try {
            const response = await BlogService.fetchBlogPostBySlug({locale, slug, config, ctx})
            return response.data as IListResponse<IBlogPost[]>
        } catch (err) {
            console.error('fetchBlogPostBySlug error:', err);
            return thunkApi.rejectWithValue('Error fetching blog post')
        }
    }
)

export const fetchPopularBlogPosts = createAsyncThunk(
    'blog/fetchPopularBlogPosts',
    async ({locale, config, ctx, limit = 4}: FetchParams & {limit?: number}, thunkApi) => {
        try {
            const response = await BlogService.fetchPopularBlogPosts({locale, config, ctx, limit})
            return response.data as IListResponse<IBlogPost[]>
        } catch (err) {
            console.error('fetchPopularBlogPosts error:', err);
            return thunkApi.rejectWithValue('Error fetching popular blog posts')
        }
    }
)

export const fetchLatestBlogPosts = createAsyncThunk(
    'blog/fetchLatestBlogPosts',
    async ({locale, config, ctx, limit = 4}: FetchParams & {limit?: number}, thunkApi) => {
        try {
            const response = await BlogService.fetchLatestBlogPosts({locale, config, ctx, limit})
            return response.data as IListResponse<IBlogPost[]>
        } catch (err) {
            console.error('fetchLatestBlogPosts error:', err);
            return thunkApi.rejectWithValue('Error fetching latest blog posts')
        }
    }
) 