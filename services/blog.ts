import $api from "../http";
import {AxiosRequestConfig, AxiosResponse} from "axios";
import {IListResponse} from "../models/Response/IListResponse";
import {fetcherJson} from "../http/fetcher";
import {GetServerSidePropsContext} from "next";
import {FetchParams} from "../models/Actions/Params";
import {IBlogPost} from "../models/IBlog";
import {adaptBookipediaArray, adaptBookipediaPost} from "../utils/strapiAdapter";

export default class BlogService {

    static async fetchBlogPosts(params: Record<string, any> = {}, config: AxiosRequestConfig = {}, ctx?: GetServerSidePropsContext): Promise<AxiosResponse<IListResponse<IBlogPost[]>>> {
        const searchParams = new URLSearchParams();
        const { page, pageSize, ...rest } = params || {};
        // Normalize pagination to Strapi style
        if (page) searchParams.append('pagination[page]', String(page));
        if (pageSize) searchParams.append('pagination[pageSize]', String(pageSize));
        // Append remaining params (including locale, filters, etc.)
        for (const key in rest) {
            if (Object.prototype.hasOwnProperty.call(rest, key)) {
                const value = rest[key];
                if (typeof value === 'object' && value !== null) {
                    for (const subKey in value) {
                        if (Object.prototype.hasOwnProperty.call(value, subKey)) {
                            searchParams.append(`${key}[${subKey}]`, value[subKey]);
                        }
                    }
                } else if (value !== undefined && value !== null) {
                    searchParams.append(key, value);
                }
            }
        }
        // Ensure media is returned
        searchParams.append('populate', 'Rasmi');
        // Call new Bookipedia endpoint
        const res: any = await fetcherJson(`/api/bookipedias?${searchParams.toString()}`, config, ctx);
        // Adapt to IListResponse<IBlogPost[]>
        const adapted = {
            data: adaptBookipediaArray(res.data.data),
            meta: res.data.meta
        };
        return { ...res, data: adapted } as AxiosResponse<IListResponse<IBlogPost[]>>;
    }

    static async fetchBlogPostBySlug({locale, slug, config, ctx}: FetchParams & {slug: string}): Promise<AxiosResponse<IListResponse<IBlogPost[]>>> {
        const res: any = await fetcherJson(`/api/bookipedias?locale=${locale}&filters[slug][$eq]=${slug}&populate=Rasmi`, config, ctx);
        const adapted = {
            data: adaptBookipediaArray(res.data.data),
            meta: res.data.meta
        };
        return { ...res, data: adapted } as AxiosResponse<IListResponse<IBlogPost[]>>;
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