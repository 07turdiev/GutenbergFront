import $api from "../http";
import {AxiosRequestConfig, AxiosResponse} from "axios";
import {IListResponse} from "../models/Response/IListResponse";
import {IGenre} from "../models/IGenre";

export default class GenreService {

    static async fetchGenres(locale: string, opt: AxiosRequestConfig = {}): Promise<AxiosResponse<IListResponse<IGenre[]>>> {
        return await $api.get(locale + '/api/genres/', opt)
    }

    static async fetchGenresList(locale: string, opt: AxiosRequestConfig = {}): Promise<AxiosResponse<IListResponse<IGenre[]>>> {
        return await $api.get(locale + '/api/genres/list', opt)
    }
}