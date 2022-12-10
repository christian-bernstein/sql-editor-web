import {IHyperionAPI} from "./IHyperionAPI";
import {IHyperionStreamAdapter} from "./IHyperionStreamAdapter";
import {UpstreamCacheStreamCompletedResult} from "./UpstreamCacheStreamCompletedResult";
import {Consumer} from "../../logic/Consumer";
import {HyperionStorableEntry} from "./HyperionStorableEntry";
import {HyperionUpstreamTransaction} from "./HyperionUpstreamTransaction";

export class HyperionAPI implements IHyperionAPI {

    private static singleton?: HyperionAPI = undefined;

    private _adapter?: IHyperionStreamAdapter;

    public static hyperion(action?: Consumer<HyperionAPI>, factory: (() => HyperionAPI) | undefined = undefined): HyperionAPI {
        if (HyperionAPI.singleton === undefined) {
            if (factory === undefined) {
                throw new Error("[HyperionAPI] Cannot get api singleton because singleton & factory are undefined")
            }
            HyperionAPI.singleton = factory();
        }
        action?.(HyperionAPI.singleton);
        return HyperionAPI.singleton;
    }

    constructor() {
        if (HyperionAPI.singleton !== undefined) {
            throw new Error("[HyperionAPI] API already initialized -> Hyperion uses singleton pattern");
        }
        HyperionAPI.singleton = this;
    }

    private assertAdapterAvailability() {
        if (this._adapter === undefined) {
            throw new Error("[HyperionAPI] IHyperionStreamAdapter cannot be undefined");
        }
    }

    setStreamAdapter(adapter: IHyperionStreamAdapter): IHyperionAPI {
        this._adapter = adapter;
        return this;
    }

    beginUpstreamTransactionCacheMode(): IHyperionStreamAdapter {
        this.assertAdapterAvailability();
        return this.adapter.beginUpstreamTransactionCacheMode();
    }

    executeCachedUpstreamTransactions(onStreamCompleted: Consumer<UpstreamCacheStreamCompletedResult>): IHyperionStreamAdapter {
        this.assertAdapterAvailability();
        return this.adapter.executeCachedUpstreamTransactions(onStreamCompleted);
    }

    async get(id: string): Promise<HyperionStorableEntry | undefined> {
        this.assertAdapterAvailability();
        return this.adapter.get(id);
    }

    upstreamTransaction(transaction: HyperionUpstreamTransaction): IHyperionStreamAdapter {
        this.assertAdapterAvailability();
        return this.adapter.upstreamTransaction(transaction);
    }

    get adapter(): IHyperionStreamAdapter {
        return <IHyperionStreamAdapter>this._adapter;
    }
}
