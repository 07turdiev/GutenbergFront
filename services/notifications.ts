import {FetchParams} from "../models/Actions/Params";
import {AxiosResponse} from "axios";
import {fetcherJson} from "../http/fetcher";
import {INotification} from "../models/INotification";

export default class NotificationsService {

    static async fetchNotifications({locale, config, ctx} : FetchParams): Promise<AxiosResponse<INotification>> {
        return await fetcherJson(`${locale}/api/notifications/`, config, ctx)
    }

    static async clearNotification({locale, config, ctx, value} : FetchParams): Promise<AxiosResponse<INotification>> {
        return await fetcherJson(`${locale}/api/notifications/${value}/mark-as-read`, {
            ...config,
            method: 'DELETE'
        }, ctx)
    }

}