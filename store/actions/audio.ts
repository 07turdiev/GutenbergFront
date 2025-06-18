import {createAsyncThunk} from "@reduxjs/toolkit";
import AudioService from "../../services/audio";
import NovelService from "../../services/novels";
import errorCatcher from "../../utils/errorCatcher";

export const fetchAudioOne = createAsyncThunk(
    'audio/fetchAudioOne',
    async ({locale, slug}: {locale: string, slug: string}, thunkApi) => {
        try {
            // In the new API structure, we don't have individual audio endpoints
            // Instead, we'll get the novel data and extract audio information
            const state = thunkApi.getState() as any;
            const novel = state.novelReducer.novel;
            
            if (!novel || !novel.audio_list || novel.audio_list.length === 0) {
                return thunkApi.rejectWithValue('No audio available for this novel');
            }
            
            // Create track data from novel information
            const audioFile = novel.audio_list[0]; // Using first audio file
            const track = {
                name: audioFile.name || novel.name,
                file: audioFile.file,
                novel: {
                    author: novel.author ? [novel.author] : [],
                    cover: novel.cover || { src: '' },
                    name: novel.name,
                    slug: novel.slug
                },
                next: null, // No playlist support in new structure
                prev: null
            };
            
            return track;
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

