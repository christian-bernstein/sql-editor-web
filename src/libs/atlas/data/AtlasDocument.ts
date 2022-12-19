import {Identifiable} from "./Identifiable";
import {AtlasEntity} from "./AtlasEntity";
import {DocumentType} from "./DocumentType";

export type AtlasDocument = AtlasEntity & Identifiable & {
    issuer?: string,
    documentType?: DocumentType,
    attachmentIDs?: Array<string>;
    body?: string
}
