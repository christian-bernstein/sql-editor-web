import {HyperionStorableEntry} from "./HyperionStorableEntry";
import {HyperionUpstreamTransaction} from "./HyperionUpstreamTransaction";
import {Consumer} from "../../sql/logic/Consumer";
import {UpstreamCacheStreamCompletedResult} from "./UpstreamCacheStreamCompletedResult";

export interface IHyperionStreamAdapter {
    upstreamTransaction(transaction: HyperionUpstreamTransaction): IHyperionStreamAdapter;
    beginUpstreamTransactionCacheMode(): IHyperionStreamAdapter;
    executeCachedUpstreamTransactions(onStreamCompleted: Consumer<UpstreamCacheStreamCompletedResult>): IHyperionStreamAdapter;
    get(id: string): Promise<HyperionStorableEntry | undefined>;
}
