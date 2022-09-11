import {AtlasEntity} from "./AtlasEntity";
import {Identifiable} from "./Identifiable";
import {Category} from "./Category";

export type Folder = AtlasEntity & Identifiable & {
    categories: Array<Category>
}
