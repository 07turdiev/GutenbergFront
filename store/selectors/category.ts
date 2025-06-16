import { createSelector } from '@reduxjs/toolkit'
import { AppState } from "../store";


export const selectCategories = (state:AppState) => state?.categoryReducer;


export const selectCategoryOptions = createSelector(selectCategories, (categories) => {
    const categoriesOption =  categories.categoriesList.map((category) => {
        return {
            value: category.slug,
            label: category.name
        }
    })
    return  {
        categoriesOption
    };
})
