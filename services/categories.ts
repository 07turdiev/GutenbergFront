import $api from "../http";
import {AxiosRequestConfig, AxiosResponse} from "axios";
import {ICategory} from "../models/ICategory";
import {IListResponse} from "../models/Response/IListResponse";

export default class CategoriesService {

    static async fetchCategories(locale: string, opt: AxiosRequestConfig = {}): Promise<AxiosResponse<IListResponse<ICategory[]>>> {
        return await $api.get(locale + '/api/categories/', opt)
    }


    static async fetchCategoriesList(locale: string, opt: AxiosRequestConfig = {}): Promise<AxiosResponse<ICategory[]>> {
        return await $api.get(locale + '/api/categories/list', opt)
    }
}