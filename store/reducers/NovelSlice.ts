import {INovel} from "../../models/INovel";
import {createSlice, PayloadAction} from "@reduxjs/toolkit";
import {
    deleteFromSavedNovel,
    fetchAudiosOfNovel, fetchFollowedNovels,
    fetchNovelActual,
    fetchNovelOne,
    fetchNovelByDocumentId,
    fetchNovels, fetchPlayerNovel,
    fetchSavedNovels, saveNovel,
} from "../actions/novel";
import {IMeta} from "../../models/IMeta";
import {IListResponse, ILegacyListResponse} from "../../models/Response/IListResponse";
import {HYDRATE} from "next-redux-wrapper";
import {IAudio} from "../../models/IAudio";


interface NovelState {
    novels: {
        meta: IMeta | null;
        results: INovel[]
    };
    savedNovels: {
        meta: IMeta | null;
        results: INovel[];
    },
    followedNovels: {
        meta: IMeta | null;
        results: INovel[];
    }
    novel: INovel | null;
    playerNovel: INovel | null;
    audioList: IAudio[];
    actual: INovel | null;
    countSaved: number,
    loading: boolean;
    loadingTracks: boolean;
    error: string;
}

const initialState: NovelState = {
    novels: {
        meta: null,
        results: []
    },
    savedNovels: {
        meta: null,
        results: []
    },
    followedNovels: {
        meta: null,
        results: []
    },
    actual: null,
    novel: null,
    playerNovel: null,
    audioList: [],
    countSaved: 0,
    loading: false,
    loadingTracks: true,
    error: '',
}

export const novelSlice = createSlice({
    name: 'novels',
    initialState,
    reducers: {},
    extraReducers: {
        // Novels
        [fetchNovels.fulfilled.type]: (state, action: PayloadAction<ILegacyListResponse<INovel[]>>) => {
            state.loading = false;
            state.error = '';
            state.novels.meta = action.payload.meta;
            state.novels.results = action.payload.results
        },
        [fetchNovels.pending.type]: (state) => {
            state.loading = true;
        },
        [fetchNovels.rejected.type]: (state, action: PayloadAction<string>) => {
            state.loading = false;
            state.error =  action.payload;
        },

        // Novel detail
        [fetchNovelOne.fulfilled.type]: (state, action: PayloadAction<INovel>) => {
            state.loading = false;
            state.error = '';
            state.novel = action.payload;
        },
        [fetchNovelOne.pending.type]: (state) => {
            state.loading = true;
        },
        [fetchNovelOne.rejected.type]: (state, action: PayloadAction<string>) => {
            state.loading = false;
            state.error =  action.payload;
        },

        // Novel by DocumentId detail
        [fetchNovelByDocumentId.fulfilled.type]: (state, action: PayloadAction<INovel>) => {
            state.loading = false;
            state.error = '';
            state.novel = action.payload;
        },
        [fetchNovelByDocumentId.pending.type]: (state) => {
            state.loading = true;
        },
        [fetchNovelByDocumentId.rejected.type]: (state, action: PayloadAction<string>) => {
            state.loading = false;
            state.error =  action.payload;
        },

        // Player novel
        [fetchPlayerNovel.fulfilled.type]: (state, action: PayloadAction<INovel>) => {
            state.loading = false;
            state.error = '';
            state.playerNovel = action.payload;
        },
        [fetchPlayerNovel.pending.type]: (state) => {
            state.loading = true;
        },
        [fetchPlayerNovel.rejected.type]: (state, action: PayloadAction<string>) => {
            state.loading = false;
            state.error =  action.payload;
        },

        // Novel actual
        [fetchNovelActual.fulfilled.type]: (state, action: PayloadAction<ILegacyListResponse<INovel[]>>) => {
            state.loading = false;
            state.error = '';
            // Set the first novel from the results as the actual novel
            state.actual = action.payload.results.length > 0 ? action.payload.results[0] : null;
        },
        [fetchNovelActual.pending.type]: (state) => {
            state.loading = true;
        },
        [fetchNovelActual.rejected.type]: (state, action: PayloadAction<string>) => {
            state.loading = false;
            state.error =  action.payload;
        },

        // Audios of Novel
        [fetchAudiosOfNovel.fulfilled.type]: (state, action: PayloadAction<IAudio[]>) => {
            state.loadingTracks = false;
            state.error = '';
            state.audioList = action.payload;
        },

        [fetchAudiosOfNovel.pending.type]: (state) => {
            state.loadingTracks = true;
        },

        [fetchAudiosOfNovel.rejected.type]: (state, action: PayloadAction<string>) => {
            state.loadingTracks = false;
            state.error =  action.payload;
        },

        //Saved novels
        [fetchSavedNovels.fulfilled.type]: (state, action: PayloadAction<ILegacyListResponse<INovel[]>>) => {
            state.loading = false;
            state.error = '';
            state.countSaved = action.payload.meta.count;
            state.savedNovels.meta = action.payload.meta;
            state.savedNovels.results = action.payload.results
        },
        [fetchSavedNovels.pending.type]: (state) => {
            state.loading = true;
        },

        [fetchSavedNovels.rejected.type]: (state, action: PayloadAction<string>) => {
            state.loading = false;
            state.error =  action.payload;
        },

        //Save novel
        [saveNovel.fulfilled.type]: (state, action: PayloadAction<string>) => {
            state.countSaved = state.countSaved + 1;
        },

        [deleteFromSavedNovel.fulfilled.type]: (state, action: PayloadAction<string>) => {
            if(state.countSaved >= 0){
                state.countSaved = state.countSaved - 1;
            }
        },

        //Followed novels
        [fetchFollowedNovels.fulfilled.type]: (state, action: PayloadAction<ILegacyListResponse<INovel[]>>) => {
            state.loading = false;
            state.error = '';
            state.countSaved = action.payload.meta.count;
            state.followedNovels.meta = action.payload.meta;
            state.followedNovels.results = action.payload.results
        },
        [fetchFollowedNovels.pending.type]: (state) => {
            state.loading = true;
        },

        [fetchFollowedNovels.rejected.type]: (state, action: PayloadAction<string>) => {
            state.loading = false;
            state.error =  action.payload;
        },

        [HYDRATE]: (state, action) => {
            return {
                ...state,
                ...action.payload.novelReducer,
            };
        },
    }
})

export default novelSlice.reducer;
