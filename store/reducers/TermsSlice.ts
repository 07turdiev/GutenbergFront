import {createSlice, PayloadAction} from "@reduxjs/toolkit";
import {HYDRATE} from "next-redux-wrapper";
import {ITermsData} from "../../models/ITerms";
import {fetchTerms} from "../actions/terms";

interface TermsState {
    data: ITermsData | null;
    loading: boolean;
    error: string;
}

const initialState: TermsState = {
    data: null,
    loading: false,
    error: ''
}

export const termsSlice = createSlice({
    name: 'terms',
    initialState,
    reducers: {},
    extraReducers: {
        [fetchTerms.fulfilled.type]: (state, action: PayloadAction<ITermsData>) => {
            state.loading = false;
            state.error = '';
            state.data = action.payload
        },
        [fetchTerms.pending.type]: (state) => {
            state.loading = true;
        },
        [fetchTerms.rejected.type]: (state, action: PayloadAction<string>) => {
            state.loading = false;
            state.error = action.payload;
        },

        [HYDRATE]: (state, action) => {
            return {
                ...state,
                ...action.payload.termsReducer,
            };
        },
    }
})

export default termsSlice.reducer;
