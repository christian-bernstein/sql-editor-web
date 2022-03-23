import {ContextRenderer} from "./ContextRenderer";

export type ViewConfig = {
    id: string,
    tags: string[],
    description: string,
    displayName: string,
    iconRenderer: ContextRenderer,
    renderer: ContextRenderer,
    accessible: (config: ViewConfig) => boolean
}
