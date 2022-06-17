import {Recipe} from "../Recipe";
import {EpicureAPI} from "../EpicureAPI";

export type Filter<T> = {
    id: string,
    type: string,
    data: T,
    filter: (recipe: Recipe, filter: Filter<T>, api: EpicureAPI) => boolean,
    filterPreviewRenderer: (data: T) => JSX.Element
}
