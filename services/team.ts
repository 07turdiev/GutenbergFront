import { AxiosResponse } from "axios";
import { IListResponse } from "../models/Response/IListResponse";
import { ITeamMember } from "../models/ITeam";
import { fetcherJson } from "../http/fetcher";
import { FetchParams } from "../models/Actions/Params";

export default class TeamService {
    static async fetchTeamMembers({locale, config, ctx}: FetchParams): Promise<AxiosResponse<IListResponse<ITeamMember[]>>> {
        const populateParams = "populate=rasmi";
        return await fetcherJson(`/api/jamoa-azolaris?locale=${locale}&${populateParams}`, config, ctx);
    }
} 