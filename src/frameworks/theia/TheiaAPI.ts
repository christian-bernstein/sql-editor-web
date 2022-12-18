import {ITheiaAPI} from "./ITheiaAPI";
import {ITheiaNode} from "./ITheiaNode";
import {TheiaSource} from "./TheiaSource";
import {TheiaFilterOptions} from "./TheiaFilterOptions";
import {TheiaSourceImage} from "./TheiaSourceImage";
import {TheiaLoadResult} from "./TheiaLoadResult";
import {Optional} from "../../logic/Optional";
import {Consumer} from "../../logic/Consumer";

export class TheiaAPI implements ITheiaAPI {

    private static singleton?: TheiaAPI = undefined;

    public static theia(action?: Consumer<TheiaAPI>, factory: (() => TheiaAPI) | undefined = undefined) {
        if (TheiaAPI.singleton === undefined) {
            if (factory === undefined) {
                throw new Error("[TheiaAPI] Cannot get api singleton because singleton & factory are undefined")
            }
            TheiaAPI.singleton = factory();
        }
        action?.(TheiaAPI.singleton);
        return TheiaAPI.singleton;
    }

    private readonly nodes: Map<string, ITheiaNode> = new Map<string, ITheiaNode>();

    constructor() {
        if (TheiaAPI.singleton !== undefined) {
            throw new Error("[TheiaAPI] API already initialized -> TheiaAPI uses singleton pattern");
        }
        TheiaAPI.singleton = this;
    }

    addNode(nodeID: string, node: ITheiaNode): void {
        this.nodes.set(nodeID, node);
    }

    async addSource(nodeID: string, source: TheiaSource): Promise<boolean> {
        return new Promise((resolve, reject) => {
            const node = this.nodes.get(nodeID);
            if (node === undefined) reject(`No node matching id '${nodeID}' was found`);
            node!.addSource(source).then(success => resolve(success)).catch(r => reject(r));
        });
    }

    async getImage(options: TheiaFilterOptions): Promise<TheiaSourceImage> {
        return new Promise((resolve, reject) => {
            const sources: Map<ITheiaNode, Array<TheiaSource>> = new Map<ITheiaNode, Array<TheiaSource>>();
            try {
                Array.from(this.nodes.entries()).map(([, node]) => {
                    node.getAllSourceDescriptors().then(nodeSources => {
                        sources.set(node, nodeSources);
                    });
                });
            } catch (e) {
                reject(e);
            }
            resolve({
                sources: sources
            });
        });
    }

    async removeSource(id: string): Promise<boolean> {
        return this.withSpanningNode(id, (node, resolve, reject) => {
            node.removeSource(id)
                .then(success => resolve(success))
                .catch(r => reject(r));
        });
    }

    async loadSource(id: string): Promise<TheiaLoadResult> {
        return this.withSpanningNode(id, (node, resolve, reject) => {
            node.loadSource(id)
                .then(tlr => resolve(tlr))
                .catch(r => reject(r));
        });
    }

    private getSpanningNode(sourceID: string): Promise<Optional<ITheiaNode>> {
        return new Promise<Optional<ITheiaNode>>((resolve, reject) => {
            try {
                const node = Array.from(this.nodes).map(e => e[1]).find(async node => {
                    const span = await node.getDataSpan();
                    return span.includes(sourceID);
                });
                if (node !== undefined) resolve(node);
                resolve(undefined);
            } catch (e) {
                reject(e);
            }
        });
    }

    private withSpanningNode<T>(sourceID: string, withNode: (node: ITheiaNode, resolve: (value: (T | PromiseLike<T>)) => void, reject: (reason?: any) => void) => void): Promise<T> {
        return new Promise(async (resolve, reject) => {
            const node = await this.getSpanningNode(sourceID);
            if (node === undefined) reject();
            withNode(node!, resolve, reject);
        });
    }
}
