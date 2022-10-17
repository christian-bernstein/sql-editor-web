import {DocumentBodyUpdater} from "./DocumentBodyUpdater";
import {AtlasDocument} from "../data/AtlasDocument";
import {DocumentState} from "../data/DocumentState";
import {VFSFolderView} from "../components/VFSFolderView";

export type DocumentViewRenderContextData = {
    bodyUpdater: DocumentBodyUpdater,
    documentID: string
    documentGetter: () => AtlasDocument
    documentStateGetter: () => DocumentState,
    view: VFSFolderView
}
