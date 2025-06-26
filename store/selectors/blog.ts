import {AppState} from "../store";
import {IBlogPost} from "../../models/IBlog";

export const selectBlogPosts = (state: AppState): IBlogPost[] => state.blogReducer.posts;
export const selectCurrentBlogPost = (state: AppState): IBlogPost | null => state.blogReducer.currentPost;
export const selectPopularBlogPosts = (state: AppState): IBlogPost[] => state.blogReducer.popularPosts;
export const selectLatestBlogPosts = (state: AppState): IBlogPost[] => state.blogReducer.latestPosts;
export const selectBlogLoading = (state: AppState): boolean => state.blogReducer.loading;
export const selectBlogError = (state: AppState): string => state.blogReducer.error;
export const selectBlogTotalPages = (state: AppState): number => state.blogReducer.totalPages;
export const selectBlogCurrentPage = (state: AppState): number => state.blogReducer.currentPage;
export const selectBlogTotalCount = (state: AppState): number => state.blogReducer.totalCount; 