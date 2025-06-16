import $api from "../http";
import {AxiosRequestConfig, AxiosResponse} from "axios";
import {IListResponse} from "../models/Response/IListResponse";
import {IReader} from "../models/IReader";

export default class ReaderService {

    static async fetchReaders(locale: string, opt: AxiosRequestConfig = {}): Promise<AxiosResponse<IListResponse<IReader[]>>> {
        return await $api.get(locale + '/api/readers/', opt)
    }

    static async fetchReaderOne(locale: string, slug: string, opt: AxiosRequestConfig = {}): Promise<AxiosResponse<IReader>> {
        return await $api.get(locale + '/api/readers/' + slug, opt)
    }
}