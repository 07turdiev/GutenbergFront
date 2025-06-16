import $api from "../http";
import {ITrack} from "../models/IAudio";
import {AxiosResponse} from "axios";

export default class AudioService {

    static async fetchAudioOne(locale: string, slug: string): Promise<AxiosResponse<ITrack>> {
          return await $api.get(locale + '/api/audio/' + slug)
    }

    static async addToMark(locale: string, slug: string, data: {
        lang: string;
        second: number;
    }): Promise<AxiosResponse<ITrack>> {
        return await $api.post(locale + '/api/audio/' + slug + '/bookmark', data)
    }
}