import {TheiaFilterOptions} from "./TheiaFilterOptions";
import {TheiaSourceResult} from "./TheiaSourceResult";
import {TheiaSource} from "./TheiaSource";
import {ITheiaNode} from "./ITheiaNode";
import {TheiaSourceImage} from "./TheiaSourceImage";
import {TheiaLoadResult} from "./TheiaLoadResult";

export interface ITheiaAPI {
    getImage(options: TheiaFilterOptions): Promise<TheiaSourceImage>
    addSource(nodeID: string, source: TheiaSource): Promise<boolean>
    removeSource(id: string): Promise<boolean>
    addNode(nodeID: string, node: ITheiaNode): void,
    loadSource(id: string): Promise<TheiaLoadResult>
}
