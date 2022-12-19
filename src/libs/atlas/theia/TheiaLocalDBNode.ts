import {ITheiaNode} from "./ITheiaNode";
import {TheiaSource} from "./TheiaSource";
import {TheiaLoadResult} from "./TheiaLoadResult";
import {TheiaLocalDB} from "./TheiaLocalDB";
import {TheiaDBSourceDescriptor} from "./TheiaDBSourceDescriptor";

export class TheiaLocalDBNode implements ITheiaNode {

    private db: TheiaLocalDB = new TheiaLocalDB();

    addSource(source: TheiaSource): Promise<boolean> {
        return Promise.resolve(false);
    }

    getAllSourceDescriptors(): Promise<Array<TheiaSource>> {
        return new Promise<Array<TheiaSource>>((resolve, reject) => {
            this.db.descriptors.toArray().then(ts => {
                const theiaSources = ts.map(internalType => this.convertToPublicType(internalType));
                resolve(theiaSources);
            }).catch(r => reject(r));
        });
    }

    getDataSpan(): Promise<Array<string>> {
        return new Promise<Array<string>>((resolve, reject) => {
            this.getAllSourceDescriptors()
                .then(dArr => dArr.map(d => d.id))
                .then(ids => resolve(ids))
                .catch(r => reject(r));
        });
    }

    getSourceDescriptors(ids: Array<string>): Promise<Array<TheiaSource>> {
        return new Promise<Array<TheiaSource>>((resolve, reject) => {
            this.db.descriptors.bulkGet(ids).then(ts => {
                const theiaSources = ts.filter(e => e !== undefined).map(internalType => this.convertToPublicType(internalType!));
                resolve(theiaSources);
            }).catch(r => reject(r));
        });
    }

    loadSource(id: string): Promise<TheiaLoadResult> {
        return new Promise<TheiaLoadResult>((resolve, reject) => {
            this.db.data.get(id).then(data => {
                if (data === undefined) reject();
                resolve({
                    data: data!.data!
                });
            }).catch(r => reject(r));
        });
    }

    removeSource(id: string): Promise<boolean> {
        return new Promise<boolean>((resolve, reject) => {
            this.db.data.delete(id)
                .then(() => resolve(true))
                .catch(r => reject(r));
        });
    }

    private convertToPublicType(dbValue: TheiaDBSourceDescriptor): TheiaSource {
        return dbValue as TheiaSource;
    }
}
