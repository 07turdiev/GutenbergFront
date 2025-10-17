import $api from "../http";
import {AxiosRequestConfig, AxiosResponse} from "axios";
import {IListResponse} from "../models/Response/IListResponse";
import {INovel} from "../models/INovel";
import {fetcherJson} from "../http/fetcher";
import {GetServerSidePropsContext} from "next";

export default class NovelService {

    static async fetchNovels(param1: any = {}, param2: AxiosRequestConfig = {}, ctx?: GetServerSidePropsContext): Promise<AxiosResponse<IListResponse<INovel[]>>> {
        /**
         * This method historically had two different call signatures:
         *   1) fetchNovels(locale: string, config?: AxiosRequestConfig)
         *   2) fetchNovels(params: Record<string, any>, config?: AxiosRequestConfig)
         * In order to maintain backward-compatibility we detect the argument types at runtime and
         * normalise them into a single `params` object that is then encoded into the query string.
         */

        let params: Record<string, any> = {};
        let config: AxiosRequestConfig = { ...(param2 || {}) };

        if (typeof param1 === 'string') {
            // Old signature – first param is `locale`
            const locale = param1 as string;
            // Merge any params that may exist on the config object
            params = {
                locale,
                ...(config.params || {})
            };
            // Remove params from axios config so it is not sent twice
            if (config.params) delete config.params;
        } else {
            // New signature – first param is params object
            params = { ...(param1 || {}) };
        }

        // Use the same populate format as other functions
        const populateParams = "populate=muqova&populate=mualliflar";
        const queryParams = new URLSearchParams();
        
        // Add locale
        if (params.locale) {
            queryParams.append('locale', params.locale);
        }
        
        // Add populate params
        queryParams.append('populate', 'muqova');
        queryParams.append('populate', 'mualliflar');
        
        // Add other params
        for (const key in params) {
            if (key !== 'locale' && key !== 'populate') {
                const value = params[key];
                if (typeof value === 'object' && value !== null) {
                    for (const subKey in value) {
                        if (Object.prototype.hasOwnProperty.call(value, subKey)) {
                            queryParams.append(`${key}[${subKey}]`, value[subKey]);
                        }
                    }
                } else {
                    queryParams.append(key, value);
                }
            }
        }

        return await fetcherJson(`/api/kitoblars?${queryParams.toString()}`, config, ctx);
    }

    static async fetchNovelsList(locale: string, config: AxiosRequestConfig = {}, ctx?: GetServerSidePropsContext): Promise<AxiosResponse<IListResponse<INovel[]>>> {
        const populateParams = "populate=audio&populate=muqova&populate=mualliflar&populate=kategoriya";
        return await fetcherJson(`/api/kitoblars?locale=${locale}&${populateParams}`, config, ctx)
    }

    static async fetchNovelOne(locale: string, slug: string, config: AxiosRequestConfig = {}, ctx?: GetServerSidePropsContext): Promise<AxiosResponse<IListResponse<INovel[]>>> {
        // Populate all fields needed by the frontend detail page
        const populateParams = [
            'populate=muqova',
            'populate=mualliflar',
            'populate=kategoriya',
            'populate=Rasm',
            'populate=Rasm1',
            'populate=Rasm2',
            'populate=Fragment'
        ].join('&');
        const url = `/api/kitoblars?filters[slug][$eq]=${slug}&locale=${locale}&${populateParams}`;
        return await fetcherJson(url, config, ctx);
    }

    // Bitta kitob - documentId orqali  
    static async fetchNovelByDocumentId(locale: string, documentId: string, config: AxiosRequestConfig = {}, ctx?: GetServerSidePropsContext): Promise<AxiosResponse<any>> {
        // Populate all fields needed by the frontend detail page
        const populateParams = [
            'populate=muqova',
            'populate=mualliflar',
            'populate=kategoriya',
            'populate=Rasm',
            'populate=Rasm1',
            'populate=Rasm2',
            'populate=Fragment'
        ].join('&');
        const url = `/api/kitoblars/${documentId}?locale=${locale}&${populateParams}`;
        return await fetcherJson(url, config, ctx);
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
