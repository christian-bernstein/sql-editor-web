import {BC} from "../../sql/logic/BernieComponent";
import {Assembly} from "../../sql/logic/assembly/Assembly";
import {Themeable} from "../../sql/logic/style/Themeable";
import {AtlasDocument} from "../data/AtlasDocument";
import {VFSFolderView} from "./VFSFolderView";
import {Flex} from "../../sql/components/lo/FlexBox";
import {DocumentViewController} from "../documentViews/DocumentViewController";
import {OverflowWithHeader} from "../../sql/components/lo/OverflowWithHeader";
import {FlexDirection} from "../../sql/logic/style/FlexDirection";
import {Box} from "../../sql/components/lo/Box";
import {px} from "../../sql/logic/style/DimensionalMeasured";
import {Text, TextType} from "../../sql/components/lo/Text";
import {Separator} from "../../sql/components/lo/Separator";
import {Orientation} from "../../sql/logic/style/Orientation";
import {SettingsElement} from "../../sql/components/ho/settingsElement/SettingsElement";
import {Align} from "../../sql/logic/style/Align";
import {array, getOr} from "../../sql/logic/Utils";
import {Color} from "../../sql/logic/style/Color";
import {ReactComponent as DocumentIcon} from "../../../assets/icons/ic-20/ic20-file.svg";
import {ReactComponent as ActionsIcon} from "../../../assets/icons/ic-20/ic20-more-ver.svg";
import {ReactComponent as PendingIcon} from "../../../assets/icons/ic-20/ic20-hourglass-progress.svg";
import {ReactComponent as SavedIcon} from "../../../assets/icons/ic-20/ic20-check.svg";
import {ReactComponent as CloseIcon} from "../../../assets/icons/ic-20/ic20-close.svg";
import {Icon} from "../../sql/components/lo/Icon";
import {createMargin} from "../../sql/logic/style/Margin";
import {Tooltip} from "../../sql/components/ho/tooltip/Tooltip";
import {Justify} from "../../sql/logic/style/Justify";
import {Badge} from "../../sql/components/lo/Badge";
import {ObjectVisualMeaning, VM} from "../../sql/logic/style/ObjectVisualMeaning";
import {DocumentState} from "../data/DocumentState";
import {DocumentSaveState} from "../data/DocumentSaveState";
import {ContextCompound} from "../../sql/components/ho/contextCompound/ContextCompound";
import {SettingsGroup} from "../../sql/components/lo/SettingsGroup";
import {MultiplexerDocumentTab} from "./multiplexer/MultiplexerDocumentTab";

export type DocumentViewMultiplexerControlConfig = {
    documents: Array<AtlasDocument>
    activeDocumentID?: string,
    groupID: string,
    groupTitle: string,
    view: VFSFolderView
}

export type DocumentViewMultiplexerProps = {
    controlConfigMirror: DocumentViewMultiplexerControlConfig,
    changeActiveDocument: (newActiveDocumentID?: string) => void,
    bodyUpdater: (documentID: string, body: string) => void
}

export class DocumentViewMultiplexer extends BC<DocumentViewMultiplexerProps, any, any> {

    public view(): VFSFolderView {
        return this.props.controlConfigMirror.view;
    }

    private generateViewChannels(...channels: Array<string>): Array<string> {
        return this.view().generateMultiplexerChannel(this.props.controlConfigMirror.groupID, ...channels);
    }

    // TODO: Add refresh function
    public getActiveDocument(): AtlasDocument | undefined {
        if (this.props.controlConfigMirror.activeDocumentID === undefined) {
            return undefined;
        }
        return this.props.controlConfigMirror.documents.filter(doc => doc.id === this.props.controlConfigMirror.activeDocumentID)[0];
    }

    public removeDocument(id: string) {
        this.view().closeAndRemoveDocumentFromMultiplexer(this.props.controlConfigMirror.groupID, id);
    }

    init() {
        super.init();
        this.headerAssembly();
        this.mainAssembly();
        this.footerAssembly();
    }

    private headerAssembly() {
        this.assembly.assembly("header", t => {
            const activeDocument = this.getActiveDocument();
            const p = this.props;
            return (
                <Box
                    fw
                    borderless
                    borderRadiiConfig={{enableCustomBorderRadii: true, fallbackCustomBorderRadii: px(0)}}
                    elements={[
                        <Flex flexDir={FlexDirection.ROW} align={Align.CENTER} gap={t.gaps.smallGab} elements={[
                            <Text text={p.controlConfigMirror.groupTitle}/>,

                            <ContextCompound wrapMenu={false} menu={
                                <Box borderless paddingX={t.gaps.smallGab} paddingY={t.gaps.smallGab} width={px(300)} elements={[
                                    <Flex align={Align.CENTER} fw elements={[
                                        <SettingsGroup title={`Actions for ${p.controlConfigMirror.groupTitle}`} elements={[
                                            <SettingsElement groupDisplayMode title={"Close multiplexer"} iconConfig={{ enable: true, iconGenerator: element => <CloseIcon/> }} onClick={element => {
                                                p.controlConfigMirror.view.closeMultiplexer(p.controlConfigMirror.groupID);
                                            }}/>
                                        ]}/>
                                    ]}/>
                                ]}/>
                            } children={
                                <Icon icon={<ActionsIcon/>} tooltip={"Actions"} size={px(16)}/>
                            }/>,

                            <Separator orientation={Orientation.VERTICAL}/>,


                            activeDocument === undefined ? (
                                <Flex height={px(40)} justifyContent={Justify.CENTER} align={Align.CENTER} elements={[
                                    <Text
                                        text={"No document selected"}
                                        type={TextType.secondaryDescription}
                                        fontSize={px(11)}
                                    />
                                ]}/>
                            ) : (
                                <Flex flexDir={FlexDirection.ROW} gap={t.gaps.smallGab} elements={[
                                    ...p.controlConfigMirror.documents.map(document => {
                                        // const isActive: boolean = document.id === activeDocument?.id;
                                        // const docState: DocumentState = this.view().getDocumentState(document.id);

                                        return (
                                            <MultiplexerDocumentTab
                                                document={document}
                                                multiplexerInstance={this}
                                            />
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
                                        //                     this.view().component(l => (
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
                                        //                     ), this.view().toDocumentSpecificChannel(document.id, "persistence-sync-state")),
                                        //                     <Icon icon={<ActionsIcon/>} tooltip={"Actions"} size={px(16)} onClick={(event) => {
                                        //                         // TODO: Handle -> Open context menu
                                        //                         event.preventDefault();
                                        //                         event.stopPropagation();
                                        //                     }}/>,
                                        //                     <Icon icon={<CloseIcon/>} tooltip={"Close document"} size={px(16)} onClick={(event) => {
                                        //                         this.removeDocument(document.id);
                                        //                         event.preventDefault();
                                        //                         event.stopPropagation();
                                        //                     }}/>
                                        //                 ]}/>
                                        //             );
                                        //         }}
                                        //         promiseBasedOnClick={element => new Promise<void>((resolve, reject) => {
                                        //             try {
                                        //                 this.props.changeActiveDocument(document.id);
                                        //                 resolve();
                                        //             } catch (e) {
                                        //                 console.error(e);
                                        //                 reject();
                                        //             }
                                        //         })}
                                        //     />
                                        // );
                                    })
                                ]}/>
                            )
                        ]}/>,
                    ]}
                />
            );
        })
    }

    private mainAssembly() {
        this.assembly.assembly("main", t => {
            const activeDocument = this.getActiveDocument();
            return (
                <DocumentViewController view={this.props.controlConfigMirror.view} document={
                    activeDocument
                } updateBody={body => {
                    this.props.bodyUpdater(this.getActiveDocument()?.id as string, body);
                }}/>
            );
        })
    }

    private footerAssembly() {
        this.assembly.assembly("footer", t => {
            const activeDocument = this.getActiveDocument();
            return (
                <Box
                    fw
                    borderless
                    borderRadiiConfig={{enableCustomBorderRadii: true, fallbackCustomBorderRadii: px(0)}}
                    elements={[
                        <Flex flexDir={FlexDirection.ROW} align={Align.CENTER} elements={[
                            <Text text={"ViewMultiplexer footer"} fontSize={px(11)} type={TextType.secondaryDescription}/>
                        ]}/>,
                    ]}
                />
            );
        })
    }

    componentRender(p: DocumentViewMultiplexerProps, s: any, l: any, t: Themeable.Theme, a: Assembly): JSX.Element | undefined {
        return p.controlConfigMirror.view.component(local => {
            const activeDocument = this.getActiveDocument();

            return (
                <Flex fw flexDir={FlexDirection.ROW} gap={px()} elements={[
                    <Separator orientation={Orientation.VERTICAL}/>,
                    <OverflowWithHeader
                        dir={FlexDirection.COLUMN_REVERSE}
                        staticContainer={{
                            gap: px(),
                            elements: [
                                this.a("header"),
                                <Separator/>
                            ]
                        }}
                        overflowContainer={{
                            elements: [
                                this.a("main")
                            ]
                        }}
                        staticContainerHeader={{
                            gap: px(),
                            elements: [
                                <Separator/>,
                                this.a("footer")
                            ]
                        }}
                    />
                ]}/>
            );
        }, ...this.generateViewChannels("main"))
    }
}
