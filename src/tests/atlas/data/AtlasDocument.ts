import {Identifiable} from "./Identifiable";
import {AtlasEntity} from "./AtlasEntity";

export type AtlasDocument = AtlasEntity & Identifiable & {
    issuer?: string,
    documentType?: DocumentType,
}
