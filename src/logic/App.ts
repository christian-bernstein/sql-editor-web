import {UserData} from "./UserData";
import {Shard} from "./Shard";

let instance: App | undefined = undefined;

export let app: () => App = () => {
    if (instance === undefined) {
        instance = new App();
    }
    return instance;
};

export class App {

    private shards: Map<String, Shard> = new Map<String, Shard>();

    public shard<T extends Shard>(id: string, shard: T | undefined = undefined): T {
        if (!Array.from(this.shards.keys()).includes(id) && shard !== undefined) {
            this.shards.set(id, shard as T);
        }
        return this.shards.get(id) as T;
    }

    public main(): void {

    }
}
