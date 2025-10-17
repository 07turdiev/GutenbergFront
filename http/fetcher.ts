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
        // Log the error for debugging
        console.error(`API Error for ${url}:`, error.message);
        console.error('Full error:', error);
        
        // For server-side rendering, we should let the error bubble up
        // so that getServerSideProps can handle it properly (return 404, etc.)
        if (context) {
            throw error;
        }
        
        // For client-side, return a mock response structure to prevent app crashes
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
