export type WarehouseEntry = {
    key: string,
    changeListeners: ((val: any) => void)[]
}
