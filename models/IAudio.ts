import {IAuthor} from "./IAuthors";

export interface IAudio {
    slug: string;
    name_uz: string;
    name_ru: string;
    file: string;
    file_ru: null | string;
    file_uz: null | string;
    duration_ru: number;
    duration_uz: number;
    order: number;
}

export interface ITrack {
    name: string;
    file: string;
    novel: {
        author: IAuthor[];
        cover: {
            src: string;
        };
        name: string;
        slug: string;
    };
    next: string;
    prev: string;
}