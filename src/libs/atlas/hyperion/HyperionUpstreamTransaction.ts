import {HyperionStorableEntry} from "./HyperionStorableEntry";
import {Runnable} from "../../sql/logic/Runnable";
import {UpstreamTransactionType} from "./UpstreamTransactionType";

export type HyperionUpstreamTransaction = {
    transactionID: string,
    onStreamed?: Runnable,
    type: UpstreamTransactionType

    // Used for overwrite :: TODO rename to commitData -> Maybe change to type 'string' & construct HyperionStorableEntry internally
    entry?: HyperionStorableEntry,

    // Used for delete
    targetEntryID?: string,
}
