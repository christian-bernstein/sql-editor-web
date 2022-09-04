import {getOr} from "../Utils";
import {BernieComponent} from "../BernieComponent";
import {DataQueryState} from "./DataQueryState";
import {v4} from "uuid";
import {QueryError} from "./QueryError";

export type QueryableConfig<T> = {
    enable?: boolean,
    fallback: T,
    component: () => BernieComponent<any, any, any>,
    onTimeout?: (q: Queryable<T>) => void,
    listeners: Array<string>,
    timeout?: number,
    processingDelay?: number,
    process: (
        resolve: (data: T) => void,
        reject: (error?: QueryError) => void
    ) => void
}

export class Queryable<T> {

    /**
     * TODO: Create state list automatically
     */
    public static allChannels(channelBase: string): Array<string> {
        return this.channels(channelBase,
            DataQueryState.PROCESSING,
            DataQueryState.ERROR,
            DataQueryState.SUCCESS,
            DataQueryState.NEUTRAL
        );
    }

    public static channels(channelBase: string, ...forStates: Array<DataQueryState>): Array<string> {
        return forStates.map(state => `${channelBase}-queryable-${state}`)
    }

    private config: QueryableConfig<T>;

    private data: T | undefined;

    private state: DataQueryState;

    private checksum: undefined | string;

    private error?: QueryError;

    constructor(config: QueryableConfig<T>) {
        this.config = config;
        this.state = DataQueryState.NEUTRAL;
    }

    public isRunning(): boolean {
        return this.state === DataQueryState.PROCESSING;
    }

    private changeQueryState(to: DataQueryState) {
        console.error("re-rendering", this.config.listeners.map(channelBase => (
            Queryable.channels(channelBase, to)[0]
        )))

        this.config.component().ifActive(component => console.error("still active"))

        this.config.component().rerender(
            ...this.config.listeners.map(channelBase => (
                Queryable.channels(channelBase, to)[0]
            ))
        );
        this.state = to;
    }

    private runQuery() {
        try {
            this.config.process(data => {
                console.info("Q: Query successful");
                this.data = data;
                this.checksum = undefined;
                this.changeQueryState(DataQueryState.SUCCESS);
            }, (error) => {
                console.info("Q: Query rejected", error);
                this.error = error;
                this.checksum = undefined;
                this.changeQueryState(DataQueryState.ERROR);
            });
        } catch (e) {
            console.error(e);
            this.error = {
                code: 1,
                object: e
            };
            this.changeQueryState(DataQueryState.ERROR);
        }

    }

    public query(): Queryable<T> {
        if (!this.isRunning()) {
            if (!getOr(this.config.enable, true)) {
                this.data = this.config.fallback;
            } else {
                this.error = undefined;
                this.changeQueryState(DataQueryState.PROCESSING);
                const localChecksum = this.checksum = v4();

                if (this.config.timeout !== undefined) {
                    setTimeout(() => {
                        if (this.checksum === localChecksum) {
                            this.config.onTimeout?.(this);
                            this.changeQueryState(DataQueryState.ERROR);
                        }
                    }, this.config.timeout);
                }

                if (this.config.processingDelay !== undefined) {
                    setTimeout(() => this.runQuery(), this.config.processingDelay);
                } else {
                    this.runQuery();
                }
            }
        }

        return this;
    }

    public get(): [T, DataQueryState, QueryError?] {
        return [getOr(this.data, this.config.fallback), this.state, this.error];
    }
}

export {
    Queryable as Q
}
