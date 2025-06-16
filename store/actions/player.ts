import {createAction, createAsyncThunk} from "@reduxjs/toolkit";
import {SetActiveTrack} from "../../models/Actions/SetActiveTrack";
import {AxiosRequestConfig} from "axios";
import {GetServerSidePropsContext} from "next";
import NovelService from "../../services/novels";

export const setActiveTrack = createAction<SetActiveTrack>('player/setActiveTrack')
export const playTrack = createAction('player/playTrack')
export const pauseTrack = createAction('player/pauseTrack')

export const setDuration = createAction<number>('player/setDuration')
export const setCurrentTime = createAction<number>('player/setCurrentTime')
export const setCurrentVolume = createAction<number>('player/setCurrentVolume')
export const setIsSaved = createAction<boolean>('player/setIsSaved')
export const setPlayerLoading = createAction<boolean>('player/setPlayerLoading')
export const setTrackSpeed = createAction<number>('player/setTrackSpeed')



export const setPlayerNovel= createAsyncThunk(
    'player/setPlayerNovel',
    async (config: {
        locale: string,
        slug: string,
        opt?: AxiosRequestConfig,
        ctx?: GetServerSidePropsContext
    }, thunkApi) => {
        try {
            const response = await NovelService.fetchNovelOne(config.locale, config.slug, config.opt, config.ctx)
            return response.data
        }catch (err){
            return thunkApi.rejectWithValue('Ошибка при получение новелы')
        }
    }
)