import { AppState } from "../store";
import { ITeamMember } from "../../models/ITeam";
import { IMeta } from "../../models/IMeta";

export const selectTeamMembers = (state: AppState): ITeamMember[] => state.teamReducer.teamMembers.results;
export const selectTeamMeta = (state: AppState): IMeta | null => state.teamReducer.teamMembers.meta;
export const selectTeamLoading = (state: AppState): boolean => state.teamReducer.loading;
export const selectTeamError = (state: AppState): string => state.teamReducer.error; 