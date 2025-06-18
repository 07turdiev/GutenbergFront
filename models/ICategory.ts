// Yangi Strapi Category interface
export interface ICategory {
    id: number;
    documentId: string;
    nomi: string;
    slug: string;
    ota_kategoriya?: string;
    ikonka?: string;
    createdAt: string;
    updatedAt: string;
    publishedAt: string;
    
    // Deprecated fields (for backward compatibility)
    name?: string;
    parent?: string;
    icon?: string;
}