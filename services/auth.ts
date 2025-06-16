import $api from "../http";
import {IUser, UserToken} from "../models/IUser";
import {AxiosRequestConfig, AxiosResponse} from "axios";
import {fetcherJson} from "../http/fetcher";
import {GetServerSidePropsContext} from "next";

export default class AuthService {
    static async sendSms(email: string): Promise<void> {
        return await $api.post('api/users/send-code/', {email})
    }

    static async sendCode(code: number, email: string): Promise<void> {
        return await $api.post('api/users/sms-confirmation/', {code, email})
    }

    static async sendUserFields(values): Promise<void> {
        return await $api.post('api/users/registration/', values)
    }

    static async login(values: {username: string, password: string}): Promise<AxiosResponse<UserToken>> {
        return await $api.post('api/users/login/', values)
    }

    static async checkCurrentUser(opt: AxiosRequestConfig = {}, ctx?: GetServerSidePropsContext): Promise<AxiosResponse<IUser>> {
        return await fetcherJson(`api/users/whoAmI/`, opt, ctx)
    }

    static async logout(): Promise<void> {
        return await $api.get('api/users/logout/')
    }

    static async changeProfile(fields) {
        return await $api.patch('api/users/retrieve/', fields)
    }

    static async changeProfilePassword(fields) {
        return await $api.patch('api/users/change_password/', fields)
    }
}
