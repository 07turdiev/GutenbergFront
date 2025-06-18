import {createSlice, PayloadAction} from "@reduxjs/toolkit";
import {HYDRATE} from "next-redux-wrapper";
import {IAudio, ITrack} from "../../models/IAudio";
import {addAudioToMark, fetchAudioOne, fetchNovelOfCurrentAudio} from "../actions/audio";
import {INovel} from "../../models/INovel";

interface AudioState {
    audio: ITrack | null;
    currentNovel: INovel | null;
    loading: boolean;
    error: string;
}

const initialState: AudioState = {
    audio: null,
    currentNovel: null,
    loading: false,
    error: '',
}

export const audioSlice = createSlice({
    name: 'audio',
    initialState,
    reducers: {
        setAudioTrack: (state, action: PayloadAction<ITrack>) => {
            state.audio = action.payload;
            state.loading = false;
            state.error = '';
        }
    },
    extraReducers: {
        [fetchAudioOne.fulfilled.type]: (state, action: PayloadAction<ITrack>) => {
            state.loading = false;
            state.error = '';
            state.audio = action.payload;
        },
        [fetchAudioOne.pending.type]: (state) => {
            state.loading = true;
        },
        [fetchAudioOne.rejected.type]: (state, action: PayloadAction<string>) => {
            state.loading = false;
            state.error =  action.payload;
        },

        [fetchNovelOfCurrentAudio.fulfilled.type]: (state, action: PayloadAction<INovel>) => {
            state.error = '';
            state.currentNovel = action.payload;
        },
        [fetchNovelOfCurrentAudio.rejected.type]: (state, action: PayloadAction<string>) => {
            state.error =  action.payload;
        },

        [addAudioToMark.fulfilled.type]: (state, action: PayloadAction<INovel>) => {
            state.error = '';
            state.loading = false;
        },
        [addAudioToMark.pending.type]: (state) => {
            state.loading = true;
        },
        [addAudioToMark.rejected.type]: (state, action: PayloadAction<string>) => {
            state.loading = false;
            state.error =  action.payload;
        },
        //
        // [HYDRATE]: (state, action) => {
        //
        //     return {
        //         ...state,
        //         ...action.payload.authorsReducer,
        //     };
        // },
    }
})

export const { setAudioTrack } = audioSlice.actions;
export default audioSlice.reducer;