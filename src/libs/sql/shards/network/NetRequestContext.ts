import {Environment} from "../../../../logic/Environment";

export type NetRequestContext<T, V> = {
    onStart?: () => void,
    packet: T,
    simulateDelay?: boolean,
    simulatedDelay?: () => number,
    onBaseCallback?: Environment.Handler
    onCallback?: (data: V) => void
}
