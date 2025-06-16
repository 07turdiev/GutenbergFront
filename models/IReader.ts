export interface IReader{
    slug: string;
    name: string;
    photo: {
        src: string;
        width: number;
        height: number;
    };
    novels_count: number;
}