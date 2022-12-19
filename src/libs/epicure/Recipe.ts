import {Ingredient} from "./Ingredient";
import {Step} from "./Step";
import Source from "./Source";

export type Recipe = {
    id: string,
    title: string,
    description: string,
    cookingTimeInMin: number,
    ingredients: Ingredient[],
    comment: string,
    kcal: number,
    categories: string[],
    steps: Step[],
    source?: Source
}
