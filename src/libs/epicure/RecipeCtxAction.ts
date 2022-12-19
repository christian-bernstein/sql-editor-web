import {Recipe} from "./Recipe";

export type RecipeCtxAction<T> = {
    on: (recipe: Recipe, param?: T) => void
}
