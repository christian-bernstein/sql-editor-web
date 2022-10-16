import {BC} from "../../../logic/BernieComponent";
import {Assembly} from "../../../logic/assembly/Assembly";
import {Themeable} from "../../../logic/style/Themeable";
import {AtlasDocument} from "../data/AtlasDocument";
import {VFSFolderView} from "./VFSFolderView";
import {Flex} from "../../../components/lo/FlexBox";
import {DocumentViewController} from "../documentViews/DocumentViewController";
import {OverflowWithHeader} from "../../../components/lo/OverflowWithHeader";
import {FlexDirection} from "../../../logic/style/FlexDirection";
import {Box} from "../../../components/lo/Box";
import {px} from "../../../logic/style/DimensionalMeasured";
import {Text, TextType} from "../../../components/lo/Text";
import {Separator} from "../../../components/lo/Separator";
import {Orientation} from "../../../logic/style/Orientation";
import {SettingsElement} from "../../../components/ho/settingsElement/SettingsElement";
import {Align} from "../../../logic/style/Align";
import {getOr} from "../../../logic/Utils";
import {Color} from "../../../logic/style/Color";
import {ReactComponent as DocumentIcon} from "../../../assets/icons/ic-20/ic20-file.svg";
import {ReactComponent as ActionsIcon} from "../../../assets/icons/ic-20/ic20-more-ver.svg";
import {ReactComponent as PendingIcon} from "../../../assets/icons/ic-20/ic20-hourglass-progress.svg";
import {ReactComponent as SavedIcon} from "../../../assets/icons/ic-20/ic20-check.svg";
import {ReactComponent as CloseIcon} from "../../../assets/icons/ic-20/ic20-close.svg";
import {Icon} from "../../../components/lo/Icon";
import {createMargin} from "../../../logic/style/Margin";
import {Tooltip} from "../../../components/ho/tooltip/Tooltip";
import {Justify} from "../../../logic/style/Justify";
import {Badge} from "../../../components/lo/Badge";
import {ObjectVisualMeaning, VM} from "../../../logic/style/ObjectVisualMeaning";
import {DocumentState} from "../data/DocumentState";
import {DocumentSaveState} from "../data/DocumentSaveState";

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

    private view(): VFSFolderView {
        return this.props.controlConfigMirror.view;
    }

    private generateViewChannels(...channels: Array<string>): Array<string> {
        return this.view().generateMultiplexerChannel(this.props.controlConfigMirror.groupID, ...channels);
    }

    // TODO: Add refresh function
    private getActiveDocument(): AtlasDocument | undefined {
        if (this.props.controlConfigMirror.activeDocumentID === undefined) {
            return undefined;
        }
        return this.props.controlConfigMirror.documents.filter(doc => doc.id === this.props.controlConfigMirror.activeDocumentID)[0];
    }

    private removeDocument(id: string) {
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
                        <Flex flexDir={FlexDirection.ROW} align={Align.CENTER} elements={[
                            <Text text={p.controlConfigMirror.groupTitle}/>,
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
                                        const isActive: boolean = document.id === activeDocument?.id;
                                        const docState: DocumentState = this.view().getDocumentState(document.id);

                                        return (
                                            <SettingsElement
                                                visualMeaning={isActive ? ObjectVisualMeaning.INFO : ObjectVisualMeaning.UI_NO_HIGHLIGHT}
                                                title={getOr(document.title, "N/A")}
                                                iconConfig={{
                                                    enable: true,
                                                    color: document.iconColorHEX === undefined ? undefined : Color.ofHex(document.iconColorHEX),
                                                    iconGenerator: element => (
                                                        <DocumentIcon/>
                                                    )
                                                }}
                                                appendixGenerator={element => {
                                                    return (
                                                        <Flex flexDir={FlexDirection.ROW} align={Align.CENTER} gap={t.gaps.smallGab} margin={createMargin(0, t.gaps.smallGab.measurand, 0, 0)} elements={[
                                                            isActive ? (
                                                                Badge.badge("Open", {
                                                                    visualMeaning: ObjectVisualMeaning.INFO
                                                                })
                                                            ) : <></>,

                                                            this.view().component(l => (
                                                                (() => {
                                                                    switch (docState.saveState) {
                                                                        case DocumentSaveState.SAVED:
                                                                            return (
                                                                                <Tooltip title={"Saved"} children={
                                                                                    <Icon icon={<SavedIcon/>} size={px(16)}/>
                                                                                }/>
                                                                            );
                                                                        case DocumentSaveState.PENDING:
                                                                            return (
                                                                                <Tooltip title={"Pending changes are getting saved"} children={
                                                                                    <Icon icon={<PendingIcon/>} colored visualMeaning={VM.WARNING} size={px(16)}/>
                                                                                }/>
                                                                            );
                                                                    }
                                                                })()
                                                            ), this.view().toDocumentSpecificChannel(document.id, "persistence-sync-state")),


                                                            <Tooltip title={"Actions"} children={
                                                                <Icon icon={<ActionsIcon/>} size={px(16)} onClick={(event) => {
                                                                    // TODO: Handle -> Open context menu
                                                                    event.stopPropagation();
                                                                }}/>
                                                            }/>,

                                                            <Tooltip title={"Close document"} children={
                                                                <Icon icon={<CloseIcon/>} size={px(16)} onClick={(event) => {
                                                                    this.removeDocument(document.id);
                                                                    event.stopPropagation();
                                                                }}/>
                                                            }/>
                                                        ]}/>
                                                    );
                                                }}
                                                promiseBasedOnClick={element => new Promise<void>((resolve, reject) => {
                                                    try {
                                                        this.props.changeActiveDocument(document.id);
                                                        resolve();
                                                    } catch (e) {
                                                        console.error(e);
                                                        reject();
                                                    }
                                                })}
                                            />
                                        );
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
