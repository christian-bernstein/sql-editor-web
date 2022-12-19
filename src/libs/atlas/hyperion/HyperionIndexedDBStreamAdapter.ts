import {IHyperionStreamAdapter} from "./IHyperionStreamAdapter";
import {Consumer} from "../../sql/logic/Consumer";
import {UpstreamCacheStreamCompletedResult} from "./UpstreamCacheStreamCompletedResult";
import {HyperionStorableEntry} from "./HyperionStorableEntry";
import {HyperionUpstreamTransaction} from "./HyperionUpstreamTransaction";
import {UpstreamTransactionType} from "./UpstreamTransactionType";
import {DBHyperionEntry} from "./DBHyperionEntry";
import {HyperionDB} from "./HyperionDB";

export class HyperionIndexedDBStreamAdapter implements IHyperionStreamAdapter {

    private db: HyperionDB = new HyperionDB();

    private isTransactionsCachingEnabled: boolean = false;

    beginUpstreamTransactionCacheMode(): IHyperionStreamAdapter {
        this.isTransactionsCachingEnabled = true;
        return this;
    }

    executeCachedUpstreamTransactions(onStreamCompleted: Consumer<UpstreamCacheStreamCompletedResult>): IHyperionStreamAdapter {
        return this;
    }

    async get(id: string): Promise<HyperionStorableEntry | undefined> {
        const entry: DBHyperionEntry | undefined = await this.db.entries.get(id);
        if (entry === undefined) return undefined;
        return entry as HyperionStorableEntry;
    }

    upstreamTransaction(transaction: HyperionUpstreamTransaction): IHyperionStreamAdapter {

        // TODO: Implement caching
        // TODO: Implement now-throwing error handling -> Pass error to transaction error callback

        switch (transaction.type) {
            case UpstreamTransactionType.OVERWRITE:
                const entry = transaction.entry as HyperionStorableEntry;
                this.db.entries.get(entry.id).then(value => {
                    if (value !== undefined) {
                        this.db.entries.update(entry.id, {
                            "id": entry.id,
                            "value": entry.value
                        }).then(res => {
                            transaction.onStreamed?.();
                        });
                    } else {
                        this.db.entries.add(entry, entry.id).then(res => {
                            transaction.onStreamed?.();
                        });
                    }
                });
                break;
            case UpstreamTransactionType.DELETE:
                if (transaction.targetEntryID === undefined) throw new Error("Cannot delete an entry without a 'targetEntryID'");
                this.db.entries.delete(transaction.targetEntryID).then(res => {
                    transaction.onStreamed?.();
                });
                break;
        }

        return this;
    }
}
