export interface INotification {
    id: string;
    viewed: boolean;
    message: string;
    link: string;
    novel: string;
    author: {
        name: string;
        slug: string;
    }
}