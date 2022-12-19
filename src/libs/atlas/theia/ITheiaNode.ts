import {TheiaSource} from "./TheiaSource";
import {TheiaLoadResult} from "./TheiaLoadResult";

export interface ITheiaNode {
    getDataSpan(): Promise<Array<string>>;
    addSource(source: TheiaSource): Promise<boolean>;
    getSourceDescriptors(ids: Array<string>): Promise<Array<TheiaSource>>;
    getAllSourceDescriptors(): Promise<Array<TheiaSource>>;
    loadSource(id: string): Promise<TheiaLoadResult>;
    removeSource(id: string): Promise<boolean>;
}
