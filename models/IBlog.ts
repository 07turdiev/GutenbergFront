// Blog Post Content Block
export interface IBlogContentBlock {
    type: string;
    children: Array<{
        text: string;
        type: string;
    }>;
}

// Blog Post Image Format
export interface IBlogImageFormat {
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

// Blog Post Image
export interface IBlogImage {
    id: number;
    documentId: string;
    name: string;
    alternativeText: string | null;
    caption: string | null;
    width: number;
    height: number;
    formats: {
        large?: IBlogImageFormat;
        small?: IBlogImageFormat;
        medium?: IBlogImageFormat;
        thumbnail?: IBlogImageFormat;
    };
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

// Main Blog Post Interface
export interface IBlogPost {
    id: number;
    documentId: string;
    sarlavha: string;
    slug: string;
    kontent: IBlogContentBlock[];
    chop_sanasi: string;
    korishlar_soni: number;
    youtube_havolasi?: string | null;
    createdAt: string;
    updatedAt: string;
    publishedAt: string;
    locale: string;
    rasmi?: IBlogImage | null;
} 