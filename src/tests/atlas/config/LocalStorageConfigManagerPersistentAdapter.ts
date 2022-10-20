import {IConfigManagerPersistentAdapter} from "./IConfigManagerPersistentAdapter";

export class LocalStorageConfigManagerPersistentAdapter implements IConfigManagerPersistentAdapter {

    get(key: string): string | undefined {
        return window.localStorage.getItem(key) ?? undefined;
    }

    has(key: string): boolean {
        return window.localStorage.getItem(key) !== null;
    }

    set(key: string, value: string): void {
        return window.localStorage.setItem(key, value);
    }
}
