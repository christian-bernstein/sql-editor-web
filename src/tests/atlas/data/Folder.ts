import {AtlasEntity} from "./AtlasEntity";
import {Identifiable} from "./Identifiable";

export type Folder = AtlasEntity & Identifiable & {
    categories: Array<string>
}
