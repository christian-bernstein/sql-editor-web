import {App} from "./App";
import {QuickActionShard} from "../../shards/quickAction/QuickActionShard";

export class AppShortcuts {

    private readonly app: App;

    constructor(app: App) {
        this.app = app;
    }

    public quickActionsShard(): QuickActionShard {
        return this.app.shard("quick-actions-shard");
    }
}
