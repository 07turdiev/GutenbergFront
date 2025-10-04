import {AxiosResponse} from "axios";
import {FetchParams} from "../models/Actions/Params";
import {IDocumentsResponse} from "../models/IDocuments";
import {fetcherJson} from "../http/fetcher";

export default class DocumentsService {
    static async fetchDocuments({locale, config, ctx}: FetchParams): Promise<AxiosResponse<IDocumentsResponse>> {
        return await fetcherJson(`/api/hujjatlars?locale=${locale}&populate=Rasmi`, config, ctx)
    }
}
