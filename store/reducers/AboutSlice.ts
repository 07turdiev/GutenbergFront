import {createSlice, PayloadAction} from "@reduxjs/toolkit";
import {HYDRATE} from "next-redux-wrapper";
import {IAbout, IContacts, ISocial, IStatistics} from "../../models/IAbout";
import {fetchAbout, fetchContacts, fetchSocialLinks, fetchStatistics} from "../actions/about";

interface AboutState {
    description: IAbout | null;
    socialLinks: ISocial | null;
    contacts: IContacts | null;
    statistics: IStatistics | null;
    loading: boolean;
    error: string;
}

const initialState: AboutState = {
    description: null,
    socialLinks: null,
    contacts: null,
    loading: false,
    error: '',
    statistics: null
}

export const aboutSlice = createSlice({
    name: 'about',
    initialState,
    reducers: {},
    extraReducers: {

        [fetchAbout.fulfilled.type]: (state, action: PayloadAction<IAbout>) => {
            state.loading = false;
            state.error = '';
            state.description = action.payload
        },
        [fetchAbout.pending.type]: (state) => {
            state.loading = true;
        },
        [fetchAbout.rejected.type]: (state, action: PayloadAction<string>) => {
            state.loading = false;
            state.error =  action.payload;
        },

        [fetchSocialLinks.fulfilled.type]: (state, action: PayloadAction<ISocial>) => {
            state.loading = false;
            state.error = '';
            state.socialLinks = action.payload
        },
        [fetchSocialLinks.pending.type]: (state) => {
            state.loading = true;
        },
        [fetchSocialLinks.rejected.type]: (state, action: PayloadAction<string>) => {
            state.loading = false;
            state.error =  action.payload;
        },

        [fetchContacts.fulfilled.type]: (state, action: PayloadAction<IContacts>) => {
            state.loading = false;
            state.error = '';
            state.contacts = action.payload
        },
        [fetchContacts.pending.type]: (state) => {
            state.loading = true;
        },
        [fetchContacts.rejected.type]: (state, action: PayloadAction<string>) => {
            state.loading = false;
            state.error =  action.payload;
        },

        [fetchStatistics.fulfilled.type]: (state, action: PayloadAction<IStatistics>) => {
            state.loading = false;
            state.error = '';
            state.statistics = action.payload
        },
        [fetchStatistics.pending.type]: (state) => {
            state.loading = true;
        },
        [fetchStatistics.rejected.type]: (state, action: PayloadAction<string>) => {
            state.loading = false;
            state.error =  action.payload;
        },


        [HYDRATE]: (state, action) => {
            return {
                ...state,
                ...action.payload.aboutReducer,
            };
        },
    }
})

export default aboutSlice.reducer;