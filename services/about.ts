import {AxiosResponse} from "axios";
import {FetchParams} from "../models/Actions/Params";
import {IAbout, IContacts, ISocial, IStatistics} from "../models/IAbout";
import {fetcherJson} from "../http/fetcher";

export default class AboutService {

    static async fetchAbout({locale, config, ctx}: FetchParams): Promise<AxiosResponse<IAbout>> {
        return await fetcherJson(`${locale}/api/about/`,config, ctx)
    }

    static async fetchContacts({locale, config, ctx}: FetchParams): Promise<AxiosResponse<IContacts>> {
        return await fetcherJson(`${locale}/api/about/contacts`,config, ctx)
    }

    static async fetchSocialLinks({locale, config, ctx}: FetchParams): Promise<AxiosResponse<ISocial>> {
        return await fetcherJson(`${locale}/api/about/social-links`,config, ctx)
    }

    static async fetchStatistics({locale, config, ctx}: FetchParams): Promise<AxiosResponse<IStatistics>> {
        return await fetcherJson(`${locale}/api/about/statistics`,config, ctx)
    }
}