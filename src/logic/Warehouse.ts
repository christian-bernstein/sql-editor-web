import {WarehouseEntry} from "./WarehouseEntry";

export class Warehouse {

    private readonly data: Map<WarehouseEntry, any> = new Map<WarehouseEntry, any>();

    public subscribe<T>(key: string, listener: (val: T) => void) {

    }

}
