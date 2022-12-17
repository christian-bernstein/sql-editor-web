import Dexie, {Table} from "dexie";
import {DBHyperionEntry} from "./DBHyperionEntry";

export class HyperionDB extends Dexie {

    public entries!: Table<DBHyperionEntry>;

    constructor() {
        super("HyperionDB");
        this.version(1).stores({
            entries: "id,value"
        });
    }
}
