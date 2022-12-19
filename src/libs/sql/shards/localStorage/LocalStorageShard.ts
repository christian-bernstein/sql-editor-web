import {Shard} from "../../logic/misc/Shard";

export class LocalStorageShard extends Shard {

    public save<T>(category: string, id: string, value: T, overwrite: boolean = true): T {
        const key = category + ":" + id;
        const item = window.localStorage.getItem(key);
        if (overwrite || item === null) {

            console.log("saving..", JSON.stringify(value))

            window.localStorage.setItem(key, JSON.stringify(value))
        }
        return value;
    }

    public get<T>(category: string, id: string, defaultValue: T): T {
        const key = category + ":" + id;
        const item = window.localStorage.getItem(key);
        if (item !== null) {
            return JSON.parse(item);
        } else {
            return defaultValue;
        }
    }
}
