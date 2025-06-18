import {AxiosResponse} from "axios";
import {FetchParams} from "../models/Actions/Params";
import {IAbout, IContacts, ISocial, IStatistics} from "../models/IAbout";
import {fetcherJson} from "../http/fetcher";

export default class AboutService {

    static async fetchAbout({locale, config, ctx}: FetchParams): Promise<AxiosResponse<IAbout>> {
        return await fetcherJson(`/api/biz-haqimizda?locale=${locale}`, config, ctx)
    }

    static async fetchContacts({locale, config, ctx}: FetchParams): Promise<AxiosResponse<IContacts>> {
        return await fetcherJson(`/api/aloqa?locale=${locale}`, config, ctx)
    }

    static async fetchSocialLinks({locale, config, ctx}: FetchParams): Promise<AxiosResponse<ISocial>> {
        return await fetcherJson(`/api/ijtimoiy-tarmoqlar?locale=${locale}`, config, ctx)
    }

    static async fetchStatistics({locale, config, ctx}: FetchParams): Promise<AxiosResponse<IStatistics>> {
        return await fetcherJson(`/api/statistika?locale=${locale}`, config, ctx)
    }
}