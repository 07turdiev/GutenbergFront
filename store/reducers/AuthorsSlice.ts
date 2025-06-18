import {createSlice, PayloadAction} from "@reduxjs/toolkit";
import {IMeta} from "../../models/IMeta";
import {IListResponse} from "../../models/Response/IListResponse";
import {IAuthor} from "../../models/IAuthors";
import {
    fetchAuthorOne,
    fetchAuthors,
    fetchAuthorsList,
    fetchFollowedAuthors,
    fetchNovelsOfAuthor,
    followAuthor
} from "../actions/author";
import {HYDRATE} from "next-redux-wrapper";
import {INovel} from "../../models/INovel";

interface AuthorsState {
    authors: {
        results: IAuthor[];
        meta: IMeta | null;
    };
    followedAuthors: {
        results: IAuthor[];
        meta: IMeta | null;
    };
    author: IAuthor | null;
    authorsList: IAuthor[];
    novels:{
        results: INovel[];
        meta: IMeta | null;
    };
    loading: boolean;
    error: string;
}

const initialState: AuthorsState = {
    authors: {
        results: [],
        meta: null
    },
    followedAuthors: {
        results: [],
        meta: null
    },
    author: null,
    authorsList: [],
    novels: {
        results: [],
        meta: null
    },
    loading: false,
    error: '',
}

export const authorSlice = createSlice({
    name: 'category',
    initialState,
    reducers: {},
    extraReducers: {
        [fetchAuthors.fulfilled.type]: (state, action: PayloadAction<{results: IAuthor[], meta: any}>) => {
            state.loading = false;
            state.error = '';
            if (action.payload && action.payload.results) {
                state.authors.results = action.payload.results;
                state.authors.meta = action.payload.meta;
            }
        },
        [fetchAuthors.pending.type]: (state) => {
            state.loading = true;
        },
        [fetchAuthors.rejected.type]: (state, action: PayloadAction<string>) => {
            state.loading = false;
            state.error =  action.payload;
        },

        [fetchAuthorOne.fulfilled.type]: (state, action: PayloadAction<IAuthor>) => {
            state.loading = false;
            state.error = '';
            state.author = action.payload;
        },
        [fetchAuthorOne.pending.type]: (state) => {
            state.loading = true;
        },
        [fetchAuthorOne.rejected.type]: (state, action: PayloadAction<string>) => {
            state.loading = false;
            state.error =  action.payload;
        },

        [fetchNovelsOfAuthor.fulfilled.type]: (state, action: PayloadAction<{results: INovel[], meta: any}>) => {
            state.loading = false;
            state.error = '';
            if (action.payload && action.payload.results) {
                state.novels.results = action.payload.results;
                state.novels.meta = action.payload.meta;
            }
        },
        [fetchNovelsOfAuthor.pending.type]: (state) => {
            state.loading = true;
        },
        [fetchNovelsOfAuthor.rejected.type]: (state, action: PayloadAction<string>) => {
            state.loading = false;
            state.error =  action.payload;
        },

        [fetchAuthorsList.fulfilled.type]: (state, action: PayloadAction<IAuthor[]>) => {
            state.loading = false;
            state.error = '';
            if (action.payload && Array.isArray(action.payload)) {
                state.authorsList = action.payload;
            }
        },
        [fetchAuthorsList.pending.type]: (state) => {
            state.loading = true;
        },
        [fetchAuthorsList.rejected.type]: (state, action: PayloadAction<string>) => {
            state.loading = false;
            state.error =  action.payload;
        },

        [followAuthor.fulfilled.type]: (state, action: PayloadAction<IAuthor[]>) => {
            state.loading = false;
            state.error = '';
        },
        [followAuthor.pending.type]: (state) => {
            state.loading = true;
        },
        [followAuthor.rejected.type]: (state, action: PayloadAction<string>) => {
            state.loading = false;
            state.error =  action.payload;
        },

        [fetchFollowedAuthors.fulfilled.type]: (state, action: PayloadAction<{results: IAuthor[], meta: any}>) => {
            state.loading = false;
            if (action.payload && action.payload.results) {
                state.followedAuthors.results = action.payload.results;
                state.followedAuthors.meta = action.payload.meta;
            }
            state.error = '';
        },
        [fetchFollowedAuthors.pending.type]: (state) => {
            state.loading = true;
        },
        [fetchFollowedAuthors.rejected.type]: (state, action: PayloadAction<string>) => {
            state.loading = false;
            state.error =  action.payload;
        },

        [HYDRATE]: (state, action) => {
            return {
                ...state,
                ...action.payload.authorsReducer,
            };
        },
    }
})

export default authorSlice.reducer;
