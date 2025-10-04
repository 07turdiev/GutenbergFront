export interface ITermsText {
    type: string;
    children: {
        type: string;
        text: string;
    }[];
}

export interface ITermsBrendbook {
    id: number;
    documentId: string;
    name: string;
    alternativeText: string | null;
    caption: string | null;
    width: number | null;
    height: number | null;
    formats: any | null;
    hash: string;
    ext: string;
    mime: string;
    size: number;
    url: string;
    previewUrl: string | null;
    provider: string;
    provider_metadata: any | null;
    createdAt: string;
    updatedAt: string;
    publishedAt: string;
}

export interface ITermsData {
    id: number;
    documentId: string;
    text: ITermsText[];
    createdAt: string;
    updatedAt: string;
    publishedAt: string;
    locale: string;
    Brendbook: ITermsBrendbook;
}

export interface ITermsResponse {
    data: ITermsData;
    meta: any;
}
