import {Shard} from "./Shard";

export class App {

    private static instance: App | undefined = undefined;

    public static app: () => App = () => {
        if (App.instance === undefined) {
            App.instance = new App();
        }
        return App.instance;
    };

    private shards: Map<String, Shard> = new Map<String, Shard>();

    public shard<T extends Shard>(id: string, shard: T | undefined = undefined): T {
        if (!Array.from(this.shards.keys()).includes(id) && shard !== undefined) {
            this.shards.set(id, shard as T);
        }
        return this.shards.get(id) as T;
    }

    public main(): void {
        console.log("main")
    }
}
