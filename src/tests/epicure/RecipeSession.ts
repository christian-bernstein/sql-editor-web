export type RecipeSession = {
    currentStep: number,
    ingredientChecked: Array<{
        name: string,
        checked: boolean
    }>
}
