import {DocumentType} from "../data/DocumentType";
import {DocumentViewRenderContext} from "./DocumentViewRenderContext";

export type DocumentView = {
    acceptedType?: Array<DocumentType>,
    renderer: (context: DocumentViewRenderContext) => JSX.Element
}
