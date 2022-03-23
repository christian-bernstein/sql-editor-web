import {ViewConfig} from "./ViewConfig";

export type ScreenConfig = {
    id: string,
    viewFactory: (config: ScreenConfig) => ViewConfig[],
    location: string,
    debug: boolean,
    defaultView: string,
    routeExact?: boolean
    customRouteFactory?: (config: ScreenConfig) => JSX.Element
}
