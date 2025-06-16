import {AppState} from "../store";

export const selectOrder = (state:AppState) => state.orderReducer;