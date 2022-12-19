import {IConfigManagerPersistentAdapter} from "./IConfigManagerPersistentAdapter";

export class ConfigManager {

    private persistentAdapter: IConfigManagerPersistentAdapter;

    private changeListeners: Map<string, ((config: any) => void)[]> = new Map<string, ((config: any) => void)[]>();

    constructor(persistentAdapter: IConfigManagerPersistentAdapter) {
        this.persistentAdapter = persistentAdapter;
    }

    public init(initializer: (manager: ConfigManager) => void) {
        initializer(this);
    }

    public loadConfig<T>(id: string, def?: T): T {
        if (!this.persistentAdapter.has(id)) {
            if (def === undefined) {
                throw new Error(`loadConfig hasn't found a config for ${id}`);
            }
            this.setConfig(id, def);
            return def;
        }
        return JSON.parse(this.persistentAdapter.get(id) ?? "");
    }

    public setConfig<T>(id: string, config: T): T {
        this.persistentAdapter.set(id, JSON.stringify(config));
        this.changeListeners.get(id)?.forEach(listener => {
            listener(config);
        });
        return config;
    }

    public updateConfig<T>(id: string, updater: (config: T) => T) {
        this.setConfig(id, updater(this.loadConfig(id)));
    }

    public hasConfig(id: string): boolean {
        return this.persistentAdapter.has(id);
    }

    public registerChangeListener<T>(id: string, handler: (config: T) => void) {
        const cl = this.changeListeners.get(id);
        if (cl === undefined) {
            this.changeListeners.set(id, [handler]);
            return;
        }
        cl.push(handler);
    }
}
