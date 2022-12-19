import {ViewRenderContext} from "./ViewRenderContext";

export interface ContextRenderer {
    render(ctx: ViewRenderContext): JSX.Element
}
