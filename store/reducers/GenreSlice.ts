import {createSlice, PayloadAction} from "@reduxjs/toolkit";
import {ICategory} from "../../models/ICategory";
import {IMeta} from "../../models/IMeta";
import {IListResponse} from "../../models/Response/IListResponse";
import {HYDRATE} from "next-redux-wrapper";
import {IGenre} from "../../models/IGenre";
import {fetchGenres, fetchGenresList} from "../actions/genre";

interface GenreState {
    genres: {
        results: IGenre[];
        meta: IMeta | null;
    };
    genresList: IGenre[];
    loading: boolean;
    error: string;
}

const initialState: GenreState = {
    genres: {
        results: [],
        meta: null
    },
    genresList: [],
    loading: false,
    error: '',
}

export const genreSlice = createSlice({
    name: 'genre',
    initialState,
    reducers: {},
    extraReducers: {
        [fetchGenres.fulfilled.type]: (state, action: PayloadAction<IListResponse<IGenre[]>>) => {
            state.loading = false;
            state.error = '';
            state.genres = action.payload;
        },
        [fetchGenres.pending.type]: (state) => {
            state.loading = true;
        },
        [fetchGenres.rejected.type]: (state, action: PayloadAction<string>) => {
            state.loading = false;
            state.error =  action.payload;
        },

        [fetchGenresList.fulfilled.type]: (state, action: PayloadAction<IGenre[]>) => {
            state.loading = false;
            state.error = '';
            state.genresList = action.payload;
        },
        [fetchGenresList.pending.type]: (state) => {
            state.loading = true;
        },
        [fetchGenresList.rejected.type]: (state, action: PayloadAction<string>) => {
            state.loading = false;
            state.error =  action.payload;
        },

        [HYDRATE]: (state, action) => {
            return {
                ...state,
                ...action.payload.genresReducer,
            };
        },
    }
})

export default genreSlice.reducer;