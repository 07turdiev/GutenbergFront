import {IAuthor} from "../IAuthors";

export interface IAudioListItem {
    file: string;
    name: string;
    duration: number;
    order: number;
}

export interface  SetActiveTrack {
    active_slug: string;
    lang: string;
    playImmediately: boolean;
}
