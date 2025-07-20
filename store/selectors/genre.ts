import { createSelector } from '@reduxjs/toolkit'
import { AppState } from "../store";


export const selectCategories = (state:AppState) => state.categoryReducer

export const selectCategoryOptions = createSelector(selectCategories, (categories) => {
    console.log('DEBUG categoriesList:', categories.categoriesList);
    const categoriesOptions =  categories.categoriesList.map((category) => {
        return {
            value: category.slug,
            label: category.Nomi || category.name
        }
    })
    return  {
        categoriesOption: categoriesOptions
    };
})