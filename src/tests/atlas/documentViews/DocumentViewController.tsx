import {BC} from "../../../logic/BernieComponent";
import {AtlasDocument} from "../data/AtlasDocument";
import {Assembly} from "../../../logic/assembly/Assembly";
import {Themeable} from "../../../logic/style/Themeable";
import {inDevDocumentView} from "./views/InDevDocumentView";
import {Centered} from "../../../components/lo/PosInCenter";
import {Text, TextType} from "../../../components/lo/Text";
import {Flex} from "../../../components/lo/FlexBox";
import {px} from "../../../logic/style/DimensionalMeasured";
import {Align} from "../../../logic/style/Align";
import {Justify} from "../../../logic/style/Justify";
import {VFSFolderView} from "../components/VFSFolderView";
import {DocumentViewRenderContext} from "./DocumentViewRenderContext";
import {AtlasMain} from "../AtlasMain";
import {DocumentBodyUpdaterInstruction} from "./DocumentBodyUpdaterInstruction";

export type DocumentViewControllerProps = {
    view: VFSFolderView,
    document?: AtlasDocument,
    updateBody: (body: string) => void
}

export class DocumentViewController extends BC<DocumentViewControllerProps, any, any> {

    componentRender(p: DocumentViewControllerProps, s: any, l: any, t: Themeable.Theme, a: Assembly): JSX.Element | undefined {
        if (p.document === undefined) {
            return (
                <Centered fullHeight children={
                    <Flex align={Align.CENTER} justifyContent={Justify.CENTER} elements={[
                        <Text text={"No document selected"} type={TextType.secondaryDescription}/>,
                        <Text text={"Select a document from the folder view"} type={TextType.secondaryDescription} fontSize={px(11)}/>
                    ]}/>
                }/>
            );
        } else {
            const computedDocID = p.document?.id ?? "special@fallback";
            return inDevDocumentView.renderer(new DocumentViewRenderContext({
                view: p.view,
                documentID: p.document.id,
                documentGetter: () => AtlasMain.atlas().api().getDocument(computedDocID),
                documentStateGetter: () => p.view.getDocumentState(computedDocID),
                bodyUpdater: {
                    update: (instruction: DocumentBodyUpdaterInstruction) => {
                        // TODO implement better solution (bypass debouncing)
                        p.updateBody(instruction.newBody);
                    }
                }
            }));
        }
    }
}
