import $api from "../http";
import {AxiosRequestConfig, AxiosResponse} from "axios";
import {INovel} from "../models/INovel";
import {IListResponse} from "../models/Response/IListResponse";
import {IAudoList} from "../models/Response/IAudoList";
import {GetServerSidePropsContext} from "next";
import {fetcherJson} from "../http/fetcher";
import {FetchParams} from "../models/Actions/Params";

export default class NovelService {

    static async fetchNovels(locale: string, opt: AxiosRequestConfig = {}, ctx?: GetServerSidePropsContext): Promise<AxiosResponse<IListResponse<INovel[]>>> {
        return await fetcherJson(`${locale}/api/novels/`,opt, ctx)
    }

    static async fetchNovelOne(locale: string, slug: string, config: AxiosRequestConfig = {}, ctx?: GetServerSidePropsContext): Promise<AxiosResponse<INovel>> {
        return await fetcherJson(`${locale}/api/novels/${slug}`,{}, ctx)
    }

    static async fetchNovelActual(locale: string, config: AxiosRequestConfig = {}, ctx?: GetServerSidePropsContext): Promise<AxiosResponse<INovel>> {
        return await fetcherJson(`${locale}/api/novels/actual`,config, ctx)
    }

    static async fetchNovelsOfAuthors(locale: string, slug: string, opt: AxiosRequestConfig = {}, ctx?: GetServerSidePropsContext): Promise<AxiosResponse<IListResponse<INovel[]>>> {
        return await fetcherJson(`${locale}/api/authors/${slug}/novels`,{}, ctx)
    }

    static async fetchNovelsOfReaders(locale: string, slug: string, opt: AxiosRequestConfig = {}): Promise<AxiosResponse<IListResponse<INovel[]>>> {
        return await $api.get(locale + '/api/readers/' + slug +  '/novels', opt)
    }

    static async fetchAudiosOfNovel(locale: string, slug: string, config: AxiosRequestConfig = {}, ctx?: GetServerSidePropsContext): Promise<AxiosResponse<IAudoList>> {
        return await fetcherJson(`${locale}/api/novels/${slug}/audio-list`, config, ctx)
    }

    static async rateNovel({locale, slug, rating}, opt: AxiosRequestConfig = {}): Promise<AxiosResponse<IAudoList>> {
        return await $api.post(locale + '/api/novels/' + slug + '/rate', {
            rate: rating
        })
    }

    static async saveNovel({locale, slug}, opt: AxiosRequestConfig = {}): Promise<AxiosResponse<IAudoList>> {
        return await $api.post(locale + '/api/novels/' + slug + '/save')
    }

    static async fetchSavedNovels(locale: string, config: AxiosRequestConfig = {}, ctx?: GetServerSidePropsContext): Promise<AxiosResponse<IListResponse<INovel[]>>> {
        return await fetcherJson(`${locale}/api/novels/saved`, config, ctx)
    }

    static async fetchFollowedNovels({locale, config, ctx}: FetchParams): Promise<AxiosResponse<IListResponse<INovel[]>>> {
        return await fetcherJson(`${locale}/api/novels/followed/`, config, ctx)
    }

}
