import $api from "../http";
import {AxiosRequestConfig, AxiosResponse} from "axios";
import {IListResponse} from "../models/Response/IListResponse";
import {ICategory} from "../models/ICategory";

export default class CategoryService {

    static async fetchCategories(locale: string, opt: AxiosRequestConfig = {}): Promise<AxiosResponse<IListResponse<ICategory[]>>> {
        return await $api.get(locale + '/api/kategoriyas/', opt)
    }

    static async fetchCategoriesList(locale: string, opt: AxiosRequestConfig = {}): Promise<AxiosResponse<IListResponse<ICategory[]>>> {
        return await $api.get(locale + '/api/kategoriyas/', opt)
    }
}