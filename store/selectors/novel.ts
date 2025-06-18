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

export const selectAudioListByLang = createSelector([selectNovelOne, selectAudioList], (novel, audioList): IAudioList => {
    let listRu = []
    let listUz = [];

    // First try to use audioList if available (legacy format)
    if(audioList && audioList.length > 0){
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
    // Otherwise use the audio from novel data (new format)
    else if(novel && novel.audio_list && novel.audio_list.length > 0) {
        // For new format, we have a single audio file
        // Determine language based on locale
        if(novel.locale === 'uz') {
            listUz = novel.audio_list.map((audio, index) => ({
                slug: novel.slug,
                name: audio.name || novel.name,
                file: audio.file,
                duration: audio.duration,
                order: audio.order || index + 1
            }));
        } else {
            listRu = novel.audio_list.map((audio, index) => ({
                slug: novel.slug,
                name: audio.name || novel.name,
                file: audio.file,
                duration: audio.duration,
                order: audio.order || index + 1
            }));
        }
    }

    return  {
        audioListRu: listRu,
        audioListUz: listUz
    }
})
