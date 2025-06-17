import $api from "../http";
import {AxiosRequestConfig, AxiosResponse} from "axios";
import {IListResponse} from "../models/Response/IListResponse";
import {fetcherJson} from "../http/fetcher";
import {GetServerSidePropsContext} from "next";
import {FetchParams} from "../models/Actions/Params";

export interface IBlogPost {
    id: string;
    attributes: {
        sarlavha: string;
        slug: string;
        kontent: string;
        chop_sanasi: string;
        nashr_etilgan: boolean;
        mashhur: boolean;
        korishlar_soni: number;
        youtube_havolasi?: string;
        rasmi?: {
            data: {
                url: string;
            }
        };
        audio?: {
            data: {
                url: string;
                mime: string;
                size: number;
            }
        };
        mualliflar?: {
            data: Array<{
                id: string;
                attributes: {
                    ismi: string;
                    slug: string;
                }
            }>
        };
        kategoriya?: {
            data: {
                id: string;
                attributes: {
                    nomi: string;
                    slug: string;
                }
            }
        };
        teglar?: {
            data: Array<{
                id: string;
                attributes: {
                    nomi: string;
                    slug: string;
                }
            }>
        };
    }
}

export default class BlogService {

    static async fetchBlogPosts({locale, config, ctx}: FetchParams): Promise<AxiosResponse<IListResponse<IBlogPost[]>>> {
        return await fetcherJson(`/api/blog-postlaris?locale=${locale}&populate=rasmi&populate=audio&populate=mualliflar&populate=kategoriya&populate=teglar`, config, ctx)
    }

    static async fetchBlogPostOne({locale, slug, config, ctx}: FetchParams): Promise<AxiosResponse<IBlogPost>> {
        return await fetcherJson(`/api/blog-postlaris/${slug}?locale=${locale}&populate=rasmi&populate=audio&populate=mualliflar&populate=kategoriya&populate=teglar`, config, ctx)
    }

    static async fetchPopularBlogPosts({locale, config, ctx}: FetchParams): Promise<AxiosResponse<IListResponse<IBlogPost[]>>> {
        return await fetcherJson(`/api/blog-postlaris/mashhur?locale=${locale}&populate=rasmi&populate=audio&populate=mualliflar&populate=kategoriya&populate=teglar`, config, ctx)
    }

    static async fetchLatestBlogPosts({locale, config, ctx}: FetchParams): Promise<AxiosResponse<IListResponse<IBlogPost[]>>> {
        return await fetcherJson(`/api/blog-postlaris/oxirgi?locale=${locale}&populate=rasmi&populate=audio&populate=mualliflar&populate=kategoriya&populate=teglar`, config, ctx)
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

    static async incrementViewCount({locale, slug, config, ctx}: FetchParams): Promise<AxiosResponse> {
        return await fetcherJson(`/api/blog-postlaris/${slug}/korish?locale=${locale}`, {
            ...config,
            method: 'POST'
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