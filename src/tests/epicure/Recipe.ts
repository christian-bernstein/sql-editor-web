import {Ingredient} from "./Ingredient";

export type Recipe = {
    title: string,
    description: string,
    cookingTimeInMin: number,
    ingredients: Ingredient[],
    comment: string,
    kcal: number,
    categories: string[]
}
