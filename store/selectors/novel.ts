import { createSelector } from '@reduxjs/toolkit'
import { AppState } from "../store";
import {IAudioList} from "../../models/IAudioList";


export const selectNovels = (state:AppState) => state.novelReducer;
export const selectNovelOne = (state:AppState) => state.novelReducer.novel;
export const selectAudioList = (state:AppState) => state.novelReducer.audioList;
export const selectSavedNovels = (state:AppState) => state.novelReducer.savedNovels;

export const selectCountOfSaved = createSelector(selectSavedNovels, items => {
    if(items.meta){
        return items.meta.count
    }
})

export const selectAudioListByLang = createSelector(selectAudioList, (audioList): IAudioList => {
    let listRu = []
    let listUz = [];

    if(audioList){
        listRu = audioList.filter(item=>item.file_ru !== null).map( (audio) => {
            return {
                slug: audio.slug,
                name: audio.name_ru,
                file: audio.file_ru,
                duration: audio.duration_ru,
                order: audio.order
            }
        });

        listUz = audioList.filter(item=>item.file_uz !== null).map( (audio) => {
                return {
                    slug: audio.slug,
                    name: audio.name_uz,
                    file: audio.file_uz,
                    duration: audio.duration_uz,
                    order: audio.order
                }
        });
    }

    return  {
        audioListRu: listRu,
        audioListUz: listUz
    }
})
