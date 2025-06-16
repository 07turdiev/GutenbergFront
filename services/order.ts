import {AxiosRequestConfig, AxiosResponse} from "axios";
import {GetServerSidePropsContext} from "next";
import {IListResponse} from "../models/Response/IListResponse";
import {fetcherJson} from "../http/fetcher";
import {IOrder} from "../models/IOrder";
import {FetchParams} from "../models/Actions/Params";

export default class OrderService {

    static async fetchOrders({locale, config, ctx} : FetchParams): Promise<AxiosResponse<IListResponse<IOrder[]>>> {
        return await fetcherJson(`${locale}/api/orders/`,config, ctx)
    }

    static async createOrder(locale: string, value: IOrder, opt: AxiosRequestConfig = {}, ctx?: GetServerSidePropsContext): Promise<AxiosResponse<IListResponse<IOrder[]>>> {
        return await fetcherJson(`${locale}/api/orders/create/`, opt = {
            ...opt,
            method: 'POST',
            data: value
        }, ctx)
    }

}