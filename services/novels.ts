import $api from "../http";
import {AxiosRequestConfig, AxiosResponse} from "axios";
import {INovel} from "../models/INovel";
import {IListResponse, ISingleResponse} from "../models/Response/IListResponse";
import {IAudoList} from "../models/Response/IAudoList";
import {GetServerSidePropsContext} from "next";
import {fetcherJson} from "../http/fetcher";
import {FetchParams} from "../models/Actions/Params";

export default class NovelService {

    // Barcha kitoblar ro'yxati
    static async fetchNovels(locale: string, opt: AxiosRequestConfig = {}, ctx?: GetServerSidePropsContext): Promise<AxiosResponse<IListResponse<INovel[]>>> {
        const populateParams = "populate=audio&populate=muqova&populate=mualliflar&populate=janrlars&populate=kategoriyalars";
        return await fetcherJson(`/api/kitoblars?locale=${locale}&${populateParams}`, opt, ctx)
    }

    // Bitta kitob - slug orqali
    static async fetchNovelOne(locale: string, slug: string, config: AxiosRequestConfig = {}, ctx?: GetServerSidePropsContext): Promise<AxiosResponse<IListResponse<INovel[]>>> {
        const populateParams = "populate=audio&populate=muqova&populate=mualliflar&populate=janrlars&populate=kategoriyalars";
        // First get by slug to find documentId, then use documentId for detailed data
        return await fetcherJson(`/api/kitoblars?filters[slug][$eq]=${slug}&locale=${locale}&${populateParams}`, config, ctx)
    }

    // Bitta kitob - documentId orqali  
    static async fetchNovelByDocumentId(locale: string, documentId: string, config: AxiosRequestConfig = {}, ctx?: GetServerSidePropsContext): Promise<AxiosResponse<ISingleResponse<INovel>>> {
        const populateParams = "populate=audio&populate=muqova&populate=mualliflar&populate=janrlars&populate=kategoriyalars";
        return await fetcherJson(`/api/kitoblars/${documentId}?locale=${locale}&${populateParams}`, config, ctx)
    }

    // Dolzarb kitoblar
    static async fetchNovelActual(locale: string, config: AxiosRequestConfig = {}, ctx?: GetServerSidePropsContext): Promise<AxiosResponse<IListResponse<INovel[]>>> {
        const populateParams = "populate=audio&populate=muqova&populate=mualliflar&populate=janrlars&populate=kategoriyalars";
        return await fetcherJson(`/api/kitoblars?filters[dolzarb][$eq]=true&locale=${locale}&${populateParams}`, config, ctx)
    }

    // Muallif kitoblari
    static async fetchNovelsOfAuthors(locale: string, slug: string, opt: AxiosRequestConfig = {}, ctx?: GetServerSidePropsContext): Promise<AxiosResponse<IListResponse<INovel[]>>> {
        const populateParams = "populate=audio&populate=muqova&populate=mualliflar&populate=janrlars&populate=kategoriyalars";
        return await fetcherJson(`/api/kitoblars?filters[mualliflar][slug][$eq]=${slug}&locale=${locale}&${populateParams}`, opt, ctx)
    }

    // O'quvchi kitoblari (deprecated - reader tushunchasi yo'q)
    static async fetchNovelsOfReaders(locale: string, slug: string, opt: AxiosRequestConfig = {}): Promise<AxiosResponse<IListResponse<INovel[]>>> {
        return await $api.get(locale + '/api/readers/' + slug +  '/novels', opt)
    }

    // Kitob audio ro'yxati
    static async fetchAudiosOfNovel(locale: string, slug: string, config: AxiosRequestConfig = {}, ctx?: GetServerSidePropsContext): Promise<AxiosResponse<IAudoList>> {
        return await fetcherJson(`/api/kitoblars/${slug}/audio-list?locale=${locale}`, config, ctx)
    }

    // Kitob baholash
    static async rateNovel({locale, slug, rating}, opt: AxiosRequestConfig = {}): Promise<AxiosResponse> {
        return await fetcherJson(`/api/kitoblars/${slug}/baholash?locale=${locale}`, {
            ...opt,
            method: 'POST',
            data: { reyting: rating }
        }, null)
    }

    // Kitob saqlash
    static async saveNovel({locale, slug}, opt: AxiosRequestConfig = {}): Promise<AxiosResponse> {
        return await fetcherJson(`/api/kitoblars/${slug}/saqlash?locale=${locale}`, {
            ...opt,
            method: 'POST'
        }, null)
    }

    // Saqlangan kitoblar
    static async fetchSavedNovels(locale: string, config: AxiosRequestConfig = {}, ctx?: GetServerSidePropsContext): Promise<AxiosResponse<IListResponse<INovel[]>>> {
        const populateParams = "populate=audio&populate=muqova&populate=mualliflar&populate=janrlars&populate=kategoriyalars";
        return await fetcherJson(`/api/kitoblars/saqlangan?locale=${locale}&${populateParams}`, config, ctx)
    }

    // Kuzatilayotgan kitoblar
    static async fetchFollowedNovels({locale, config, ctx}: FetchParams): Promise<AxiosResponse<IListResponse<INovel[]>>> {
        const populateParams = "populate=audio&populate=muqova&populate=mualliflar&populate=janrlars&populate=kategoriyalars";
        return await fetcherJson(`/api/kitoblars/kuzatilayotgan?locale=${locale}&${populateParams}`, config, ctx)
    }

    // Audio mavjud kitoblar
    static async fetchAudioNovels(locale: string, config: AxiosRequestConfig = {}, ctx?: GetServerSidePropsContext): Promise<AxiosResponse<IListResponse<INovel[]>>> {
        const populateParams = "populate=audio&populate=muqova&populate=mualliflar&populate=janrlars&populate=kategoriyalars";
        return await fetcherJson(`/api/kitoblars?filters[audio][$notNull]=true&locale=${locale}&${populateParams}`, config, ctx)
    }

    // Yangi kitoblar
    static async fetchNewNovels(locale: string, config: AxiosRequestConfig = {}, ctx?: GetServerSidePropsContext): Promise<AxiosResponse<IListResponse<INovel[]>>> {
        const populateParams = "populate=audio&populate=muqova&populate=mualliflar&populate=janrlars&populate=kategoriyalars";
        return await fetcherJson(`/api/kitoblars?filters[yangi][$eq]=true&locale=${locale}&${populateParams}`, config, ctx)
    }

    // Janr bo'yicha kitoblar
    static async fetchNovelsByGenre(locale: string, genreSlug: string, config: AxiosRequestConfig = {}, ctx?: GetServerSidePropsContext): Promise<AxiosResponse<IListResponse<INovel[]>>> {
        const populateParams = "populate=audio&populate=muqova&populate=mualliflar&populate=janrlars&populate=kategoriyalars";
        return await fetcherJson(`/api/kitoblars?filters[janrlars][slug][$eq]=${genreSlug}&locale=${locale}&${populateParams}`, config, ctx)
    }

    // Kategoriya bo'yicha kitoblar
    static async fetchNovelsByCategory(locale: string, categorySlug: string, config: AxiosRequestConfig = {}, ctx?: GetServerSidePropsContext): Promise<AxiosResponse<IListResponse<INovel[]>>> {
        const populateParams = "populate=audio&populate=muqova&populate=mualliflar&populate=janrlars&populate=kategoriyalars";
        return await fetcherJson(`/api/kitoblars?filters[kategoriyalars][slug][$eq]=${categorySlug}&locale=${locale}&${populateParams}`, config, ctx)
    }

}
