export type AssemblyRequest = {
    component: string,
    param?: any,
    errorComponent?: (e: any) => JSX.Element,
}
