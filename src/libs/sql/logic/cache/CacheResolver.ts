export interface CacheResolver<T> {
    resolve(id: string): T
}
