import {createAsyncThunk} from "@reduxjs/toolkit";
import PrivacyService from "../../services/privacy";
import {FetchParams} from "../../models/Actions/Params";
import {adaptPrivacyData} from "../../utils/strapiAdapter";

export const fetchPrivacy = createAsyncThunk(
    'privacy/fetchPrivacy',
    async ({locale, config, ctx} : FetchParams, thunkApi) => {
        try {
            const response = await PrivacyService.fetchPrivacy({locale, config, ctx})
            return adaptPrivacyData(response.data)

        }catch (err){
            console.error('fetchPrivacy error:', err);
            return thunkApi.rejectWithValue('Error fetching privacy data')
        }
    }
)
