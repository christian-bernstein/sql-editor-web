import {MuxRenderer} from "../MuxRenderer";

export type ThemeMultiplexRenderers = {
    renderers?: Map<string, MuxRenderer<any>>
}