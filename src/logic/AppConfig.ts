import {ConnectorConfig} from "./ConnectorConfig";
import {Themeable} from "../Themeable";

export type AppConfig = {
    defaultAppRoute: string
    connectorConfig: ConnectorConfig,
    themes: Map<string, Themeable.Theme>
}
