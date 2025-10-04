import {AxiosResponse} from "axios";
import {FetchParams} from "../models/Actions/Params";
import {IPrivacyResponse} from "../models/IPrivacy";
import {fetcherJson} from "../http/fetcher";

export default class PrivacyService {
    static async fetchPrivacy({locale, config, ctx}: FetchParams): Promise<AxiosResponse<IPrivacyResponse>> {
        return await fetcherJson(`/api/maxfiylik-siyosati?locale=${locale}`, config, ctx)
    }
}
