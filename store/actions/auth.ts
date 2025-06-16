import {createAsyncThunk} from "@reduxjs/toolkit";
import AuthService from "../../services/auth";
import errorCatcher from "../../utils/errorCatcher";
import {setCookies, removeCookies} from "cookies-next";
import {AxiosRequestConfig} from "axios";
import {GetServerSidePropsContext} from "next";
import {toast} from "react-toastify";

//Registration

export const registerPhone = createAsyncThunk(
    'user/registerPhone',
    async (email: string, thunkApi) => {
        try {
            await AuthService.sendSms(email)
            return email
        }catch (err){
            return errorCatcher(err, thunkApi)
        }
    }
)

export const sendSmsCode = createAsyncThunk(
    'user/sendSmsCode',
    async (values: {code: number, phone: string}, thunkApi) => {
        try {
            await AuthService.sendCode(values.code, values.phone)
        }catch (err){
            return errorCatcher(err, thunkApi)
        }
    }
)

export const sendUserFields= createAsyncThunk(
    'user/sendUserFieldsCode',
    async (values: any, thunkApi) => {
        try {
            await AuthService.sendUserFields(values)
        }catch (err){
            return errorCatcher(err, thunkApi)
        }
    }
)


//Login

export const loginUser = createAsyncThunk(
    'user/login',
    async (values: {username: string, password: string}, thunkApi) => {
        try {
            const response = await AuthService.login(values)
            setCookies('token', response.data.access_token, { maxAge: 24*60*60*30});
        }catch (err){
            return errorCatcher(err, thunkApi)
        }
    }
)


export const checkCurrentUser = createAsyncThunk(
    'user/checkCurrentUser',
    async (option : {opt?: AxiosRequestConfig, ctx?: GetServerSidePropsContext} = {}, thunkApi) => {
        try {
            const response = await AuthService.checkCurrentUser(option.opt, option.ctx)
            return  response.data
        }catch (err){
            return thunkApi.rejectWithValue('Ошибка соеденинения')
        }
    }
)

export const logoutUser = createAsyncThunk(
    'user/logout',
    async (_, thunkApi) => {
        try {
            await AuthService.logout();
            removeCookies('token');
            //localStorage.clear();
        }catch (err){
            return errorCatcher(err, thunkApi)
        }
    }
)

//Change profile

export const changeProfilePhoto = createAsyncThunk(
    'user/changeProfilePhoto',
    async (fields : any, thunkApi) => {
        try {
            const response = await AuthService.changeProfile(fields)
            return response.data.data
        }catch (err){
            return errorCatcher(err, thunkApi)
        }
    }
)

export const changeProfile = createAsyncThunk(
    'user/changeProfile',
    async (fields : any, thunkApi) => {
        try {
            const response = await AuthService.changeProfile(fields)
            toast.success('Профиль успешно изменён', {
                position: 'bottom-center',
                theme: 'dark',
                hideProgressBar: true
            })
            return response.data.data
        }catch (err){
            return thunkApi.rejectWithValue(err?.response?.data?.message)
        }
    }
)

export const changeProfilePassword = createAsyncThunk(
    'user/changeProfilePassword',
    async (fields : any, thunkApi) => {
        try {
            const response = await AuthService.changeProfilePassword(fields)
            toast.success('Пароль изменён', {
                position: "bottom-center",
                theme: 'dark'
            })
            return response.data
        }catch (err){
            errorCatcher(err, thunkApi)
        }
    }
)

