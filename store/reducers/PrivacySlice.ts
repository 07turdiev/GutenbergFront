import {createSlice, PayloadAction} from "@reduxjs/toolkit";
import {HYDRATE} from "next-redux-wrapper";
import {IPrivacyData} from "../../models/IPrivacy";
import {fetchPrivacy} from "../actions/privacy";

interface PrivacyState {
    data: IPrivacyData | null;
    loading: boolean;
    error: string;
}

const initialState: PrivacyState = {
    data: null,
    loading: false,
    error: ''
}

export const privacySlice = createSlice({
    name: 'privacy',
    initialState,
    reducers: {},
    extraReducers: {
        [fetchPrivacy.fulfilled.type]: (state, action: PayloadAction<IPrivacyData>) => {
            state.loading = false;
            state.error = '';
            state.data = action.payload
        },
        [fetchPrivacy.pending.type]: (state) => {
            state.loading = true;
        },
        [fetchPrivacy.rejected.type]: (state, action: PayloadAction<string>) => {
            state.loading = false;
            state.error = action.payload;
        },

        [HYDRATE]: (state, action) => {
            return {
                ...state,
                ...action.payload.privacyReducer,
            };
        },
    }
})

export default privacySlice.reducer;
