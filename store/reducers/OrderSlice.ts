import {createSlice, PayloadAction} from "@reduxjs/toolkit";
import {IMeta} from "../../models/IMeta";
import {IListResponse} from "../../models/Response/IListResponse";
import {HYDRATE} from "next-redux-wrapper";
import {IOrder} from "../../models/IOrder";
import {createOrder, fetchOrders} from "../actions/order";

interface ReaderState {
    orders: {
        results: IOrder[];
        meta: IMeta | null;
    };
    create: boolean;
    loading: boolean;
    error: string;
}

const initialState: ReaderState = {
    orders: {
        results: [],
        meta: null
    },
    create: false,
    loading: false,
    error: '',
}

export const orderSlice = createSlice({
    name: 'order',
    initialState,
    reducers: {},
    extraReducers: {

        [fetchOrders.fulfilled.type]: (state, action: PayloadAction<IListResponse<IOrder[]>>) => {
            state.loading = false;
            state.error = '';
            state.orders.results = action.payload.data;
            state.orders.meta = {
                links: {
                    next: null,
                    previous: null
                },
                count: action.payload.meta.pagination.total,
                page_size: action.payload.meta.pagination.pageSize,
                num_pages: action.payload.meta.pagination.pageCount,
                current_page: action.payload.meta.pagination.page,
                countItemsOnPage: action.payload.data.length
            };
        },
        [fetchOrders.pending.type]: (state) => {
            state.loading = true;
        },
        [fetchOrders.rejected.type]: (state, action: PayloadAction<string>) => {
            state.loading = false;
            state.error =  action.payload;
        },

        [createOrder.fulfilled.type]: (state, action: PayloadAction<string>) => {
            state.loading = false;
            state.create = true;
            state.error = '';
        },
        [createOrder.pending.type]: (state) => {
            state.loading = true;
        },
        [createOrder.rejected.type]: (state, action: PayloadAction<string>) => {
            state.loading = false;
            state.error =  action.payload;
        },


        [HYDRATE]: (state, action) => {
            return {
                ...state,
                ...action.payload.orderReducer,
            };
        },
    }
})

export default orderSlice.reducer;