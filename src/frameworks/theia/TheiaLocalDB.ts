import Dexie, {Table} from "dexie";
import {TheiaDBSourceDescriptor} from "./TheiaDBSourceDescriptor";
import {TheiaDBSource} from "./TheiaDBSource";

export class TheiaLocalDB extends Dexie {

    public descriptors!: Table<TheiaDBSourceDescriptor>;

    public data!: Table<TheiaDBSource>;

    constructor() {
        super("TheiaLocalDB");
        this.version(1).stores({
            descriptors: "id,title,description",
            data: "id,data"
        });
    }
}
