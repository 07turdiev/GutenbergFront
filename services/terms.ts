import {AxiosResponse} from "axios";
import {FetchParams} from "../models/Actions/Params";
import {ITermsResponse} from "../models/ITerms";
import {fetcherJson} from "../http/fetcher";

export default class TermsService {
    static async fetchTerms({locale, config, ctx}: FetchParams): Promise<AxiosResponse<ITermsResponse>> {
        return await fetcherJson(`/api/foydalanish-shartlari?locale=${locale}&populate=Brendbook`, config, ctx)
    }
}
