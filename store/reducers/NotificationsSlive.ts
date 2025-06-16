import {createSlice, PayloadAction} from "@reduxjs/toolkit";
import {HYDRATE} from "next-redux-wrapper";
import {INotification} from "../../models/INotification";
import {clearNotification, fetchNotifications} from "../actions/notifications";

interface NotificationsState {
    notifications: INotification[];
    loading: boolean;
    count: number;
    error: string;
}

const initialState: NotificationsState = {
    notifications: [],
    loading: false,
    count: 0,
    error: '',
}

export const notificationsSlice = createSlice({
    name: 'notifications',
    initialState,
    reducers: {},
    extraReducers: {

        [fetchNotifications.fulfilled.type]: (state, action: PayloadAction<INotification[]>) => {
            state.loading = false;
            state.error = '';
            state.notifications = action.payload;
            state.count = action.payload ? action.payload.length : 0
        },
        [fetchNotifications.pending.type]: (state) => {
            state.loading = true;
        },
        [fetchNotifications.rejected.type]: (state, action: PayloadAction<string>) => {
            state.loading = false;
            state.error =  action.payload;
        },

        [clearNotification.fulfilled.type]: (state, action: PayloadAction<INotification[]>) => {
            state.loading = false;
            state.error = '';
        },
        [clearNotification.pending.type]: (state) => {
            state.loading = true;
        },
        [clearNotification.rejected.type]: (state, action: PayloadAction<string>) => {
            state.loading = false;
            state.error =  action.payload;
        },



        [HYDRATE]: (state, action) => {
            return {
                ...state,
                ...action.payload.notificationsReducer,
            };
        },
    }
})

export default notificationsSlice.reducer;