export type RecipeSession = {
    currentStep: number,
    rating?: number,
    ingredientChecked: Array<{
        name: string,
        checked: boolean
    }>
}
