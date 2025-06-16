import {AxiosRequestConfig} from "axios";
import {GetServerSidePropsContext} from "next";

export interface FetchParams {
    locale: string;
    slug?: string;
    config?: AxiosRequestConfig;
    ctx?: GetServerSidePropsContext;
    value?: any
}