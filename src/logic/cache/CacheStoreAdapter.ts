export interface CacheStoreAdapter {

    get<T>(id: string): T | undefined;

    set<T>(id: string, value: T): void;

    remove(id: string): void;
}
