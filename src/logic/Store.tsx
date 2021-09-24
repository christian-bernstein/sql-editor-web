import {v4} from "uuid";
import React, {Dispatch, SetStateAction} from "react";

export type Meta = {
    dispatches: Array<React.Dispatch<any>>
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

    public isSubscribed(key: string, dispatch: React.Dispatch<any>): boolean {
        const item: Meta | undefined = this.meta.get(key);
        let found: boolean = false;
        item?.dispatches.forEach((value, index) => {
            if (value === dispatch) {
                found =  true;
            }
        })
        return found;
    }

    public unsubscribe(key: string, dispatch: React.Dispatch<any>, triggerUpdate: boolean = true): Store {
        const item: Meta | undefined = this.meta.get(key);
        item?.dispatches.forEach((value, index) => {
            if (value === dispatch) {
                item.dispatches.splice(index, 1);
            }
        })
        return this;
    }

    public subscribe<T>(key: string, state: [T, React.Dispatch<T>]): [T, React.Dispatch<T>] {
        const meta: Meta | undefined = this.meta.get(key);
        if (meta !== undefined) {
            if (Array.from(meta.dispatches.values()).includes(state[1])) {
                console.error("dispatcher already registered")
                return state;
            }
            console.log("subscription not duplicate")
        }
        console.log("init subscription")
        if (this.get(key) !== undefined) {
            meta?.dispatches.push(state[1]);
            this.noopUpdate(key, state[1]);
            return [this.get<T>(key) as T, state[1]]
        } else {
            this.set<T>(key, state[0]);
            meta?.dispatches.push(state[1]);
            this.noopUpdate(key, state[1]);
            return state;
        }
    }

    private noopUpdate(key: string, dispatch: React.Dispatch<any>) {
        const val: any = this.get(key);
        dispatch(val);
    }

    public set<T>(key: string, val: T): T {

        console.log("key " + key + " changed to " + JSON.stringify(val))

        this.data.set(key, val);
        if (!this.meta.has(key)) {
            console.log("meta " + key + " will be created");
            this.meta.set(key, {
                dispatches: new Array<React.Dispatch<any>>()
            });
        }

        console.log("dispatches: " + this.meta.get(key)?.dispatches);

        this.meta.get(key)?.dispatches.forEach(dispatch => {
            console.log("call dispatch")
            dispatch.call(this, val);
        });
        return val;
    }
}
