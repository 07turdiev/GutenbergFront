import $api from "../http";
import {AxiosRequestConfig, AxiosResponse} from "axios";
import {IListResponse} from "../models/Response/IListResponse";
import {fetcherJson} from "../http/fetcher";
import {GetServerSidePropsContext} from "next";
import {FetchParams} from "../models/Actions/Params";
import {IBlogPost} from "../models/IBlog";

export default class BlogService {

    static async fetchBlogPosts({locale, config, ctx, page = 1, pageSize = 25}: FetchParams & {page?: number, pageSize?: number}): Promise<AxiosResponse<IListResponse<IBlogPost[]>>> {
        return await fetcherJson(`/api/blog-postlaris?locale=${locale}&populate=rasmi&pagination[page]=${page}&pagination[pageSize]=${pageSize}`, config, ctx)
    }

    static async fetchBlogPostBySlug({locale, slug, config, ctx}: FetchParams & {slug: string}): Promise<AxiosResponse<IListResponse<IBlogPost[]>>> {
        return await fetcherJson(`/api/blog-postlaris?locale=${locale}&filters[slug][$eq]=${slug}&populate=rasmi`, config, ctx)
    }

    static async fetchPopularBlogPosts({locale, config, ctx, limit = 4}: FetchParams & {limit?: number}): Promise<AxiosResponse<IListResponse<IBlogPost[]>>> {
        return await fetcherJson(`/api/blog-postlaris?locale=${locale}&populate=rasmi&sort[0]=korishlar_soni:desc&pagination[pageSize]=${limit}`, config, ctx)
    }

    static async fetchLatestBlogPosts({locale, config, ctx, limit = 4}: FetchParams & {limit?: number}): Promise<AxiosResponse<IListResponse<IBlogPost[]>>> {
        return await fetcherJson(`/api/blog-postlaris?locale=${locale}&populate=rasmi&sort[0]=chop_sanasi:desc&pagination[pageSize]=${limit}`, config, ctx)
    }

    static async fetchTrendingBlogPosts({locale, config, ctx}: FetchParams): Promise<AxiosResponse<IListResponse<IBlogPost[]>>> {
        return await fetcherJson(`/api/blog-postlaris/trendda?locale=${locale}&populate=rasmi&populate=audio&populate=mualliflar&populate=kategoriya&populate=teglar`, config, ctx)
    }

    static async fetchAudioBlogPosts({locale, config, ctx}: FetchParams): Promise<AxiosResponse<IListResponse<IBlogPost[]>>> {
        return await fetcherJson(`/api/blog-postlaris/audio?locale=${locale}&populate=rasmi&populate=audio&populate=mualliflar&populate=kategoriya&populate=teglar`, config, ctx)
    }

    static async fetchVideoBlogPosts({locale, config, ctx}: FetchParams): Promise<AxiosResponse<IListResponse<IBlogPost[]>>> {
        return await fetcherJson(`/api/blog-postlaris/video?locale=${locale}&populate=rasmi&populate=audio&populate=mualliflar&populate=kategoriya&populate=teglar`, config, ctx)
    }

    static async incrementViewCount({id, config, ctx}: {id: number; config?: AxiosRequestConfig; ctx?: GetServerSidePropsContext}): Promise<AxiosResponse> {
        // This would need to be implemented on the API side
        // For now, we'll just return a placeholder
        return await fetcherJson(`/api/blog-postlaris/${id}`, {
            ...config,
            method: 'PUT',
            data: {
                data: {
                    korishlar_soni: {
                        $inc: 1
                    }
                }
            }
        }, ctx)
    }

    // Blog kategoriyalar
    static async fetchBlogCategories({locale, config, ctx}: FetchParams): Promise<AxiosResponse<IListResponse<any[]>>> {
        return await fetcherJson(`/api/blog-kategoriyalars?locale=${locale}`, config, ctx)
    }

    // Teglar
    static async fetchTags({locale, config, ctx}: FetchParams): Promise<AxiosResponse<IListResponse<any[]>>> {
        return await fetcherJson(`/api/teglar`, config, ctx)
    }
} 