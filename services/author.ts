import $api from "../http";
import {AxiosRequestConfig, AxiosResponse} from "axios";
import {IListResponse} from "../models/Response/IListResponse";
import {IAuthor} from "../models/IAuthors";
import {fetcherJson} from "../http/fetcher";
import {GetServerSidePropsContext} from "next";
import {FetchParams} from "../models/Actions/Params";



export default class AuthorService {

    static async fetchAuthors(param1: any = {}, param2: AxiosRequestConfig = {}, ctx?: GetServerSidePropsContext): Promise<AxiosResponse<IListResponse<IAuthor[]>>> {
        /**
         * Accepts two call styles for backward compatibility:
         *   1. fetchAuthors(locale: string, config?: AxiosRequestConfig)
         *   2. fetchAuthors(params: Record<string, any>, config?: AxiosRequestConfig)
         */
        let params: Record<string, any> = {};
        let config: AxiosRequestConfig = { ...(param2 || {}) };

        if (typeof param1 === 'string') {
            const locale = param1 as string;
            params = {
                locale,
                ...(config.params || {})
            };
            if (config.params) delete config.params;
        } else {
            params = { ...(param1 || {}) };
            // Handle legacy call where a nested `config` object was passed inside params
            if (params.config) {
                config = { ...(config || {}), ...(params.config as AxiosRequestConfig) };
                delete params.config;
            }
        }

        // Ensure author relations are populated unless caller specified otherwise
        if (!('populate' in params)) {
            params.populate = 'kitoblars,rasmi';
        }

        // Encode params to query string
        const searchParams = new URLSearchParams();
        for (const key in params) {
            if (Object.prototype.hasOwnProperty.call(params, key)) {
                const value = params[key];
                if (typeof value === 'object' && value !== null) {
                    for (const subKey in value) {
                        if (Object.prototype.hasOwnProperty.call(value, subKey)) {
                            searchParams.append(`${key}[${subKey}]`, value[subKey]);
                        }
                    }
                } else {
                    searchParams.append(key, value);
                }
            }
        }

        return await fetcherJson(`/api/mualliflars?${searchParams.toString()}`, config, ctx);
    }

    static async fetchAuthorsList({locale, config, ctx}: FetchParams): Promise<AxiosResponse<IListResponse<IAuthor[]>>> {
        return await fetcherJson(`/api/mualliflars?locale=${locale}&populate=kitoblars&populate=rasmi`, config, ctx)
    }

    static async fetchAuthorOne({locale, slug, config, ctx}: FetchParams): Promise<AxiosResponse<IListResponse<IAuthor[]>>> {
        const populateParams = "populate=kitoblars&populate=rasmi";
        return await fetcherJson(`/api/mualliflars?filters[slug][$eq]=${slug}&locale=${locale}&${populateParams}`, config, ctx)
    }

    static async fetchAuthorByDocumentId({locale, documentId, config, ctx}: FetchParams & {documentId: string}): Promise<AxiosResponse<IListResponse<IAuthor>>> {
        const populateParams = "populate=kitoblars&populate=rasmi";
        return await fetcherJson(`/api/mualliflars/${documentId}?locale=${locale}&${populateParams}`, config, ctx)
    }

    static async followAuthor({locale, slug, config, ctx}: FetchParams): Promise<AxiosResponse> {
        const slugAuth = encodeURI(slug)
        return await fetcherJson(`/api/mualliflars/${slugAuth}/kuzatish?locale=${locale}`, {
            ...config,
            method: 'POST'
        }, ctx)
    }

    static async unfollowAuthor({locale, slug, config, ctx}: FetchParams): Promise<AxiosResponse> {
        const slugAuth = encodeURI(slug)
        return await fetcherJson(`/api/mualliflars/${slugAuth}/bekor?locale=${locale}`, {
            ...config,
            method: 'DELETE'
        }, ctx)
    }

    static async fetchFollowedAuthors(locale: string, config: AxiosRequestConfig = {}, ctx?: GetServerSidePropsContext ): Promise<AxiosResponse<IListResponse<IAuthor[]>>> {
        const populateParams = "populate=kitoblars&populate=rasmi";
        return await fetcherJson(`/api/mualliflars/kuzatilayotgan?locale=${locale}&${populateParams}`, config, ctx)
    }
}
