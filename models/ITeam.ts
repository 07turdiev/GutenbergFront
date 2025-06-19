import { IMedia } from "./INovel";

// Team member interface based on Strapi API response
export interface ITeamMember {
    id: number;
    documentId: string;
    ismi: string; // name
    Lavozimi: string; // position
    tarjimai_holi: string; // biography/description
    createdAt: string;
    updatedAt: string;
    publishedAt: string;
    locale: string;
    
    // Relations
    rasmi?: IMedia; // photo
} 