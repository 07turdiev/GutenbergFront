// Yangi Strapi Genre interface
export interface IGenre {
    id: number;
    documentId: string;
    nomi: string;
    slug: string;
    createdAt: string;
    updatedAt: string;
    publishedAt: string;
    
    // Deprecated fields (for backward compatibility)
    name?: string;
}

