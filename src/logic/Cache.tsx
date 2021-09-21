import {v4} from "uuid";
import React, {Dispatch, SetStateAction} from "react";

export type Meta = {}

export default class Cache {

    private readonly data: Map<string, any> = new Map<string, any>();

    private readonly meta: Map<string, Meta> = new Map<string, Meta>();

    private static caches: Map<string, Cache> = new Map<string, Cache>();

    public static cache(cacheName: string, autoCreate: boolean = true): Cache | undefined {
        if (Cache.caches.has(cacheName)) {
            return Cache.caches.get(cacheName);
        } else {
            if (autoCreate) {
                const cache: Cache = new Cache();
                Cache.caches.set(cacheName, cache);
                return cache;
            }
            return undefined;
        }
    }

    public static optCache(cacheName: string): Cache {
        if (Cache.caches.has(cacheName)) {
            return Cache.caches.get(cacheName) as Cache;
        } else {
            const cache: Cache = new Cache();
            Cache.caches.set(cacheName, cache);
            return cache;
        }
    }

    constructor(cacheName: string = v4()) {
        Cache.caches.set(cacheName, this);
    }

    public get<T>(key: string): T | undefined {
        return this.data.get(key);
    }

    public getOrSet<T>(key: string, defaultVal: T): T | undefined {
        if (this.data.has(key)) {
            return this.data.get(key);
        } else {
            this.data.set(key, defaultVal);
            return defaultVal;
        }

    }

    public set<T>(key: string, val: T): T {
        this.data.set(key, val);
        if (!this.meta.has(key)) {
            this.meta.set(key, {});
        }
        return val;
    }
}
