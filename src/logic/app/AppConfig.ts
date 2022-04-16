import {ConnectorConfig} from "../network/ConnectorConfig";
import {Themeable} from "../style/Themeable";
import {Assembly} from "../assembly/Assembly";
import {Shard} from "../misc/Shard";
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
