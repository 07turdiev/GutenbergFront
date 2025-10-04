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
    
    try {
        return await $api(url, config);
    } catch (error) {
        // Log the error for debugging but don't crash the app
        console.error(`API Error for ${url}:`, error.message);
        
        // Return a mock response structure to prevent app crashes
        return {
            data: {
                data: [],
                meta: {
                    pagination: {
                        page: 1,
                        pageSize: 10,
                        pageCount: 0,
                        total: 0
                    }
                }
            },
            status: 200,
            statusText: 'OK',
            headers: {},
            config: config,
            request: {}
        };
    }
}
