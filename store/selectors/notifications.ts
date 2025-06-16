import {AppState} from "../store";

export const selectNotifications = (state:AppState) => state.notificationsReducer;