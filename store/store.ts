import {
    Action,
    combineReducers,
    configureStore,
    ThunkAction,
} from '@reduxjs/toolkit';
import { createWrapper } from 'next-redux-wrapper';
import authReducer from "./reducers/AuthSlice";
import novelReducer from "./reducers/NovelSlice";
import categoryReducer from "./reducers/CategorySlice";
import playerReducer from "./reducers/PlayerSlice";
import authorsReducer from "./reducers/AuthorsSlice";
import audioReducer from "./reducers/AudioSlice";
import readerReducer from "./reducers/ReaderSlice";
import advertisingReducer from "./reducers/AdvertisingSlice";
import orderReducer from "./reducers/OrderSlice";
import aboutReducer from "./reducers/AboutSlice";
import notificationsReducer from "./reducers/NotificationsSlive";
import teamReducer from "./reducers/TeamSlice";
import blogReducer from "./reducers/BlogSlice";

const reducers = combineReducers(
    {
        categoryReducer,
        authReducer,
        novelReducer,
        playerReducer,
        authorsReducer,
        audioReducer,
        readerReducer,
        orderReducer,
        advertisingReducer,
        aboutReducer,
        notificationsReducer,
        teamReducer,
        blogReducer
    }
)

export const makeStore = () =>
    configureStore({
        reducer: reducers,
        devTools: true,
    });

export type AppStore = ReturnType<typeof makeStore>;
export type AppState = ReturnType<AppStore['getState']>;
export type AppThunk<ReturnType = void> = ThunkAction<ReturnType, AppState, unknown, Action>;

export const wrapper = createWrapper<AppStore>(makeStore);
