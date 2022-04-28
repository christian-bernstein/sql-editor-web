import {CacheConfig} from "./CacheConfig";
import {CacheRequestConfig} from "./CacheRequestConfig";
import {ResolveType} from "./ResolveType";
import {CacheStoreAdapter} from "./CacheStoreAdapter";

export class Cache {

    private config: CacheConfig;

    constructor(config: CacheConfig) {
        this.config = config;
    }

    public cache<T>(request: CacheRequestConfig<T>): void {
        const adapter = this.config.adapter;
        let value = adapter.get<T>(request.id);
        if (value !== undefined) {
            request.onResolve(value, ResolveType.FINAL);
        } else {
            request.onResolve(request.fallback, ResolveType.FALLBACK);

            try {
                value = request.resolver.resolve(request.id);
            } catch (e) {
                console.error(e);
                request.onResolve(null, ResolveType.ERROR);
                return;
            }

            if (request.decay > 0) {
                setTimeout(() => {
                    adapter.remove(request.id);
                }, request.decay);
            }

            request.onResolve(value, ResolveType.FINAL);
        }
    }

    public static memory(prefix: string = ""): CacheStoreAdapter {
        return new class implements CacheStoreAdapter {

            private readonly store: Map<string, any> = new Map<string, any>();

            private readonly prefix: string = prefix;

            get<T>(id: string): T | undefined {
                return this.store.get(this.id(id));
            }

            remove(id: string): void {
                this.store.delete(this.id(id));
            }

            set<T>(id: string, value: T): void {
                this.store.set(this.id(id), value);
            }

            private id(id: string) {
                return `${this.prefix}${id}`
            }
        }
    }
}
