import {CacheResolver} from "./CacheResolver";
import {ResolveType} from "./ResolveType";

export type CacheRequestConfig<T> = {
    id: string,
    fallback: T | null | undefined,
    decay: number,
    resolver: CacheResolver<T>,
    onResolve: (value: T | null | undefined, type: ResolveType) => void,
}
