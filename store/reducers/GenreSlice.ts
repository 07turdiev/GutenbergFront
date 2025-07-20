import {createSlice, PayloadAction} from "@reduxjs/toolkit";
import {ICategory} from "../../models/ICategory";
import {IMeta} from "../../models/IMeta";
import {IListResponse} from "../../models/Response/IListResponse";
import {HYDRATE} from "next-redux-wrapper";
import {fetchCategories, fetchCategoriesList} from "../actions/genre";

interface CategoryState {
    categories: {
        results: ICategory[];
        meta: IMeta | null;
    };
    categoriesList: ICategory[];
    loading: boolean;
    error: string;
}

const initialState: CategoryState = {
    categories: {
        results: [],
        meta: null
    },
    categoriesList: [],
    loading: false,
    error: '',
}

function adaptStrapiMetaToIMeta(meta): IMeta {
    if (!meta || !meta.pagination) return null;
    return {
        links: {
            next: null,
            previous: null
        },
        count: meta.pagination.total,
        page_size: meta.pagination.pageSize,
        num_pages: meta.pagination.pageCount,
        current_page: meta.pagination.page,
        countItemsOnPage: meta.pagination.pageSize
    };
}

export const categorySlice = createSlice({
    name: 'category',
    initialState,
    reducers: {},
    extraReducers: {
        [fetchCategories.fulfilled.type]: (state, action: PayloadAction<IListResponse<ICategory[]>>) => {
            state.loading = false;
            state.error = '';
            state.categories.results = action.payload.data;
            state.categories.meta = adaptStrapiMetaToIMeta(action.payload.meta);
        },
        [fetchCategories.pending.type]: (state) => {
            state.loading = true;
        },
        [fetchCategories.rejected.type]: (state, action: PayloadAction<string>) => {
            state.loading = false;
            state.error =  action.payload;
        },

        [fetchCategoriesList.fulfilled.type]: (state, action: PayloadAction<any>) => {
            state.loading = false;
            state.error = '';
            state.categoriesList = Array.isArray(action.payload.data) ? action.payload.data : action.payload;
        },
        [fetchCategoriesList.pending.type]: (state) => {
            state.loading = true;
        },
        [fetchCategoriesList.rejected.type]: (state, action: PayloadAction<string>) => {
            state.loading = false;
            state.error =  action.payload;
        },

        [HYDRATE]: (state, action) => {
            return {
                ...state,
                ...action.payload.categoryReducer,
            };
        },
    }
})

export default categorySlice.reducer;