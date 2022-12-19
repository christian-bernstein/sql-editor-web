import {DocumentView} from "../DocumentView";
import {DocumentViewRenderContext} from "../DocumentViewRenderContext";
import {BC} from "../../../sql/logic/BernieComponent";
import {Themeable} from "../../../sql/logic/style/Themeable";
import {Assembly} from "../../../sql/logic/assembly/Assembly";
import {DocumentState} from "../../data/DocumentState";
import {VFSFolderView} from "../../components/VFSFolderView";
import {WebsiteDocumentArchetype} from "../../data/documentArchetypes/WebsiteDocumentArchetype";
import React from "react";
import {PDFDocumentArchetype} from "../../data/documentArchetypes/PDFDocumentArchetype";

export const pdfDocumentView: DocumentView = {
    renderer: (context) => {
        return (
            <PDFDocumentView context={context}/>
        );
    }
}

type PDFDocumentViewProps = {
    context: DocumentViewRenderContext
}

class PDFDocumentView extends BC<PDFDocumentViewProps, any, any> {

    componentRender(p: PDFDocumentViewProps, s: any, l: any, t: Themeable.Theme, a: Assembly): JSX.Element | undefined {
        // const docState: DocumentState = view.getDocumentState(document.id);
        const document = p.context.data.documentGetter();
        const docState: DocumentState = p.context.data.documentStateGetter();
        const view: VFSFolderView = p.context.data.view;

        let dataURL: string = "";
        try {
            dataURL = (JSON.parse(document.body as string) as PDFDocumentArchetype).dataURL ?? "Cannot load..";
        } catch (e) {
            console.error(e);
        }

        return (
            <iframe
                src={dataURL}
                width={"100%"}
                height={"100%"}
                style={{ border: "none" }}
            />
        );
    }
}
