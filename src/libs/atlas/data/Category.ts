import {AtlasEntity} from "./AtlasEntity";
import {Identifiable} from "./Identifiable";

export type Category = AtlasEntity & Identifiable & {
    documents: Array<string>
}
