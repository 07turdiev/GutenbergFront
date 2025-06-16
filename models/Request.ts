import {AxiosRequestConfig} from "axios";

export interface RequestConfigOne {
    locale: string;
    slug: string;
    opt?: AxiosRequestConfig;
}