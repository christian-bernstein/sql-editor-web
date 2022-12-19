import {DocumentView} from "./DocumentView";
import {inDevDocumentView} from "./views/InDevDocumentView";
import {markdownDocumentView} from "./views/MarkdownDocumentView";

export const documentViewCollection: Array<DocumentView> = [
    inDevDocumentView,
    markdownDocumentView
]
