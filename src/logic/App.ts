import {Shard} from "./Shard";
import {SessionHistoryEntry} from "./SessionHistoryEntry";

export class App {

    private static instance: App | undefined = undefined;

    public static app: () => App = () => {
        if (App.instance === undefined) {
            App.instance = new App();
        }
        return App.instance;
    };

    private shards: Map<String, Shard> = new Map<String, Shard>();

    private _sessionID?: string;

    public set sessionID(value: string) {
        this._sessionID = value;
    }

    public getSessionID(): string | undefined {
        return this._sessionID;
    }

    public shard<T extends Shard>(id: string, shard: T | undefined = undefined): T {
        if (!Array.from(this.shards.keys()).includes(id) && shard !== undefined) {
            this.shards.set(id, shard as T);
        }
        return this.shards.get(id) as T;
    }

    public getLastSessionHistoryEntry(): SessionHistoryEntry | undefined {
        const entries = this.getSessionHistoryEntries(1);
        if (entries.length > 1) {
            return undefined;
        } else {
            return entries[0];
        }
    }

    public getSessionHistoryEntries(maxCount: number): Array<SessionHistoryEntry> {
        const she: string | null = window.localStorage.getItem("session-history-entries");
        if (she === null) {
            return [];
        } else {
            const sheObj: Array<SessionHistoryEntry> = JSON.parse(she);
            return sheObj.slice(0, maxCount);
        }
    }
}
