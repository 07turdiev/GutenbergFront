export interface IAudioList{
    audioListRu: {
        slug: string;
        name: string;
        file: string;
        duration: number;
        order: number;
    }[],
    audioListUz: {
        slug: string;
        name: string;
        file: string;
        duration: number;
        order: number;
    }[]
}