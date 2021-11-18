import {Shard} from "./Shard";
import {SessionHistoryEntry} from "./SessionHistoryEntry";
import {Environment} from "./Environment";
import {AppConfig} from "./AppConfig";
import {UserData} from "./UserData";

export class App {

    set userData(value: UserData) {
        this._userData = value;
    }
    get config(): AppConfig {
        return this._config;
    }

    set config(value: AppConfig) {
        this._config = value;
    }

    private static instance: App | undefined = undefined;

    public static appOrCreate: (config: AppConfig) => App = (config: AppConfig) => {
        if (App.instance === undefined) {
            App.instance = new App(config);
        }
        return App.instance;
    };

    public static app: () => App = () => {
        return App.instance as App;
    };

    private shards: Map<String, Shard> = new Map<String, Shard>();

    private _config: AppConfig;

    private _sessionID?: string;

    private _userData: UserData | undefined;

    constructor(config: AppConfig) {
        this._config = config;
    }

    public set sessionID(value: string) {
        window.localStorage.setItem("session-id", value);
        this._sessionID = value;
    }
    
    public getUserData(): UserData | undefined {
        return this._userData;
    }

    public getSessionID(): string | undefined {
        return this._sessionID;
    }

    public shouldBeLoggedIn(): boolean {
        return true;
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

    public useConnector<T>(action: (connector: Environment.Connector) => T): T | undefined {
        // Get or create default connector instance
        const connector = Environment.Connector.useConnector(this.config.connectorConfig.id, () => new Environment.Connector(this.config.connectorConfig));

        //
        connector.registerSocketEventHandler(Environment.SocketEventTypes.ONOPEN, {
            handle: ev => {

            },
            stator: false,
            usagesLeft: 1
        });

        // If the connector isn't


        return undefined;
    }


}
