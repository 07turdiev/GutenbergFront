import $api from "../http";
import {AxiosRequestConfig, AxiosResponse} from "axios";
import {IListResponse} from "../models/Response/IListResponse";
import {INovel} from "../models/INovel";
import {fetcherJson} from "../http/fetcher";
import {GetServerSidePropsContext} from "next";

export default class NovelService {

    static async fetchNovels(locale: string, config: AxiosRequestConfig = {}, ctx?: GetServerSidePropsContext): Promise<AxiosResponse<IListResponse<INovel[]>>> {
        const populateParams = "populate=audio&populate=muqova&populate=mualliflar&populate=kategoriya";
        const url = `/api/kitoblars?locale=${locale}&${populateParams}`;
        console.log('DEBUG fetchNovels - URL:', url);
        console.log('DEBUG fetchNovels - Config:', config);
        return await fetcherJson(url, config, ctx)
    }

    static async fetchNovelsList(locale: string, config: AxiosRequestConfig = {}, ctx?: GetServerSidePropsContext): Promise<AxiosResponse<IListResponse<INovel[]>>> {
        const populateParams = "populate=audio&populate=muqova&populate=mualliflar&populate=kategoriya";
        return await fetcherJson(`/api/kitoblars?locale=${locale}&${populateParams}`, config, ctx)
    }

    static async fetchNovelOne(locale: string, slug: string, config: AxiosRequestConfig = {}, ctx?: GetServerSidePropsContext): Promise<AxiosResponse<IListResponse<INovel[]>>> {
        const populateParams = "populate=audio&populate=muqova&populate=mualliflar&populate=kategoriya";
        return await fetcherJson(`/api/kitoblars?filters[slug][$eq]=${slug}&locale=${locale}&${populateParams}`, config, ctx)
    }

    // Bitta kitob - documentId orqali  
    static async fetchNovelByDocumentId(locale: string, documentId: string, config: AxiosRequestConfig = {}, ctx?: GetServerSidePropsContext): Promise<AxiosResponse<any>> {
        const populateParams = "populate=audio&populate=muqova&populate=mualliflar&populate=kategoriya";
        return await fetcherJson(`/api/kitoblars/${documentId}?locale=${locale}&${populateParams}`, config, ctx)
    }

    static async fetchNovelActual(locale: string, config: AxiosRequestConfig = {}, ctx?: GetServerSidePropsContext): Promise<AxiosResponse<IListResponse<INovel[]>>> {
        const populateParams = "populate=audio&populate=muqova&populate=mualliflar&populate=kategoriya";
        return await fetcherJson(`/api/kitoblars?filters[dolzarb][$eq]=true&locale=${locale}&${populateParams}`, config, ctx)
    }

    static async fetchNovelPopular(locale: string, config: AxiosRequestConfig = {}, ctx?: GetServerSidePropsContext): Promise<AxiosResponse<IListResponse<INovel[]>>> {
        const populateParams = "populate=audio&populate=muqova&populate=mualliflar&populate=kategoriya";
        return await fetcherJson(`/api/kitoblars?filters[popular][$eq]=true&locale=${locale}&${populateParams}`, config, ctx)
    }

    static async fetchNovelNew(locale: string, config: AxiosRequestConfig = {}, ctx?: GetServerSidePropsContext): Promise<AxiosResponse<IListResponse<INovel[]>>> {
        const populateParams = "populate=audio&populate=muqova&populate=mualliflar&populate=kategoriya";
        return await fetcherJson(`/api/kitoblars?filters[yangi][$eq]=true&locale=${locale}&${populateParams}`, config, ctx)
    }

    static async fetchNewNovels(locale: string, config: AxiosRequestConfig = {}, ctx?: GetServerSidePropsContext): Promise<AxiosResponse<IListResponse<INovel[]>>> {
        const populateParams = "populate=audio&populate=muqova&populate=mualliflar&populate=kategoriya";
        return await fetcherJson(`/api/kitoblars?filters[yangi][$eq]=true&locale=${locale}&${populateParams}`, config, ctx)
    }

    // Kategoriya bo'yicha kitoblar
    static async fetchNovelsByCategory(locale: string, categorySlug: string, config: AxiosRequestConfig = {}, ctx?: GetServerSidePropsContext): Promise<AxiosResponse<IListResponse<INovel[]>>> {
        const populateParams = "populate=audio&populate=muqova&populate=mualliflar&populate=kategoriya";
        return await fetcherJson(`/api/kitoblars?filters[kategoriya][slug][$eq]=${categorySlug}&locale=${locale}&${populateParams}`, config, ctx)
    }

    static async fetchNovelSaved(locale: string, config: AxiosRequestConfig = {}, ctx?: GetServerSidePropsContext): Promise<AxiosResponse<IListResponse<INovel[]>>> {
        const populateParams = "populate=audio&populate=muqova&populate=mualliflar&populate=kategoriya";
        return await fetcherJson(`/api/kitoblars?filters[saved][$eq]=true&locale=${locale}&${populateParams}`, config, ctx)
    }

    static async fetchSavedNovels(locale: string, config: AxiosRequestConfig = {}, ctx?: GetServerSidePropsContext): Promise<AxiosResponse<IListResponse<INovel[]>>> {
        const populateParams = "populate=audio&populate=muqova&populate=mualliflar&populate=kategoriya";
        return await fetcherJson(`/api/kitoblars/saqlangan?locale=${locale}&${populateParams}`, config, ctx)
    }

    static async fetchNovelFollowed(locale: string, config: AxiosRequestConfig = {}, ctx?: GetServerSidePropsContext): Promise<AxiosResponse<IListResponse<INovel[]>>> {
        const populateParams = "populate=audio&populate=muqova&populate=mualliflar&populate=kategoriya";
        return await fetcherJson(`/api/kitoblars?filters[followed][$eq]=true&locale=${locale}&${populateParams}`, config, ctx)
    }

    static async fetchNovelAudio(locale: string, config: AxiosRequestConfig = {}, ctx?: GetServerSidePropsContext): Promise<AxiosResponse<IListResponse<INovel[]>>> {
        const populateParams = "populate=audio&populate=muqova&populate=mualliflar&populate=kategoriya";
        return await fetcherJson(`/api/kitoblars?filters[audio][$notNull]=true&locale=${locale}&${populateParams}`, config, ctx)
    }

    static async fetchAudioNovels(locale: string, config: AxiosRequestConfig = {}, ctx?: GetServerSidePropsContext): Promise<AxiosResponse<IListResponse<INovel[]>>> {
        const populateParams = "populate=audio&populate=muqova&populate=mualliflar&populate=kategoriya";
        return await fetcherJson(`/api/kitoblars?filters[audio][$notNull]=true&locale=${locale}&${populateParams}`, config, ctx)
    }

    // Muallif kitoblari
    static async fetchNovelsOfAuthors(locale: string, slug: string, config: AxiosRequestConfig = {}, ctx?: GetServerSidePropsContext): Promise<AxiosResponse<IListResponse<INovel[]>>> {
        const populateParams = "populate=audio&populate=muqova&populate=mualliflar&populate=kategoriya";
        return await fetcherJson(`/api/kitoblars?filters[mualliflar][slug][$eq]=${slug}&locale=${locale}&${populateParams}`, config, ctx)
    }

    // O'quvchi kitoblari (deprecated - reader tushunchasi yo'q)
    static async fetchNovelsOfReaders(locale: string, slug: string, config: AxiosRequestConfig = {}): Promise<AxiosResponse<IListResponse<INovel[]>>> {
        return await $api.get(locale + '/api/readers/' + slug +  '/novels', config)
    }

    static async saveNovel({locale, slug}: {locale: string, slug: string}): Promise<AxiosResponse<any>> {
        return await $api.post(locale + '/api/kitoblars/save', {slug})
    }

    static async rateNovel({locale, slug, rating}: {locale: string, slug: string, rating: number}): Promise<AxiosResponse<any>> {
        return await $api.post(locale + '/api/kitoblars/rate', {slug, rating})
    }

    static async fetchFollowedNovels({locale, config, ctx}: {locale: string, config?: AxiosRequestConfig, ctx?: GetServerSidePropsContext}): Promise<AxiosResponse<IListResponse<INovel[]>>> {
        const populateParams = "populate=audio&populate=muqova&populate=mualliflar&populate=kategoriya";
        return await fetcherJson(`/api/kitoblars/kuzatilayotgan?locale=${locale}&${populateParams}`, config, ctx)
    }
}
