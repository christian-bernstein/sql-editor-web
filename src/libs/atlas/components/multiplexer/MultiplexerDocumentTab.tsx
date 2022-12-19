import {BernieComponent} from "../../../sql/logic/BernieComponent";
import {Themeable} from "../../../sql/logic/style/Themeable";
import {Assembly} from "../../../sql/logic/assembly/Assembly";
import {AtlasDocument} from "../../data/AtlasDocument";
import {DocumentViewMultiplexer} from "../DocumentViewMultiplexer";
import {DocumentState} from "../../data/DocumentState";
import {VFSFolderView} from "../VFSFolderView";
import {Flex, FlexRow} from "../../../sql/components/lo/FlexBox";
import {px} from "../../../sql/logic/style/DimensionalMeasured";
import {Box} from "../../../sql/components/lo/Box";
import {Description} from "../../../sql/components/lo/Description";
import {If} from "../../../sql/components/logic/If";
import {DocumentSaveState} from "../../data/DocumentSaveState";
import {Icon} from "../../../sql/components/lo/Icon";
import {VM} from "../../../sql/logic/style/ObjectVisualMeaning";
import {ReactComponent as PendingIcon} from "../../../../assets/icons/ic-20/ic20-hourglass-progress.svg";
import {ReactComponent as SavedIcon} from "../../../../assets/icons/ic-20/ic20-check.svg";
import {ReactComponent as ActionsIcon} from "../../../../assets/icons/ic-20/ic20-more-ver.svg";
import {ReactComponent as CloseIcon} from "../../../../assets/icons/ic-20/ic20-close.svg";
import {Align} from "../../../sql/logic/style/Align";
import {Cursor} from "../../../sql/logic/style/Cursor";
import {Dot} from "../../../sql/components/lo/Dot";
import {IconLookup} from "../../icons/IconLookup";
import {AtlasMain} from "../../AtlasMain";
import {ObjectJSONDisplay} from "../../../sql/components/ho/objectJSONDisplay/ObjectJSONDisplay";

export type MultiplexerDocumentTabProps = {
    document: AtlasDocument,
    multiplexerInstance: DocumentViewMultiplexer
}

export class MultiplexerDocumentTab extends BernieComponent<MultiplexerDocumentTabProps, any, any> {

    componentRender(p: MultiplexerDocumentTabProps, s: any, l: any, t: Themeable.Theme, a: Assembly): JSX.Element | undefined {
        const document: AtlasDocument = p.document;
        const mux: DocumentViewMultiplexer = p.multiplexerInstance;
        const view: VFSFolderView = mux.view();
        const atlas: AtlasMain = AtlasMain.atlas();
        const isActive: boolean = document.id === mux.getActiveDocument()?.id;
        const docState: DocumentState = view.getDocumentState(document.id);
        const defaultFileTypeIcon: IconLookup = { dict: "atlas", "id": "generic-file" };

        return (
            <Box cursor={Cursor.pointer} paddingY={t.gaps.smallGab} paddingX={t.gaps.smallGab} style={{ position: "relative" }} onClick={event => {
                if (!isActive) {
                    mux.props.changeActiveDocument(document.id);
                    event.stopPropagation();
                    event.preventDefault();
                }
            }} elements={[
                // Static content
                <FlexRow align={Align.CENTER} gap={t.gaps.smallGab} fh fw elements={[
                    <Icon icon={atlas.getIconFromLookup(document.icon ?? defaultFileTypeIcon)}/>,
                    <Description text={document.title ?? "Unnamed"} renderMarkdown={false} cursor={Cursor.pointer}/>,
                    <Dot/>,
                    view.component(l => (
                        (() => {
                            switch (docState.saveState) {
                                case DocumentSaveState.SAVED:
                                    return (
                                        <Icon
                                            icon={<SavedIcon/>}
                                            tooltip={"Saved"}
                                            colored
                                            visualMeaning={VM.UI_NO_HIGHLIGHT}
                                            size={px(16)}
                                        />
                                    );
                                case DocumentSaveState.PENDING:
                                    return (
                                        <Icon
                                            icon={<PendingIcon/>}
                                            tooltip={"Pending changes are getting saved"}
                                            colored
                                            visualMeaning={VM.WARNING}
                                            size={px(16)}
                                        />
                                    );
                            }
                        })()
                    ), view.toDocumentSpecificChannel(document.id, "persistence-sync-state")),
                    <Icon icon={<ActionsIcon/>} coloredOnDefault={false} uiNoHighlightOnDefault tooltip={"Actions"} size={px(16)} onClick={(event) => {
                        // TODO: Handle -> Open context menu
                        event.preventDefault();
                        event.stopPropagation();
                    }}/>,

                    <Icon icon={<CloseIcon/>} coloredOnDefault={false} uiNoHighlightOnDefault tooltip={"Close document"} size={px(20)} onClick={(event) => {
                        mux.removeDocument(document.id);
                        event.preventDefault();
                        event.stopPropagation();
                    }}/>
                ]}/>,
                <If condition={isActive} ifTrue={
                    <Flex height={px(3)} padding={false} style={{
                        backgroundColor: t.colors.primaryHighlightColor.css(),
                        borderRadius: "10px",
                        width: "calc(100% - 20px)",
                        position: "absolute",
                        transform: "translate(-50%, 0)",
                        left: "50%",
                        bottom: "-11px",
                    }}/>
                }/>
            ]}/>
        );

        // return (
        //     <SettingsElement
        //         visualMeaning={isActive ? ObjectVisualMeaning.INFO : ObjectVisualMeaning.UI_NO_HIGHLIGHT}
        //         title={getOr(document.title, "N/A")}
        //         iconConfig={{
        //             enable: true,
        //             color: document.iconColorHEX === undefined ? undefined : Color.ofHex(document.iconColorHEX),
        //             iconGenerator: element => (
        //                 <DocumentIcon/>
        //             )
        //         }}
        //         appendixGenerator={element => {
        //             return (
        //                 <Flex flexDir={FlexDirection.ROW} align={Align.CENTER} gap={t.gaps.smallGab} margin={createMargin(0, t.gaps.smallGab.measurand, 0, 0)} elements={[
        //                     isActive ? (
        //                         Badge.badge("Open", {
        //                             visualMeaning: ObjectVisualMeaning.INFO
        //                         })
        //                     ) : <></>,
        //                     view.component(l => (
        //                         (() => {
        //                             switch (docState.saveState) {
        //                                 case DocumentSaveState.SAVED:
        //                                     return (
        //                                         <Icon
        //                                             icon={<SavedIcon/>}
        //                                             tooltip={"Saved"}
        //                                             size={px(16)}
        //                                         />
        //                                     );
        //                                 case DocumentSaveState.PENDING:
        //                                     return (
        //                                         <Icon
        //                                             icon={<PendingIcon/>}
        //                                             tooltip={"Pending changes are getting saved"}
        //                                             colored
        //                                             visualMeaning={VM.WARNING}
        //                                             size={px(16)}
        //                                         />
        //                                     );
        //                             }
        //                         })()
        //                     ), view.toDocumentSpecificChannel(document.id, "persistence-sync-state")),
        //                     <Icon icon={<ActionsIcon/>} tooltip={"Actions"} size={px(16)} onClick={(event) => {
        //                         // TODO: Handle -> Open context menu
        //                         event.preventDefault();
        //                         event.stopPropagation();
        //                     }}/>,
        //                     <Icon icon={<CloseIcon/>} tooltip={"Close document"} size={px(16)} onClick={(event) => {
        //                         mux.removeDocument(document.id);
        //                         event.preventDefault();
        //                         event.stopPropagation();
        //                     }}/>
        //                 ]}/>
        //             );
        //         }}
        //         promiseBasedOnClick={element => new Promise<void>((resolve, reject) => {
        //             try {
        //                 mux.props.changeActiveDocument(document.id);
        //                 resolve();
        //             } catch (e) {
        //                 console.error(e);
        //                 reject();
        //             }
        //         })}
        //     />
        // );
    }
}
