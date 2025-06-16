import

{createAsyncThunk} from "@reduxjs/toolkit";
import {AxiosRequestConfig} from "axios";
import {GetServerSidePropsContext} from "next";
import OrderService from "../../services/order";
import {IOrder} from "../../models/IOrder";
import {FetchParams} from "../../models/Actions/Params";

export const fetchOrders = createAsyncThunk(
    'order/fetchOrders',
    async ({locale, config, ctx} : FetchParams, thunkApi) => {
        try {
            const response = await OrderService.fetchOrders({locale, config, ctx})
            return {
                meta: response.data,
                results: response.data.results
            }

        }catch (err){
            return thunkApi.rejectWithValue('Ошибка при получение заказов')
        }
    }
)

export const createOrder = createAsyncThunk(
    'order/createOrder',
    async <FetchParams>({locale, data, opt, ctx} : { locale: string, data: IOrder, opt?: AxiosRequestConfig, ctx?: GetServerSidePropsContext}, thunkApi) => {
        try {
            await OrderService.createOrder(locale, data, opt, ctx)
        }catch (err){
            return thunkApi.rejectWithValue('Ошибка при получение заказов')
        }
    }
)
