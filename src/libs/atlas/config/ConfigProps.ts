import {IUpdater} from "../utils/IUpdater";

export type ConfigProps<T> = {
    updater: IUpdater<T>;
    getConfig: () => T;
}
