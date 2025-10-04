export interface IPrivacyText {
    type: string;
    children: {
        type: string;
        text: string;
    }[];
}

export interface IPrivacyData {
    id: number;
    documentId: string;
    text: IPrivacyText[];
    createdAt: string;
    updatedAt: string;
    publishedAt: string;
    locale: string;
}

export interface IPrivacyResponse {
    data: IPrivacyData;
    meta: any;
}
