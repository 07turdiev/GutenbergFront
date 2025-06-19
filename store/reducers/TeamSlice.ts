import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { IMeta } from "../../models/IMeta";
import { ITeamMember } from "../../models/ITeam";
import { fetchTeamMembers } from "../actions/team";
import { HYDRATE } from "next-redux-wrapper";

interface TeamState {
    teamMembers: {
        results: ITeamMember[];
        meta: IMeta | null;
    };
    loading: boolean;
    error: string;
}

const initialState: TeamState = {
    teamMembers: {
        results: [],
        meta: null
    },
    loading: false,
    error: '',
}

export const teamSlice = createSlice({
    name: 'team',
    initialState,
    reducers: {},
    extraReducers: {
        [fetchTeamMembers.fulfilled.type]: (state, action: PayloadAction<{results: ITeamMember[], meta: any}>) => {
            state.loading = false;
            state.error = '';
            if (action.payload && action.payload.results) {
                state.teamMembers.results = action.payload.results;
                state.teamMembers.meta = action.payload.meta;
            }
        },
        [fetchTeamMembers.pending.type]: (state) => {
            state.loading = true;
        },
        [fetchTeamMembers.rejected.type]: (state, action: PayloadAction<string>) => {
            state.loading = false;
            state.error = action.payload;
        },

        [HYDRATE]: (state, action) => {
            return {
                ...state,
                ...action.payload.teamReducer,
            };
        },
    }
})

export default teamSlice.reducer; 