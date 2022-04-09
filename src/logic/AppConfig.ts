import {ConnectorConfig} from "./ConnectorConfig";
import {Themeable} from "../Themeable";
import {Assembly} from "./Assembly";
import {Shard} from "./Shard";
import {App} from "./App";

export type AppConfig = {
    rootRerenderHook?: (callback?: () => void) => void,
    appTitle: string,
    debugMode: boolean,
    defaultAppRoute: string,
    defaultDebugAppRoute: string,
    connectorConfig: ConnectorConfig,
    themes: Map<string, Themeable.Theme>,
    defaultTheme: string,
    logInterceptors?: ((...data: any[]) => void)[]
    logSaveSize: number,
    appAssembly: Assembly,
    shards?: Map<string, (app: App) => Shard>
}
