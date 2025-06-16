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
import genresReducer from "./reducers/GenreSlice";
import audioReducer from "./reducers/AudioSlice";
import readerReducer from "./reducers/ReaderSlice";
import advertisingReducer from "./reducers/AdvertisingSlice";
import orderReducer from "./reducers/OrderSlice";
import aboutReducer from "./reducers/AboutSlice";
import notificationsReducer from "./reducers/NotificationsSlive";

const reducers = combineReducers(
    {
        categoryReducer,
        authReducer,
        novelReducer,
        playerReducer,
        authorsReducer,
        genresReducer,
        audioReducer,
        readerReducer,
        orderReducer,
        advertisingReducer,
        aboutReducer,
        notificationsReducer
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
