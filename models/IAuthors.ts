import {IRichTextContent, IMedia} from "./INovel";

// Yangi Strapi Author interface
export interface IAuthor {
    id: number;
    documentId: string;
    ismi: string;
    slug: string;
    tarjimai_holi: IRichTextContent[];
    romanlar_soni: number;
    createdAt: string;
    updatedAt: string;
    publishedAt: string;
    locale: string;
    
    // Relations
    suratilar?: IMedia[];
    kitoblars?: Array<{
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
    }>;

    // Deprecated fields (for backward compatibility)
    name?: string;
    biography?: string;
    novels_count?: number;
    followed?: boolean;
    photo?: {
        src: string;
        width: number;
        height: number;
        base64: string;
    };
}

