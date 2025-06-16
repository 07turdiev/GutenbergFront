import {GetServerSidePropsContext} from "next";
import $api from "./index";
import {AxiosRequestConfig} from "axios";

export const fetcherJson = async (url: string, config:AxiosRequestConfig, context: GetServerSidePropsContext) => {

    if(context){
        const token = context.req.cookies.token;
        config = {
            ...config,
            headers: {
                Authorizations: token ? `Bearer ${token}` : null
            }
        }
    }
    return await $api(url, config);
}
