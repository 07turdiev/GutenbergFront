import {createSlice, PayloadAction} from "@reduxjs/toolkit";
import {HYDRATE} from "next-redux-wrapper";
import {IDocument} from "../../models/IDocuments";
import {fetchDocuments} from "../actions/documents";

interface DocumentsState {
    data: IDocument[];
    loading: boolean;
    error: string;
}

const initialState: DocumentsState = {
    data: [],
    loading: false,
    error: ''
}

export const documentsSlice = createSlice({
    name: 'documents',
    initialState,
    reducers: {},
    extraReducers: {
        [fetchDocuments.fulfilled.type]: (state, action: PayloadAction<IDocument[]>) => {
            state.loading = false;
            state.error = '';
            state.data = action.payload
        },
        [fetchDocuments.pending.type]: (state) => {
            state.loading = true;
        },
        [fetchDocuments.rejected.type]: (state, action: PayloadAction<string>) => {
            state.loading = false;
            state.error = action.payload;
        },

        [HYDRATE]: (state, action) => {
            return {
                ...state,
                ...action.payload.documentsReducer,
            };
        },
    }
})

export default documentsSlice.reducer;
