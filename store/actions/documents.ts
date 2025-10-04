import {createAsyncThunk} from "@reduxjs/toolkit";
import DocumentsService from "../../services/documents";
import {FetchParams} from "../models/Actions/Params";
import {adaptDocumentsData} from "../../utils/strapiAdapter";

export const fetchDocuments = createAsyncThunk(
    'documents/fetchDocuments',
    async ({locale, config, ctx} : FetchParams, thunkApi) => {
        try {
            const response = await DocumentsService.fetchDocuments({locale, config, ctx})
            return adaptDocumentsData(response.data)

        }catch (err){
            console.error('fetchDocuments error:', err);
            return thunkApi.rejectWithValue('Error fetching documents data')
        }
    }
)
