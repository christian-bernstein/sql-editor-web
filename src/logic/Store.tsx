import {v4} from "uuid";
import React from "react";

export type Meta = {
    subscribedClassComponents: Array<React.Component<any, any>>
}

export default class Store {

    private readonly data: Map<string, any> = new Map<string, any>();

    private readonly meta: Map<string, Meta> = new Map<string, Meta>();

    private static stores: Map<string, Store> = new Map<string, Store>();

    public static store(cacheName: string, autoCreate: boolean = true): Store | undefined {
        if (Store.stores.has(cacheName)) {
            return Store.stores.get(cacheName);
        } else {
            if (autoCreate) {
                const cache: Store = new Store();
                Store.stores.set(cacheName, cache);
                return cache;
            }
            return undefined;
        }
    }

    public static optStore(cacheName: string): Store {
        if (Store.stores.has(cacheName)) {
            return Store.stores.get(cacheName) as Store;
        } else {
            const cache: Store = new Store(cacheName);
            Store.stores.set(cacheName, cache);
            return cache;
        }
    }

    public static defStore(): Store {
        return Store.optStore("default");
    }

    constructor(cacheName: string = v4()) {
        Store.stores.set(cacheName, this);
    }

    public get<T>(key: string): T | undefined {
        return this.data.get(key);
    }

    public getOrSet<T>(key: string, defaultVal: T): T | undefined {
        if (this.data.has(key)) {
            return this.data.get(key);
        } else {
            this.set(key, defaultVal);
            return defaultVal;
        }
    }

    public set<T>(key: string, val: T): T {
        this.data.set(key, val);
        if (!this.meta.has(key)) {
            this.meta.set(key, {
                subscribedClassComponents: new Array<React.Component<any, any>>()
            });
        }
        this.forceUpdate(key);
        return val;
    }

    public isSubscribed(key: string, component: React.Component<any, any>): boolean {
        const item: Meta | undefined = this.meta.get(key);
        let found: boolean = false;
        item?.subscribedClassComponents.forEach((value, index) => {
            if (value === component) {
                found =  true;
            }
        })
        return found;
    }

    public unsubscribe(key: string, component: React.Component<any, any>, triggerUpdate: boolean = true): Store {
        const item: Meta | undefined = this.meta.get(key);
        item?.subscribedClassComponents.forEach((value, index) => {
            if (value === component) {
                item.subscribedClassComponents.splice(index, 1);
            }
        })
        return this;
    }

    public subscribe<T>(key: string, val: T, component: React.Component<any, any>): Store {
        const meta: Meta | undefined = this.meta.get(key);
        if (meta !== undefined) {
            if (Array.from(meta.subscribedClassComponents.values()).includes(component)) {
                return this;
            }
        }
        if (this.get(key) !== undefined) {
            meta?.subscribedClassComponents.push(component);
            this.forceUpdate(key);
            return this;
        } else {
            this.set<T>(key, val);
            meta?.subscribedClassComponents.push(component);
            this.forceUpdate(key);
            return this;
        }
    }

    private forceUpdate(key: string) {
        this.meta.get(key)?.subscribedClassComponents.forEach(value => {
            value.forceUpdate();
        })
    }
}
