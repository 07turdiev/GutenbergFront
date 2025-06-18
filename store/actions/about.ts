import {createAsyncThunk} from "@reduxjs/toolkit";
import AboutService from "../../services/about";
import {FetchParams} from "../../models/Actions/Params";
import {adaptAboutData, adaptContactsData, adaptSocialData, adaptStatisticsData} from "../../utils/strapiAdapter";

export const fetchAbout = createAsyncThunk(
    'about/fetchAbout',
    async ({locale, config, ctx} : FetchParams, thunkApi) => {
        try {
            const response = await AboutService.fetchAbout({locale, config, ctx})
            return adaptAboutData(response.data)

        }catch (err){
            console.error('fetchAbout error:', err);
            return thunkApi.rejectWithValue('Error fetching about data')
        }
    }
)

export const fetchSocialLinks = createAsyncThunk(
    'about/fetchSocialLinks',
    async ({locale, config, ctx} : FetchParams, thunkApi) => {
        try {
            const response = await AboutService.fetchSocialLinks({locale, config, ctx})
            return adaptSocialData(response.data)

        }catch (err){
            console.error('fetchSocialLinks error:', err);
            return thunkApi.rejectWithValue('Error fetching social links')
        }
    }
)

export const fetchContacts= createAsyncThunk(
    'about/fetchContacts',
    async ({locale, config, ctx} : FetchParams, thunkApi) => {
        try {
            const response = await AboutService.fetchContacts({locale, config, ctx})
            return adaptContactsData(response.data)

        }catch (err){
            console.error('fetchContacts error:', err);
            return thunkApi.rejectWithValue('Error fetching contacts')
        }
    }
)

export const fetchStatistics= createAsyncThunk(
    'about/fetchStatistics',
    async ({locale, config, ctx} : FetchParams, thunkApi) => {
        try {
            const response = await AboutService.fetchStatistics({locale, config, ctx})
            return adaptStatisticsData(response.data)

        }catch (err){
            console.error('fetchStatistics error:', err);
            return thunkApi.rejectWithValue('Error fetching statistics')
        }
    }
)