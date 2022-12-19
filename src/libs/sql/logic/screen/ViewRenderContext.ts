import {ViewConfig} from "./ViewConfig";
import {ScreenConfig} from "./ScreenConfig";

export type ViewRenderContext = {
    viewConfig: ViewConfig,
    viewLocation: string,
    screenConfig: ScreenConfig,
    active: boolean
}
