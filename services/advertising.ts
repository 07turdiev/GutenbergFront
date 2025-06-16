import $api from "../http";
import {AxiosRequestConfig, AxiosResponse} from "axios";
import {IAdvertising} from "../models/IAdvertising";

export default class AdvertisingService {

    static async fetchAdvertising(locale: string, type: string, opt: AxiosRequestConfig = {}): Promise<AxiosResponse<IAdvertising>> {
        return await $api.get(locale + '/api/ads/' + type, opt)
    }
}