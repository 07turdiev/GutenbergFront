import {IUser} from "../../models/IUser";
import {createSlice, PayloadAction} from "@reduxjs/toolkit";
import {
    changeProfile, changeProfilePhoto,
    checkCurrentUser,
    loginUser,
    logoutUser,
    registerPhone,
    sendSmsCode,
    sendUserFields
} from "../actions/auth";
import {HYDRATE} from "next-redux-wrapper";


interface AuthState {
    currentUser: IUser | null;
    isLogin: boolean | null;
    activeStep: number;
    phoneNumber: string,
    loading: boolean;
    loadingPhoto: boolean;
    error: any;
}

const initialState: AuthState = {
    currentUser: null,
    activeStep: 0,
    phoneNumber: '',
    isLogin: null,
    loading: false,
    loadingPhoto: false,
    error: '',
}

export const authSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {},
    extraReducers: {

        [registerPhone.fulfilled.type]: (state, action: PayloadAction<string>) => {
            state.loading = false;
            state.error = '';
            state.activeStep = 1;
            state.phoneNumber = action.payload;
        },
        [registerPhone.pending.type]: (state) => {
            state.loading = true;
        },
        [registerPhone.rejected.type]: (state, action: PayloadAction<string>) => {
            state.loading = false;
            state.error =  action.payload;
        },

        [sendSmsCode.fulfilled.type]: (state, action: PayloadAction<string>) => {
            state.loading = false;
            state.activeStep = 2;
            state.error = '';
        },
        [sendSmsCode.pending.type]: (state, action: PayloadAction<string>) => {
            state.loading = true;
        },
        [sendSmsCode.rejected.type]: (state, action: PayloadAction<string>) => {
            state.loading = false;
            state.error = action.payload;
        },

        [sendUserFields.fulfilled.type]: (state, action: PayloadAction<string>) => {
            state.loading = false;
            state.activeStep = 3;
            state.error = '';
        },

        [sendUserFields.pending.type]: (state, action: PayloadAction<string>) => {
            state.loading = true;
        },

        [sendUserFields.rejected.type]: (state, action: PayloadAction<string>) => {
            state.loading = false;
            state.error = action.payload;
        },

        [loginUser.fulfilled.type]: (state, action: PayloadAction<IUser>) => {
            state.loading = false;
            state.error = '';
            state.isLogin = true
        },

        [loginUser.pending.type]: (state, action: PayloadAction) => {
            state.loading = true;
        },

        [loginUser.rejected.type]: (state, action: PayloadAction<string>) => {
            state.loading = false;
            state.error = action.payload;
        },

        [checkCurrentUser.fulfilled.type]: (state, action: PayloadAction<IUser>) => {
            state.loading = false;
            state.currentUser = action.payload;
            state.isLogin = true;
            state.error = ''
        },
        [checkCurrentUser.pending.type]: (state, action: PayloadAction<IUser>) => {
            state.loading = true;
        },
        [checkCurrentUser.rejected.type]: (state, action: PayloadAction<string>) => {
            state.loading = false;
            state.isLogin = false;
            state.error = action.payload
        },

        //Change profile
        [changeProfile.fulfilled.type]: (state, action: PayloadAction<IUser>) => {
            state.loading = false;
            state.currentUser = action.payload;
            state.error = ''
        },
        [changeProfile.pending.type]: (state, action: PayloadAction<IUser>) => {
            state.loading = true;
        },
        [changeProfile.rejected.type]: (state, action: PayloadAction<string>) => {
            state.loading = false;
            state.error = action.payload
        },

        [changeProfilePhoto.fulfilled.type]: (state, action: PayloadAction<IUser>) => {
            state.loadingPhoto = false;
            state.currentUser = action.payload;
            state.error = ''
        },
        [changeProfilePhoto.pending.type]: (state, action: PayloadAction<IUser>) => {
            state.loadingPhoto = true;
        },
        [changeProfilePhoto.rejected.type]: (state, action: PayloadAction<string>) => {
            state.loadingPhoto = false;
            state.error = action.payload
        },

        [logoutUser.fulfilled.type]: (state, action: PayloadAction<string>) => {
            state.loading = false;
            state.error = '';
            state.currentUser = null;
            state.isLogin = false;
        },

        // [HYDRATE]: (state, action) => {
        //     return {
        //         ...state,
        //         ...action.payload.authReducer,
        //     };
        // },

    }
})

export default authSlice.reducer;
