import { createSelector } from '@reduxjs/toolkit'
import { AppState } from "../store";

export const selectAuth = (state:AppState) => state.authReducer
export const selectErrors = (state:AppState) => state.authReducer.error
