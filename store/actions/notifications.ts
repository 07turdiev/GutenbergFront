import {createAsyncThunk} from "@reduxjs/toolkit";
import {FetchParams} from "../../models/Actions/Params";
import NotificationsService from "../../services/notifications";

export const fetchNotifications = createAsyncThunk(
    'notifications/fetchNotifications',
    async ({locale, config, ctx} : FetchParams, thunkApi) => {
        try {
            const response = await NotificationsService.fetchNotifications({locale, config, ctx})
            return response.data;
        }catch (err){
            return thunkApi.rejectWithValue('Ошибка при получение заказов')
        }
    }
)

export const clearNotification = createAsyncThunk(
    'notifications/clearNotification',
    async ({locale, config, ctx, value} : FetchParams, thunkApi) => {
        try {
            const response = await NotificationsService.clearNotification({locale, config, ctx, value})
            return response.data;

        }catch (err){
            return thunkApi.rejectWithValue('Ошибка при получение заказов')
        }
    }
)