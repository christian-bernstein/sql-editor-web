import {IHyperionStreamAdapter} from "./IHyperionStreamAdapter";
import {Consumer} from "../../logic/Consumer";
import {UpstreamCacheStreamCompletedResult} from "./UpstreamCacheStreamCompletedResult";
import {HyperionStorableEntry} from "./HyperionStorableEntry";
import {HyperionUpstreamTransaction} from "./HyperionUpstreamTransaction";
import Dexie, {Table} from "dexie";
import {DBFile, FileDB} from "../../pages/unit/tests/DBTest";
import {UpstreamTransactionType} from "./UpstreamTransactionType";

export interface DBHyperionEntry {
    id?: string,
    value?: string
}

export class HyperionDB extends Dexie {

    public entries!: Table<DBHyperionEntry>

    constructor() {
        super("HyperionDB");
        this.version(1).stores({
            entries: "id,value"
        });
    }
}

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
