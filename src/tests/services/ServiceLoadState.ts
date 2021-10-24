import {Color} from "../../Color";

export enum ServiceLoadState {
    RUNNING = ("running"),
    DISENGAGED = ("disengaged")
}

export const loadStateColors: Map<ServiceLoadState, Color> = new Map<ServiceLoadState, Color>([
    [ServiceLoadState.RUNNING, Color.ofHex("238636")],
    [ServiceLoadState.DISENGAGED, Color.ofHex("30363D")]
]);
