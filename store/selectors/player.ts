import { createSelector } from '@reduxjs/toolkit'
import { AppState } from "../store";

export const selectTrack = (state:AppState) => state.playerReducer