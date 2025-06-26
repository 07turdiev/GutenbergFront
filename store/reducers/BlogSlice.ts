import {createSlice, PayloadAction} from "@reduxjs/toolkit";
import {HYDRATE} from "next-redux-wrapper";
import {IBlogPost} from "../../models/IBlog";
import {fetchBlogPosts, fetchBlogPostBySlug, fetchPopularBlogPosts, fetchLatestBlogPosts} from "../actions/blog";
import {IListResponse} from "../../models/Response/IListResponse";

interface BlogState {
    posts: IBlogPost[];
    currentPost: IBlogPost | null;
    popularPosts: IBlogPost[];
    latestPosts: IBlogPost[];
    totalPages: number;
    currentPage: number;
    totalCount: number;
    loading: boolean;
    error: string;
}

const initialState: BlogState = {
    posts: [],
    currentPost: null,
    popularPosts: [],
    latestPosts: [],
    totalPages: 0,
    currentPage: 1,
    totalCount: 0,
    loading: false,
    error: ''
}

export const blogSlice = createSlice({
    name: 'blog',
    initialState,
    reducers: {
        setCurrentPage: (state, action: PayloadAction<number>) => {
            state.currentPage = action.payload;
        },
        clearCurrentPost: (state) => {
            state.currentPost = null;
        }
    },
    extraReducers: {
        // Fetch all blog posts
        [fetchBlogPosts.fulfilled.type]: (state, action: PayloadAction<IListResponse<IBlogPost[]>>) => {
            state.loading = false;
            state.error = '';
            state.posts = action.payload.data;
            state.totalPages = action.payload.meta.pagination.pageCount;
            state.totalCount = action.payload.meta.pagination.total;
            state.currentPage = action.payload.meta.pagination.page;
        },
        [fetchBlogPosts.pending.type]: (state) => {
            state.loading = true;
        },
        [fetchBlogPosts.rejected.type]: (state, action: PayloadAction<string>) => {
            state.loading = false;
            state.error = action.payload;
        },

        // Fetch blog post by slug
        [fetchBlogPostBySlug.fulfilled.type]: (state, action: PayloadAction<IListResponse<IBlogPost[]>>) => {
            state.loading = false;
            state.error = '';
            state.currentPost = action.payload.data[0] || null;
        },
        [fetchBlogPostBySlug.pending.type]: (state) => {
            state.loading = true;
        },
        [fetchBlogPostBySlug.rejected.type]: (state, action: PayloadAction<string>) => {
            state.loading = false;
            state.error = action.payload;
        },

        // Fetch popular blog posts
        [fetchPopularBlogPosts.fulfilled.type]: (state, action: PayloadAction<IListResponse<IBlogPost[]>>) => {
            state.loading = false;
            state.error = '';
            state.popularPosts = action.payload.data;
        },
        [fetchPopularBlogPosts.pending.type]: (state) => {
            state.loading = true;
        },
        [fetchPopularBlogPosts.rejected.type]: (state, action: PayloadAction<string>) => {
            state.loading = false;
            state.error = action.payload;
        },

        // Fetch latest blog posts
        [fetchLatestBlogPosts.fulfilled.type]: (state, action: PayloadAction<IListResponse<IBlogPost[]>>) => {
            state.loading = false;
            state.error = '';
            state.latestPosts = action.payload.data;
        },
        [fetchLatestBlogPosts.pending.type]: (state) => {
            state.loading = true;
        },
        [fetchLatestBlogPosts.rejected.type]: (state, action: PayloadAction<string>) => {
            state.loading = false;
            state.error = action.payload;
        },

        [HYDRATE]: (state, action) => {
            return {
                ...state,
                ...action.payload.blogReducer,
            };
        },
    }
})

export const { setCurrentPage, clearCurrentPost } = blogSlice.actions;
export default blogSlice.reducer; 