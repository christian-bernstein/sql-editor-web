import {Shard} from "./Shard";
import {SessionHistoryEntry} from "./SessionHistoryEntry";
import {Environment} from "./Environment";
import {AppConfig} from "./AppConfig";
import {UserData} from "./UserData";
import {CredentialsLoginResponsePacketData} from "../pages/login/CredentialsLoginResponsePacketData";
import {Credentials} from "../pages/login/Credentials";
import {CredentialsCheckResultType} from "../pages/login/CredentialsCheckResultType";
import {SessionIDLoginResponsePacketData} from "../pages/login/SessionIDLoginResponsePacketData";
import {SessionIDCheckResultType} from "../pages/login/SessionIDCheckResultType";
import {ValidateSessionsPacketData} from "./ValidateSessionsPacketData";

export class App {

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

    private actions: Map<String, Array<() => void>> = new Map<String, Array<() => void>>();

    constructor(config: AppConfig) {
        this._config = config;
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

    public getSessionHistoryEntries(maxCount: number | undefined = undefined): Array<SessionHistoryEntry> {
        const she: string | null = window.localStorage.getItem("session-history-entries");
        if (she === null) {
            return [];
        } else {
            try {
                const sheObj: Array<SessionHistoryEntry> = JSON.parse(she);
                return sheObj.slice(0, maxCount);
            } catch (e) {
                console.error(e);
                // Local storage array invalid, reset it to a default value
                window.localStorage.setItem("session-history-entries", JSON.stringify([]));
                return [];
            }
        }
    }

    public addSessionHistoryEntry(entry: SessionHistoryEntry) {
        let entries: Array<SessionHistoryEntry> = this.getSessionHistoryEntries();
        if (entries.filter(ent => ent.profileData.id === entry.profileData.id).length > 0) {
            // There is at least one entry in the history log with the same id as the new entry
            entries = entries.filter(ent => ent.profileData.id === entry.profileData.id)
        }
        entries.push(entry);
        window.localStorage.setItem("session-history-entries", JSON.stringify(entries));
    }

    public removeInvalidSessionHistoryEntries(then: (() => void) | undefined = undefined) {
        const mappedSessionUUIDs: Array<string> = this.getSessionHistoryEntries().map(entry => entry.sessionID);

        this.connector(connector1 => {
            connector1.call({
                protocol: "login",
                packetID: "ValidateSessionsPacketData",
                data: {
                    sessions: mappedSessionUUIDs
                },
                callback: {
                    handle: (connector2, packet) => {
                        const data = packet.data as ValidateSessionsPacketData;
                        let sessionHistoryEntries: Array<SessionHistoryEntry> = this.getSessionHistoryEntries();
                        sessionHistoryEntries = sessionHistoryEntries.filter(entry => (data.validationMap as any)[entry.sessionID]);
                        console.log("invalidated session history entries: ", sessionHistoryEntries);
                        window.localStorage.setItem("session-history-entries", JSON.stringify(sessionHistoryEntries));
                        if (then !== undefined) {
                            then();
                        }
                    }
                }
            });
        })

    }

    public registerAction(name: string, action: () => void) {
        if (!this.actions.has(name)) {
            this.actions.set(name, [action]);
        } else {
            this.actions.get(name)?.push(action);
        }
    }

    public callAction(name: string) {
        this.actions.get(name)?.forEach(act => act());
    }

    public openMenu() {
        this.callAction("show-menu");
    }

    public login(config: {
        initialLoginProcedure: "session" | "session-credentials" | "credentials"
        sessionID?: string,
        onCredentialsLoginUnknownUsername?: () => void,
        onCredentialsLoginPasswordIncorrect?: () => void,
        onSessionIDLoginSessionNotPresent?: () => void,
        onLoginSuccess?: () => void,
        onLoginProcessStarted?: () => void,
        onLoginProcessEnded?: () => void
        credentials?: Credentials
    }) {
        (config.onLoginProcessStarted)?.();
        try {
            switch (config.initialLoginProcedure) {
                case "session":
                    // Login by session-id
                    if (config.sessionID !== undefined) {
                        this.sessionLogin(config.sessionID, (data: SessionIDLoginResponsePacketData) => {
                            console.log("received session-login response", data)

                            switch (data.type) {
                                case SessionIDCheckResultType.OK:
                                    // Login was successful, app considered to be logged in
                                    this.sessionID = config.sessionID as string;

                                    console.log("login successfully by session id");

                                    (config.onLoginSuccess)?.();
                                    break;
                                case SessionIDCheckResultType.NO_SESSION_PRESENT:
                                    (config.onSessionIDLoginSessionNotPresent)?.();
                                    break;
                            }
                            (config.onLoginProcessEnded)?.();
                        });
                    } else console.error("session-id cannot be undefined")
                    break;
                case "session-credentials":
                    // Login by session-id, if it fails loading via credentials

                    // todo move to right position in code
                    (config.onLoginProcessEnded)?.();
                    break;
                case "credentials":
                    // Login by credentials
                    if (config.credentials !== undefined) {
                        this.credentialsLogin(config.credentials as unknown as Credentials, (data: CredentialsLoginResponsePacketData) => {
                            switch (data.type) {
                                case CredentialsCheckResultType.OK:

                                    console.log("cred login result: ", data)

                                    // Login was successful, app considered to be logged in
                                    this.sessionID = data.newSessionID;
                                    this.addSessionHistoryEntry({
                                        sessionID: data.newSessionID as string,
                                        profileData: data.profileData
                                    });
                                    (config.onLoginSuccess)?.();
                                    break;
                                case CredentialsCheckResultType.UNKNOWN_USERNAME:
                                    // Login failed, because username wasn't found
                                    (config.onCredentialsLoginUnknownUsername)?.();
                                    break;
                                case CredentialsCheckResultType.INCORRECT_PASSWORD:
                                    // Login failed, because password was incorrect
                                    (config.onCredentialsLoginPasswordIncorrect)?.();
                                    break;
                            }
                            (config.onLoginProcessEnded)?.();
                        });
                    }
                    break;
            }
        } catch (e) {
            console.error(e);
        }
    }

    private sessionLogin(sessionID: string, loginResponseCallback: (data: SessionIDLoginResponsePacketData) => void) {
        this.callAction("login-process-started");
        this.connector(connector1 => {
            console.log("send session login")
            connector1.call({
                protocol: "login",
                packetID: "SessionIDLoginPacketData",
                data: {
                    sessionID: sessionID
                },
                callback: {
                    handle: (connector, packet) => {
                        this.callAction("login-process-ended");
                        console.log("received session login response packet")
                        loginResponseCallback(packet.data as object as SessionIDLoginResponsePacketData)
                    }
                }
            });
        })
    }

    private credentialsLogin(credentials: Credentials, loginResponseCallback: (data: CredentialsLoginResponsePacketData) => void) {
        this.callAction("login-process-started");
        this.connector(connector1 => {
            connector1.call({
                protocol: "login",
                packetID: "CredentialsLoginPacketData",
                data: {
                    credentials: credentials
                },
                callback: {
                    handle: (connector, packet) => {
                        this.callAction("login-process-ended");
                        loginResponseCallback(packet.data as object as CredentialsLoginResponsePacketData)
                    }
                }
            });
        })
    }

    public connector(action: (connector: Environment.Connector) => void) {
        action(Environment.Connector.useConnector("ton", () => {
            return new Environment.Connector(this.config.connectorConfig).registerSocketEventHandler(Environment.SocketEventTypes.ONOPEN, {
                stator: true,
                usagesLeft: 10000,
                handle: ev => {
                    console.log("connection established");
                    this.callAction("connection-established");
                }
            }).connect();
        }));
    }

    set userData(value: UserData) {
        this._userData = value;
    }

    get config(): AppConfig {
        return this._config;
    }

    set config(value: AppConfig) {
        this._config = value;
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
}
