import Dexie, {Table} from "dexie";
import {DBDocumentAttachment} from "../data/DBDocumentAttachment";

export class AtlasDB extends Dexie {

    public documentAttachments!: Table<DBDocumentAttachment>

    constructor(id: string, version: number = 1) {
        super(id);
        this.version(version).stores({
            documentAttachments: "id,type,src"
        });
    }
}
