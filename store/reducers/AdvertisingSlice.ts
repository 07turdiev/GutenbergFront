import {createSlice, PayloadAction} from "@reduxjs/toolkit";
import {HYDRATE} from "next-redux-wrapper";
import {IAdvertising} from "../../models/IAdvertising";
import {
    fetchAdvertisingMainBottom,
    fetchAdvertisingMainTop,
    fetchAdvertisingRight,
    fetchAdvertisingSection
} from "../actions/advertising";

interface AdvertisingState {
    mainTop: IAdvertising | null;
    mainBottom: IAdvertising | null;
    right: IAdvertising | null;
    middle: IAdvertising | null;
    loading: boolean;
    error: string;
}

const initialState: AdvertisingState = {
    mainTop: null,
    mainBottom: null,
    right: null,
    middle: null,
    loading: false,
    error: '',
}

export const advertisingSlice = createSlice({
    name: 'advertising',
    initialState,
    reducers: {},
    extraReducers: {
        [fetchAdvertisingRight.fulfilled.type]: (state, action: PayloadAction<IAdvertising>) => {
            state.loading = false;
            state.error = '';
            state.right = action.payload;
        },
        [fetchAdvertisingRight.pending.type]: (state) => {
            state.loading = true;
        },
        [fetchAdvertisingRight.rejected.type]: (state, action: PayloadAction<string>) => {
            state.loading = false;
            state.error =  action.payload;
        },

        [fetchAdvertisingMainTop.fulfilled.type]: (state, action: PayloadAction<IAdvertising>) => {
            state.loading = false;
            state.error = '';
            state.mainTop = action.payload;
        },
        [fetchAdvertisingMainTop.pending.type]: (state) => {
            state.loading = true;
        },
        [fetchAdvertisingMainTop.rejected.type]: (state, action: PayloadAction<string>) => {
            state.loading = false;
            state.error =  action.payload;
        },

        [fetchAdvertisingMainBottom.fulfilled.type]: (state, action: PayloadAction<IAdvertising>) => {
            state.loading = false;
            state.error = '';
            state.mainBottom = action.payload;
        },
        [fetchAdvertisingMainBottom.pending.type]: (state) => {
            state.loading = true;
        },
        [fetchAdvertisingMainBottom.rejected.type]: (state, action: PayloadAction<string>) => {
            state.loading = false;
            state.error =  action.payload;
        },

        [fetchAdvertisingSection.fulfilled.type]: (state, action: PayloadAction<IAdvertising>) => {
            state.loading = false;
            state.error = '';
            state.middle = action.payload;
        },
        [fetchAdvertisingSection.pending.type]: (state) => {
            state.loading = true;
        },
        [fetchAdvertisingSection.rejected.type]: (state, action: PayloadAction<string>) => {
            state.loading = false;
            state.error =  action.payload;
        },


        [HYDRATE]: (state, action) => {
            return {
                ...state,
                ...action.payload.advertisingReducer,
            };
        },
    }
})

export default advertisingSlice.reducer;
