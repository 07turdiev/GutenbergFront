import {IMeta} from "../IMeta";

export interface IListResponse<T> {
    meta: IMeta;
    results: T;
}