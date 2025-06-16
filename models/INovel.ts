import {IAudioListItem} from "./Actions/SetActiveTrack";
import {IAuthor} from "./IAuthors";

export interface INovel {
    slug: string;
    name: string;
    cover: {
        src: string;
        width: number;
        height: number;
        base64: string;
    };
    description: string;
    genre: string[];
    categories: string[];
    age_rate: string;
    actual: boolean;
    author: IAuthor;
    reader: string[];
    duration: string;
    audio_list: IAudioListItem[];
    rating: number;
    duration_uz: number | null;
    duration_ru: number | null;
    language: string;
    new: boolean;
    saved: boolean;
    published_at: string;
}
