import {createAsyncThunk} from "@reduxjs/toolkit";
import AudioService from "../../services/audio";
import NovelService from "../../services/novels";
import errorCatcher from "../../utils/errorCatcher";

export const fetchAudioOne = createAsyncThunk(
    'audio/fetchAudioOne',
    async ({locale, slug}: {locale: string, slug: string}, thunkApi) => {
        try {
            const response = await AudioService.fetchAudioOne(locale, slug)
            return response.data;
        }catch (err){
            errorCatcher(err, thunkApi)
        }
    }
)

export const fetchNovelOfCurrentAudio = createAsyncThunk(
    'audio/fetchNovelOfCurrentAudio',
    async ({locale, slug}: {locale: string, slug: string}, thunkApi) => {
        try {
            const response = await NovelService.fetchNovelOne(locale, slug)
            return response.data
        }catch (err){
            errorCatcher(err, thunkApi)
        }
    }
)

export const addAudioToMark = createAsyncThunk(
    'audio/addAudioToMark',
    async ({locale, slug, data}: {locale: string, slug: string, data: {
            lang: string;
            second: number;
        }}, thunkApi) => {
        try {
            const response = await AudioService.addToMark(locale, slug, data)
            return response.data
        }catch (err){
            errorCatcher(err, thunkApi)
        }
    }
)

