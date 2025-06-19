import { createAsyncThunk } from "@reduxjs/toolkit";
import TeamService from "../../services/team";
import { FetchParams } from "../../models/Actions/Params";
import { adaptTeamMembersArray } from "../../utils/strapiAdapter";

export const fetchTeamMembers = createAsyncThunk(
    'team/fetchTeamMembers',
    async ({locale, config, ctx}: FetchParams, thunkApi) => {
        try {
            const response = await TeamService.fetchTeamMembers({locale, config, ctx});
            return {
                results: adaptTeamMembersArray(response.data.data),
                meta: response.data.meta
            };
        } catch (err) {
            console.error('fetchTeamMembers error:', err);
            return thunkApi.rejectWithValue('Error fetching team members');
        }
    }
); 