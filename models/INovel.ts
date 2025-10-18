import {IAuthor} from "./IAuthors";
import {ICategory} from "./ICategory";
import {IAudioListItem} from "./Actions/SetActiveTrack";

// Strapi Rich Text content type
export interface IRichTextContent {
    type: string;
    children: Array<{
        text: string;
        type: string;
    }>;
}

// Strapi Media format
export interface IMediaFormat {
    ext: string;
    url: string;
    hash: string;
    mime: string;
    name: string;
    path: string | null;
    size: number;
    width: number;
    height: number;
    sizeInBytes: number;
}

// Strapi Media object
export interface IMedia {
    id: number;
    documentId: string;
    name: string;
    alternativeText: string | null;
    caption: string | null;
    width: number | null;
    height: number | null;
    formats?: {
        large?: IMediaFormat;
        medium?: IMediaFormat;
        small?: IMediaFormat;
        thumbnail?: IMediaFormat;
    } | null;
    hash: string;
    ext: string;
    mime: string;
    size: number;
    url: string;
    previewUrl: string | null;
    provider: string;
    provider_metadata: any;
    createdAt: string;
    updatedAt: string;
    publishedAt: string;
}

// Yangi Strapi Novel interface
export interface INovel {
    id: number;
    documentId: string;
    nomi: string;
    slug: string;
    tavsifi: IRichTextContent[];
    yosh_chegarasi: string;
    dolzarb: boolean;
    yangi: boolean;
    reyting: number;
    narxi: number;
    chegirma_narxi: number;
    ISBN: string;
    sahifalar_soni: number;
    chop_yili: number;
    omborda: number;
    audio_davomiyligi: number;
    createdAt: string;
    updatedAt: string;
    publishedAt: string;
    locale: string;
    sotib_olish?: string;
    
    // Relations
    audio?: IMedia;
    muqova?: IMedia;
    mualliflar?: IAuthor;
    kategoriya?: ICategory[];
    
    // Additional media fields
    Rasm?: IMedia;
    Rasm1?: IMedia;
    Rasm2?: IMedia;
    Fragment?: IMedia;
    Ilova?: IMedia;

    // Deprecated fields (for backward compatibility)
    name?: string;
    cover?: {
        src: string;
        width: number;
        height: number;
        base64: string;
    };
    description?: string;
    genre?: string[];
    categories?: string[];
    age_rate?: string;
    actual?: boolean;
    author?: IAuthor;
    reader?: string[];
    duration?: string;
    audio_list?: IAudioListItem[];
    rating?: number;
    duration_uz?: number | null;
    duration_ru?: number | null;
    language?: string;
    new?: boolean;
    saved?: boolean;
    published_at?: string;
}
