import {HyperionStorableEntry} from "./HyperionStorableEntry";
import {Runnable} from "../../logic/Runnable";

export type HyperionUpstreamTransaction = {
    transactionID: string,
    entry: HyperionStorableEntry,
    onStreamed?: Runnable
}
