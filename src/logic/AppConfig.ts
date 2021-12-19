import {ConnectorConfig} from "./ConnectorConfig";
import {Themeable} from "../Themeable";

export type AppConfig = {
    rootRerenderHook?: (callback?: () => void) => void,
    appTitle: string,
    debugMode: boolean,
    defaultAppRoute: string,
    defaultDebugAppRoute: string,
    connectorConfig: ConnectorConfig,
    themes: Map<string, Themeable.Theme>
    defaultTheme: string
}
