import {AtlasDocument} from "../data/AtlasDocument";
import {DocumentType} from "../data/DocumentType";
import {VFSFolderView} from "../components/VFSFolderView";

export type DocumentView = {
    acceptedType?: Array<DocumentType>,
    renderer: (
        view: VFSFolderView,
        document: AtlasDocument,
        updateBody: (body: string) => void
    ) => JSX.Element
}
