import {Shard} from "../misc/Shard";
import {SessionHistoryEntry} from "../misc/SessionHistoryEntry";
import {Environment} from "../Environment";
import {AppConfig} from "./AppConfig";
import {UserData} from "../data/UserData";
import {CredentialsLoginResponsePacketData} from "../../pages/login/CredentialsLoginResponsePacketData";
import {Credentials} from "../../pages/login/Credentials";
import {CredentialsCheckResultType} from "../../pages/login/CredentialsCheckResultType";
import {SessionIDLoginResponsePacketData} from "../../pages/login/SessionIDLoginResponsePacketData";
import {SessionIDCheckResultType} from "../../pages/login/SessionIDCheckResultType";
import {ValidateSessionsPacketData} from "../misc/ValidateSessionsPacketData";
import {FlowAccessPoint} from "../misc/FlowAccessPoint";
import {LoginCallConfig} from "../misc/LoginCallConfig";
import {Themeable} from "../style/Themeable";
import {ProgressTrackerManager} from "../misc/ProgressTrackerManager";
import Modal from "react-modal";
import {Assembly} from "../assembly/Assembly";
import {LogEntry} from "../data/LogEntry";
import {v4} from "uuid";
import {UserProfileData} from "../data/UserProfileData";
import {fromLocalStorage, getOr} from "../Utils";
import {CDNRequestPacketData} from "../../packets/out/CDNRequestPacketData";
import {CDNResponsePacketData} from "../../packets/in/CDNResponsePacketData";
import {CDNRequestBranch} from "../data/cdn/CDNRequestBranch";
import {ScreenManager} from "../screen/ScreenManager";
import {AppShortcuts} from "./AppShortcuts";
import {Cache} from "../cache/Cache";
import {ModalDisplay} from "../modal/ModalDisplay";
import {NetworkShard} from "../../shards/network/NetworkShard";
import {DBSessionCacheShard} from "../../shards/dbSessionCache/DBSessionCacheShard";
import {LocalStorageShard} from "../../shards/localStorage/LocalStorageShard";
import {SettingsShard} from "../../shards/settings/SettingsShard";

export function utilizeApp(): App {
    return App.app();
}

export function utilizeUserProfile(defUser: UserData = {
    id: v4(),
    username: "sample",
    userEntrySetupDate: new Date(),
    firstname: "sample",
    lastname: "sample"
}): UserData {
    if (App.isInitiated()) {
        return getOr(App.app().userData, defUser);
    } else {
        return defUser;
    }
}

export let defaultGlobalFallbackTheme: Themeable.Theme = Themeable.darkTritanopiaTheme;

export let globalFallbackTheme: Themeable.Theme = Array.from(Themeable.getAllThemes().values()).filter(theme =>
    theme.displayName === fromLocalStorage("globalFallbackTheme", defaultGlobalFallbackTheme.displayName)
)[0] ?? defaultGlobalFallbackTheme;

export function setGlobalFallbackTheme(theme: Themeable.Theme) {
    globalFallbackTheme = theme;
    window.localStorage.setItem("globalFallbackTheme", theme.displayName)
}

export function utilizeGlobalTheme(defTheme: Themeable.Theme | undefined = undefined): Themeable.Theme {
    if (App.isInitiated()) {
        return App.app().getGlobalTheme();
    } else {
        if (defTheme === undefined) {
            return globalFallbackTheme
        }
        return defTheme;
    }
}



export class App {
    get globalThemeName(): string {
        return this._globalThemeName;
    }
    get modals(): Array<ModalDisplay> {
        return this._modals;
    }

    public static readonly enablePacketLogging: boolean = false;

    get shortcuts(): AppShortcuts {
        return this._shortcuts;
    }

    get screenManager(): ScreenManager {
        return this._screenManager;
    }

    get logEntryAddListeners(): Map<string, (entry: LogEntry) => void> {
        return this._logEntryAddListeners;
    }

    get sophisticatedLogHistory(): Array<LogEntry> {
        return this._sophisticatedLogHistory;
    }

    set sophisticatedLogHistory(value: Array<LogEntry>) {
        this._sophisticatedLogHistory = value;
    }

    private static instance: App | undefined = undefined;

    public static appOrCreate: (config: AppConfig, onCreate?: (app: App) => void) => App = (config: AppConfig, onCreate: ((app: App) => void) | undefined) => {
        if (App.instance === undefined) {
            App.instance = new App(config);
            App.instance.init();
            onCreate?.(App.instance);
        }
        return App.instance;
    };

    public static app: () => App = () => {
        return App.instance as App;
    };

    public static use(handler: (app: App) => void) {
        handler(App.app());
    }

    public static isInitiated(): boolean {
        return App.instance !== undefined && App.app().initiated;
    }

    private readonly _shortcuts: AppShortcuts = new AppShortcuts(this);

    private readonly flowAccessPoint: FlowAccessPoint = new FlowAccessPoint(this);

    private readonly themes: Map<string, Themeable.Theme>;

    private readonly _progressTrackerManager: ProgressTrackerManager = new ProgressTrackerManager(this);

    // todo rename to logHistory
    private _sophisticatedLogHistory: Array<LogEntry> = new Array<LogEntry>();

    /**
     * @deprecated
     */
    private readonly _logHistory: any[][] = [];

    private readonly shards: Map<String, Shard> = new Map<String, Shard>();

    private readonly actions: Map<String, Array<(parameters?: any) => void>> = new Map<String, Array<(parameters?: any) => void>>();

    private readonly _modals: Array<ModalDisplay>;

    private readonly _screenManager: ScreenManager = new ScreenManager();

    private centralMemoryCache?: Cache;

    private _globalThemeName: string;

    private _config: AppConfig;

    private _sessionID?: string;

    private _userData: UserProfileData | undefined;

    private _initiated: boolean = false;

    private _dialogAssembly: Assembly;

    private _logEntryAddListeners: Map<string, (entry:  LogEntry) => void> = new Map<string, (entry: LogEntry) => void>();

    private profileData?: UserProfileData;

    constructor(config: AppConfig) {
        this._config = config;
        this._globalThemeName = config.defaultTheme;
        this.themes = config.themes;
        this._dialogAssembly = config.appAssembly;
        this._modals = new Array<ModalDisplay>();
        // this.init();
    }

    public cdn<T>(branches: CDNRequestBranch[], handler: (data: CDNResponsePacketData) => void): void {
        App.app().getConnector().call({
            protocol: "base",
            packetID: "CDNRequestPacketData",
            data: {
                branches: branches
            } as CDNRequestPacketData,
            callback: {
                handle: (connector, packet) => {
                    const data = packet.data as CDNResponsePacketData;
                    handler(data);
                }
            }
        });
    }

    public shard<T extends Shard>(id: string, shard: T | undefined = undefined): T {
        if (!Array.from(this.shards.keys()).includes(id) && shard !== undefined) {
            this.shards.set(id, shard as T);
        }
        return this.shards.get(id) as T;
    }

    public dbSessionCacheShard(): DBSessionCacheShard {
        return this.shard<DBSessionCacheShard>("db-session-cache");
    }

    public ls(): LocalStorageShard {
        return this.shard("local-storage-shard");
    }

    public net(): NetworkShard {
        return this.shard("network-shard");
    }

    public settings(): SettingsShard {
        return this.shard("settings-shard");
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

    public clearSessionHistory() {
        window.localStorage.setItem("session-history-entries", JSON.stringify([]));
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
        });
    }

    public checkServerAvailability(): boolean {
        throw new Error("checkServerAvailability not implemented yet!");
    }

    public registerAction(name: string, action: (parameters?: any) => void) {
        if (!this.actions.has(name)) {
            this.actions.set(name, [action]);
        } else {
            this.actions.get(name)?.push(action);
        }
    }

    public callAction(name: string, parameters: any = undefined) {
        this.actions.get(name)?.forEach(act => act(parameters));
    }

    public openMenu() {
        this.callAction("show-menu");
    }

    public toggleMainDialog(switchTo: "open" | "closed" ) {
        if (switchTo === "open") {
            this.callAction("close-main-dialog");
        } else {
            this.callAction("open-main-dialog");
        }
    }

    public getDefaultTheme(): Themeable.Theme {
        return this.themes.get("default") as Themeable.Theme;
    }

    public login(config: LoginCallConfig) {
        (config.onLoginProcessStarted)?.();
        try {
            switch (config.initialLoginProcedure) {
                case "session":
                    // Login by session-id
                    if (config.sessionID !== undefined) {
                        this.sessionLogin(config.sessionID, (data: SessionIDLoginResponsePacketData) => {
                            switch (data.type) {
                                case SessionIDCheckResultType.OK:
                                    // Login was successful, app considered to be logged in
                                    this.sessionID = config.sessionID as string;
                                    this.userData = data.profileData;
                                    (config.onLoginSuccess)?.();
                                    break;
                                case SessionIDCheckResultType.NO_SESSION_PRESENT:
                                    (config.onSessionIDLoginSessionNotPresent)?.();
                                    (config.onLoginFail)?.();
                                    break;
                            }
                            (config.onLoginProcessEnded)?.();
                        });
                    } else {
                        console.error("session-id cannot be undefined");
                        (config.onLoginFail)?.();
                    }
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
                                    // Login was successful, app considered to be logged in
                                    this.sessionID = data.newSessionID;
                                    this.userData = data.profileData;
                                    this.addSessionHistoryEntry({
                                        sessionID: data.newSessionID as string,
                                        profileData: data.profileData
                                    });
                                    (config.onLoginSuccess)?.();
                                    break;
                                case CredentialsCheckResultType.UNKNOWN_USERNAME:
                                    // Login failed, because username wasn't found
                                    (config.onCredentialsLoginUnknownUsername)?.();
                                    (config.onLoginFail)?.();
                                    break;
                                case CredentialsCheckResultType.INCORRECT_PASSWORD:
                                    // Login failed, because password was incorrect
                                    (config.onCredentialsLoginPasswordIncorrect)?.();
                                    (config.onLoginFail)?.();
                                    break;
                            }
                            (config.onLoginProcessEnded)?.();
                        });
                    } else {
                        console.error("credentials cannot be undefined");
                        (config.onLoginFail)?.();
                    }
                    break;
            }
        } catch (e) {
            console.error(e);
        }
    }

    public connector(action: (connector: Environment.Connector) => void) {
        action(Environment.Connector.useConnector("ton", this.createConnectorFactory()));
    }

    public getConnector(): Environment.Connector {
        return Environment.Connector.useConnector("ton", this.createConnectorFactory())
    }

    private createConnectorFactory(): () => Environment.Connector {
        return () => {
            return new Environment.Connector(this.config.connectorConfig)
                .registerSocketEventHandler(Environment.SocketEventTypes.ON_OPEN, {
                    stator: true,
                    usagesLeft: 10000,
                    handle: ev => {
                        console.log("connection established");
                        this.callAction("connection-established");
                    }
                })
                .registerSocketEventHandler(Environment.SocketEventTypes.ON_CLOSE, {
                    stator: true,
                    usagesLeft: 10000,
                    handle: ev => {
                        this.rerenderGlobally();
                    }
                })
                .registerProtocolPacketHandler("main", "SQLCommandQueryResponsePacketData", {
                    handle: (connector1, packet) => {
                        // todo do something with this method
                    }
                })
                .connect();
        }
    }

    public getGlobalTheme(): Themeable.Theme {
        return this.themes.get(this._globalThemeName) as Themeable.Theme;
    }

    // todo add rerender feature
    public setGlobalTheme(theme: string, setDefaultBrowserTheme: boolean = true) {
        this._globalThemeName = theme;
        if (setDefaultBrowserTheme) {
            this.setDefaultBrowserTheme(theme);
        }
    }

    public rerenderGlobally() {
        this.config.rootRerenderHook?.();
    }

    /**
     * Returns the central-memory-cache
     */
    public cmc(): Cache {
        return this.centralMemoryCache as Cache;
    }

    public init() {
        document.title = this.config.appTitle + (this.config.debugMode ? " (Debug mode)" : "");
        this._initiated = true;

        // Create the console interception
        this.initLogInterceptor();

        this.initCaches();

        this.initShards();

        // Set the modals attachment element
        Modal.setAppElement("#root");

        // Try to load the default theme, set in the browser
        this.loadDefaultBrowserTheme();
    }

    private initCaches() {
        this.centralMemoryCache = new Cache({
            id: "central-memory-cache",
            adapter: Cache.memory("cmc")
        });
    }

    private initShards() {
        this.config.shards?.forEach((shardFactory, id) => {
            this.shard(id, shardFactory(this));
        });

        this.shards.forEach((shard, id) => {
            if (shard.canInit()) {
                if (this.config.debugMode) {
                    console.log(`Loading shard '${id}..'`, shard);
                }
                shard.load(this);
            }
        })
    }

    private loadDefaultBrowserTheme() {
        const theme: string | null = window.localStorage.getItem("default-browser-theme");
        if (theme != null) {
            this._globalThemeName = theme;
        }
    }

    private setDefaultBrowserTheme(theme: string) {
        window.localStorage.setItem("default-browser-theme", theme);
    }

    // todo rewrite to accept new log system
    private addLogInterceptor(methodName: "log" | "info" | "warn" | "error") {
        const stream: { (message?: any, ...optionalParams: any[]): void; (...data: any[]): void; (...data: any[]): void } = console[methodName];
        console[methodName] = (...data: any[]) => {
            // this.logHistory.push([{
            //     method: methodName.toUpperCase(),
            //     timestamp: new Date()
            // }, ...data]);

            this.baseLog({
                appendices: data.map(value => {
                    return {
                        type: "unknown",
                        data: value
                    }
                }),
                creator: "js-relay",
                id: v4(),
                message: data[0],
                timestamp: new Date(),
                level: methodName.toUpperCase() as "ERROR" | "INFO" | "DEBUG" | "TRACE" | "SEVERE" | "WARN"
            })

            // Delete oldest log entry if needed
            if (this.logHistory.length > this.config.logSaveSize) {
                this.logHistory.shift();
            }

            // todo reactivate
            // Print to standard log
            stream(...data);
        }
    }

    private initLogInterceptor() {
        ["log", "info", "warn", "error"].forEach(method => {
            this.addLogInterceptor(method as "log" | "info" | "warn" | "error");
        });
    }

    public callDialog(dialog: string) {
        App.app().callAction("open-main-dialog", dialog);
    }

    private sessionLogin(sessionID: string, loginResponseCallback: (data: SessionIDLoginResponsePacketData) => void) {
        this.callAction("login-process-started");
        this.connector(connector1 => {
            connector1.call({
                protocol: "login",
                packetID: "SessionIDLoginPacketData",
                data: {
                    sessionID: sessionID
                },
                callback: {
                    handle: (connector, packet) => {
                        this.callAction("login-process-ended");
                        loginResponseCallback(packet.data as object as SessionIDLoginResponsePacketData);
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
                        loginResponseCallback(packet.data as object as CredentialsLoginResponsePacketData);
                    }
                }
            });
        });
    }

    // todo implement
    set userData(value: UserProfileData | undefined) {
        this._userData = value;
    }

    get userData(): UserProfileData | undefined {
        return this._userData;
    }

    get config(): AppConfig {
        return this._config;
    }

    set config(value: AppConfig) {
        this._config = value;
    }

    get progressTrackerManager(): ProgressTrackerManager {
        return this._progressTrackerManager;
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

    get initiated(): boolean {
        return this._initiated;
    }

    get logHistory(): any[][] {
        return this._logHistory;
    }

    public error(message: string, ...appendices: any[]): App {
        this.baseLog({
            id: v4(),
            timestamp: new Date(),
            level: "ERROR",
            message: message,
            creator: "unknown",
            appendices: appendices
        });
        return this;
    }

    public log(message: string, ...appendices: any[]): App {
        this.baseLog({
            id: v4(),
            timestamp: new Date(),
            level: "INFO",
            message: message,
            creator: "unknown",
            appendices: appendices
        });
        return this;
    }

    public baseLog(log: LogEntry): App {
        this.sophisticatedLogHistory.push(log);

        // Delete oldest log entry if needed
        if (this.sophisticatedLogHistory.length > this.config.logSaveSize) {
            this.sophisticatedLogHistory.shift();
        }

        this.logEntryAddListeners.forEach((listener, key) => {
            listener(log);
        })

        return this;
    }

    public flow(): FlowAccessPoint {
        return this.flowAccessPoint;
    }

    /**
     * If a single session is present, that one is used for automated login.
     * If multiple sessions are present, the user has to select a session, he wants to resume.
     * If no user session is present, the login page will be activated, with its automated redirection set to the calling location
     */
    public triggerLoginIfNotLoggedIn(config: {
        processFinished?: () => void,
        processSuccessful?: () => void,
    }) {

        // todo only if not logged in

        const entries = this.getSessionHistoryEntries();
        if (entries.length > 1) {
            // multiple session entries are present
            console.error("more than one session present");

            // todo implement
            config.processFinished?.();
        } else if (entries.length === 1) {
            // a single session entry is present
            this.login({
                initialLoginProcedure: "session",
                sessionID: entries[0].sessionID,
                onLoginProcessEnded: () => {
                    config.processFinished?.();
                },
                onLoginSuccess: () => {
                    // todo investigate why login success function isn't called
                    console.log("internal login success function call")
                    config.processSuccessful?.();
                },
                onLoginFail: () => {
                    // the automated login procedure didn't work, the user needs to login manually
                    // todo implement (not mvp-feature)
                }
            });
        } else {
            // no session entry is present, trigger the full login page
            console.error("no sessions present");

            // todo implement

            config.processFinished?.();
        }
    }

    get dialogAssembly(): Assembly {
        return this._dialogAssembly;
    }

    set dialogAssembly(value: Assembly) {
        this._dialogAssembly = value;
    }
}
