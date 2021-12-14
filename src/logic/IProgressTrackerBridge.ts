import {Runnable} from "./Runnable";

export interface IProgressTrackerBridge {
    onUnmount?: Runnable
    onMount?: Runnable
}
