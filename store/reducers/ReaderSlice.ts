import {createSlice, PayloadAction} from "@reduxjs/toolkit";
import {IMeta} from "../../models/IMeta";
import {IListResponse} from "../../models/Response/IListResponse";
import {HYDRATE} from "next-redux-wrapper";
import {IReader} from "../../models/IReader";
import {fetchNovelsOfReader, fetchReaderOne, fetchReaders} from "../actions/reader";
import {INovel} from "../../models/INovel";
import {fetchNovelsOfAuthor} from "../actions/author";

interface ReaderState {
    readers: {
        results: IReader[];
        meta: IMeta | null;
    };
    novels:{
        results: INovel[];
        meta: IMeta | null;
    };
    reader: IReader | null;
    loading: boolean;
    error: string;
}

const initialState: ReaderState = {
    readers: {
        results: [],
        meta: null
    },
    novels: {
        results: [],
        meta: null
    },
    reader: null,
    loading: false,
    error: '',
}

export const readerSlice = createSlice({
    name: 'reader',
    initialState,
    reducers: {},
    extraReducers: {
        [fetchReaders.fulfilled.type]: (state, action: PayloadAction<IListResponse<IReader[]>>) => {
            state.loading = false;
            state.error = '';
            state.readers.results = action.payload.results;
            state.readers.meta = action.payload.meta;
        },
        [fetchReaders.pending.type]: (state) => {
            state.loading = true;
        },
        [fetchReaders.rejected.type]: (state, action: PayloadAction<string>) => {
            state.loading = false;
            state.error =  action.payload;
        },

        [fetchReaderOne.fulfilled.type]: (state, action: PayloadAction<IReader>) => {
            state.loading = false;
            state.error = '';
            state.reader = action.payload
        },
        [fetchReaderOne.pending.type]: (state) => {
            state.loading = true;
        },
        [fetchReaderOne.rejected.type]: (state, action: PayloadAction<string>) => {
            state.loading = false;
            state.error =  action.payload;
        },

        [fetchNovelsOfReader.fulfilled.type]: (state, action: PayloadAction<IListResponse<INovel[]>>) => {
            state.loading = false;
            state.error = '';
            state.novels.results = action.payload.results;
            state.novels.meta = action.payload.meta;
        },
        [fetchNovelsOfReader.pending.type]: (state) => {
            state.loading = true;
        },
        [fetchNovelsOfReader.rejected.type]: (state, action: PayloadAction<string>) => {
            state.loading = false;
            state.error =  action.payload;

        },

        [HYDRATE]: (state, action) => {
            return {
                ...state,
                ...action.payload.readerReducer,
            };
        },
    }
})

export default readerSlice.reducer;