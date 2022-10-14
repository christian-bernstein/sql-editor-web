import {AtlasEntity} from "./AtlasEntity";
import {Identifiable} from "./Identifiable";

export type Folder = AtlasEntity & Identifiable & {
    categories: Array<string>,

    parentFolder?: string,

    // TODO remove ?s, when implementation is complete
    subFolderIDs?: Array<string>,
    documentsIDs?: Array<string>
}
