import $api from "../http";
import {AxiosRequestConfig, AxiosResponse} from "axios";
import {IListResponse} from "../models/Response/IListResponse";
import {IAuthor} from "../models/IAuthors";
import {fetcherJson} from "../http/fetcher";
import {GetServerSidePropsContext} from "next";
import {FetchParams} from "../models/Actions/Params";



export default class AuthorService {

    static async fetchAuthors({locale, config, ctx}: FetchParams): Promise<AxiosResponse<IListResponse<IAuthor[]>>> {
        const populateParams = "populate=kitoblars&populate=rasmi";
        return await fetcherJson(`/api/mualliflars?locale=${locale}&${populateParams}`, config, ctx)
    }

    static async fetchAuthorsList({locale, config, ctx}: FetchParams): Promise<AxiosResponse<IListResponse<IAuthor[]>>> {
        return await fetcherJson(`/api/mualliflars?locale=${locale}`, config, ctx)
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
