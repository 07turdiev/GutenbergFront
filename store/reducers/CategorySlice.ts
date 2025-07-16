import {INovel} from "../../models/INovel";
import {createSlice, PayloadAction} from "@reduxjs/toolkit";
import {fetchNovelOne, fetchNovels} from "../actions/novel";
import {ICategory} from "../../models/ICategory";
import {fetchCategories, fetchCategoriesList} from "../actions/category";
import {IMeta} from "../../models/IMeta";
import {IListResponse} from "../../models/Response/IListResponse";
import {HYDRATE} from "next-redux-wrapper";
import {AppState, AppThunk} from "../store";

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



export const categorySlice = createSlice({
    name: 'category',
    initialState,
    reducers: {

    },


    extraReducers: {

        [fetchCategories.fulfilled.type]: (state, action: PayloadAction<IListResponse<ICategory[]>>) => {
            state.loading = false;
            state.error = '';
            state.categories = {
                results: action.payload.data,
                meta: {
                    links: {
                        next: null,
                        previous: null
                    },
                    count: action.payload.meta.pagination.total,
                    page_size: action.payload.meta.pagination.pageSize,
                    num_pages: action.payload.meta.pagination.pageCount,
                    current_page: action.payload.meta.pagination.page,
                    countItemsOnPage: action.payload.data.length
                }
            };
        },
        [fetchCategories.pending.type]: (state) => {
            state.loading = true;
        },
        [fetchCategories.rejected.type]: (state, action: PayloadAction<string>) => {
            state.loading = false;
            state.error =  action.payload;
        },

        [fetchCategoriesList.fulfilled.type]: (state, action: PayloadAction<ICategory[]>) => {
            state.loading = false;
            state.error = '';
            state.categoriesList = action.payload;
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


