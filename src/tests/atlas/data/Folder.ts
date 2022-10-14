import {AtlasEntity} from "./AtlasEntity";
import {Identifiable} from "./Identifiable";

export type Folder = AtlasEntity & Identifiable & {
    categories: Array<string>,
    // TODO remove ?, when implementation is complete
    subFolderIDs?: Array<string>
}
