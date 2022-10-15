import {BC} from "../../../logic/BernieComponent";
import {AtlasDocument} from "../data/AtlasDocument";
import {Assembly} from "../../../logic/assembly/Assembly";
import {Themeable} from "../../../logic/style/Themeable";
import {inDevDocumentView} from "./views/InDevDocumentView";

export type DocumentViewControllerProps = {
    document?: AtlasDocument
}

export class DocumentViewController extends BC<DocumentViewControllerProps, any, any> {

    componentRender(p: DocumentViewControllerProps, s: any, l: any, t: Themeable.Theme, a: Assembly): JSX.Element | undefined {
        if (p.document === undefined) {
            return (
                <>empty</>
            );
        } else {
            return inDevDocumentView.renderer(p.document);
        }
    }
}
