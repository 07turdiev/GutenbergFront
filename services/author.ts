import $api from "../http";
import {AxiosRequestConfig, AxiosResponse} from "axios";
import {IListResponse} from "../models/Response/IListResponse";
import {IAuthor} from "../models/IAuthors";
import {fetcherJson} from "../http/fetcher";
import {GetServerSidePropsContext} from "next";
import {FetchParams} from "../models/Actions/Params";



export default class AuthorService {

    static async fetchAuthors({locale, config, ctx}: FetchParams): Promise<AxiosResponse<IListResponse<IAuthor[]>>> {
        return await fetcherJson(`${locale}/api/authors/`, config, ctx)
    }

    static async fetchAuthorsList({locale, config, ctx}: FetchParams): Promise<AxiosResponse<IListResponse<IAuthor[]>>> {
        return await fetcherJson(`${locale}/api/authors/list`, config, ctx)
    }

    static async fetchAuthorOne({locale, slug, config, ctx}: FetchParams): Promise<AxiosResponse<IAuthor>> {
        return await fetcherJson(`${locale}/api/authors/${slug}`, config, ctx)
    }

    static async followAuthor({locale, slug, config, ctx}: FetchParams): Promise<AxiosResponse> {
        const slugAuth = encodeURI(slug)
        return await fetcherJson(`${locale}/api/authors/${slugAuth}/follow`, {
            ...config,
            method: 'POST'
        }, ctx)
    }

    static async unfollowAuthor({locale, slug, config, ctx}: FetchParams): Promise<AxiosResponse> {
        const slugAuth = encodeURI(slug)
        return await fetcherJson(`${locale}/api/authors/${slugAuth}/unfollow`, {
            ...config,
            method: 'DELETE'
        }, ctx)
    }

    static async fetchFollowedAuthors(locale: string, config: AxiosRequestConfig = {}, ctx?: GetServerSidePropsContext ): Promise<AxiosResponse<IListResponse<IAuthor[]>>> {
        return await fetcherJson(`${locale}/api/authors/followed`, config, ctx)
    }
}
