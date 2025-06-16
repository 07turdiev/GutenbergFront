export interface IAuthor {
    name: string;
    slug: string;
    biography: string;
    novels_count: number;
    followed: boolean;
    photo: {
        src: string;
        width: number;
        height: number;
        base64: string;
    };
}

