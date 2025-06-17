import {IMeta} from "../IMeta";

// Strapi response format
export interface IListResponse<T> {
    data: T;
    meta: {
        pagination: {
            page: number;
            pageSize: number;
            pageCount: number;
            total: number;
        }
    };
}

// Strapi single item response format
export interface ISingleResponse<T> {
    data: T;
    meta: any;
}

// Legacy format (backward compatibility)
export interface ILegacyListResponse<T> {
    meta: IMeta;
    results: T;
}