import {AtlasDocument} from "../data/AtlasDocument";
import {DocumentType} from "../data/DocumentType";

export type DocumentView = {
    acceptedType?: Array<DocumentType>,
    renderer: (
        document: AtlasDocument,
        updateBody: (body: string) => void
    ) => JSX.Element
}
