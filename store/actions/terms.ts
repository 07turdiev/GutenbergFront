import {createAsyncThunk} from "@reduxjs/toolkit";
import TermsService from "../../services/terms";
import {FetchParams} from "../../models/Actions/Params";
import {adaptTermsData} from "../../utils/strapiAdapter";

export const fetchTerms = createAsyncThunk(
    'terms/fetchTerms',
    async ({locale, config, ctx} : FetchParams, thunkApi) => {
        try {
            const response = await TermsService.fetchTerms({locale, config, ctx})
            return adaptTermsData(response.data)

        }catch (err){
            console.error('fetchTerms error:', err);
            return thunkApi.rejectWithValue('Error fetching terms data')
        }
    }
)
