
import {createSlice, PayloadAction} from "@reduxjs/toolkit";
import {SetActiveTrack} from "../../models/Actions/SetActiveTrack";
import {setPlayerLoading, setPlayerNovel, setTrackSpeed} from "../actions/player";
import {INovel} from "../../models/INovel";

interface PlayerState {
    active_slug: string | null;
    active_lang: string;
    duration: number;
    currentTime: number;
    volume: number;
    error: string;
    pause: boolean;
    playImmediately: boolean;
    loading: boolean;
    isSaved: boolean;
    playerNovel: INovel | null;
    trackSpeed: number;
    playerLoading: boolean;
}

const initialState: PlayerState = {
    active_slug: null,
    active_lang: '',
    duration: 0,
    currentTime: 0,
    volume: 100,
    pause: true,
    error: '',
    playImmediately: false,
    loading: false,
    isSaved: false,
    playerNovel: null,
    trackSpeed: 1,
    playerLoading: false,
}

export const playerSlice = createSlice({
    name: 'player',
    initialState,
    reducers: {

        playTrack(state) {
            state.pause = false;
        },
        pauseTrack(state) {
            state.pause = true;
        },
        setActiveTrack(state, action: PayloadAction<SetActiveTrack>) {
            state.active_slug = action.payload.active_slug;
            state.active_lang = action.payload.lang;
            state.playImmediately = action.payload.playImmediately;
        },
        setDuration(state, action: PayloadAction<number>) {
            state.duration = action.payload;
        },

        setCurrentTime(state, action: PayloadAction<number>) {
            state.currentTime = action.payload;
        },
        setCurrentVolume(state, action: PayloadAction<number>) {
            state.volume = action.payload;
        },

        setPlayerLoading(state, action: PayloadAction<boolean>) {
            state.playerLoading = action.payload;
        },

        setLoading(state, action: PayloadAction<boolean>) {
            state.loading = action.payload
        },
        setPlayerNovel(state, action: PayloadAction<INovel>) {
            state.playerNovel = action.payload
        },
        setTrackSpeed(state, action: PayloadAction<number>) {
            state.trackSpeed = action.payload
        },
    },
    extraReducers: {
        [setPlayerNovel.fulfilled.type]: (state, action: PayloadAction<INovel>) => {
            state.error = '';
            state.playerNovel = action.payload;

        },
    }
})

export default playerSlice.reducer;
