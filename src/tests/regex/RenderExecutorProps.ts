import {RenderBridge} from "./renderBridge";

export type RenderExecutorProps = {
    renderChildren?: boolean,
    componentFactory: () => JSX.Element,
    channels?: string[],
    upstreamOnComponentUnmountHandler?: (id: string) => void,
    id: string
    componentDidMountRelay: (bridge: RenderBridge) => void;
}