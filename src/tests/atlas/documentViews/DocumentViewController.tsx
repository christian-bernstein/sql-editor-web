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
import {DocumentType} from "../data/DocumentType";
import {markdownDocumentView} from "./views/MarkdownDocumentView";
import {websiteDocumentView} from "./views/WebsiteDocumentView";
import {pdfDocumentView} from "./views/PDFDocumentView";
import {AF} from "../../../components/logic/ArrayFragment";
import {Q, Queryable} from "../../../logic/query/Queryable";
import {Optional} from "../../../logic/Optional";
import {HyperionStorableEntry} from "../../../frameworks/hyperion/HyperionStorableEntry";
import {HyperionAPI} from "../../../frameworks/hyperion/HyperionAPI";
import {Description} from "../../../components/lo/Description";
import {QueryError} from "../../../logic/query/QueryError";
import {QueryDisplay} from "../../../components/logic/QueryDisplay";
import {HyperionIndexedDBStreamAdapter} from "../../../frameworks/hyperion/HyperionIndexedDBStreamAdapter";

export type DocumentViewControllerProps = {
    view: VFSFolderView,
    document?: AtlasDocument,
    updateBody: (body: string) => void
}

export type DocumentViewControllerLocalState = {
    backgroundImageQueryable: Q<Optional<HyperionStorableEntry>>
}

export class DocumentViewController extends BC<DocumentViewControllerProps, any, DocumentViewControllerLocalState> {

    constructor(props: DocumentViewControllerProps) {
        super(props, undefined, {
            backgroundImageQueryable: new Q<Optional<HyperionStorableEntry>>({
                component: () => this,
                fallback: undefined,
                listeners: ["background-image"],
                process: (resolve, reject) => HyperionAPI.hyperion().get("document-view-background-image").then(value => resolve(value))
            })
        });
    }

    componentDidMount() {
        super.componentDidMount();
        this.ls().backgroundImageQueryable.query();
    }

    componentRender(p: DocumentViewControllerProps, s: any, l: any, t: Themeable.Theme, a: Assembly): JSX.Element | undefined {
        if (p.document === undefined) {
            return (
                <Centered style={{ position: "relative" }} fullHeight children={
                    <AF elements={[
                        this.component(() => (
                            <Flex fw fh style={{ position: "absolute" }} elements={[
                                <QueryDisplay q={this.ls().backgroundImageQueryable} renderer={{
                                    success(q: Queryable<Optional<HyperionStorableEntry>>, data: Optional<HyperionStorableEntry>): JSX.Element {
                                        if (data === undefined || data.value === undefined) {
                                            return <Description text={"Couldn't load background image"}/>
                                        }
                                        return (
                                            <img
                                                width={"100%"}
                                                height={"100%"}
                                                alt={"Background image"}
                                                src={data.value}
                                                style={{
                                                    objectFit: "cover",
                                                    userSelect: "none"
                                                }}
                                            />
                                        );
                                    }
                                }}/>
                            ]}/>
                        ), ...Q.allChannels("background-image")),

                        <Flex align={Align.CENTER} justifyContent={Justify.CENTER} elements={[
                            <Text text={"No document selected"} type={TextType.secondaryDescription}/>,
                            <Text text={"Select a document from the folder view"} type={TextType.secondaryDescription} fontSize={px(11)}/>
                        ]}/>
                    ]}/>
                }/>
            );
        } else {
            const computedDocID = p.document?.id ?? "special@fallback";

            // TODO: MAKE BETTER!!!

            if (p.document.documentType === DocumentType.PDF) {
                return pdfDocumentView.renderer(new DocumentViewRenderContext({
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
                }))
            }

            if (p.document.documentType === DocumentType.WEBSITE) {
                return websiteDocumentView.renderer(new DocumentViewRenderContext({
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
                }))
            }

            if (p.document.documentType === DocumentType.MARKDOWN) {
                return markdownDocumentView.renderer(new DocumentViewRenderContext({
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
                }))
            }

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
