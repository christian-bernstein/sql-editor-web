import {BC} from "../../../logic/BernieComponent";
import {Themeable} from "../../../logic/style/Themeable";
import {Assembly} from "../../../logic/assembly/Assembly";
import {Screen} from "../../../components/lo/Page";
import {Flex} from "../../../components/lo/FlexBox";
import {FlexDirection} from "../../../logic/style/FlexDirection";
import {Text, TextType} from "../../../components/lo/Text";
import {px} from "../../../logic/style/DimensionalMeasured";
import {ReactComponent as ExitIcon} from "../../../assets/icons/ic-20/ic20-close.svg";
import {ReactComponent as SettingsIcon} from "../../../assets/icons/ic-20/ic20-settings.svg";
import {Icon} from "../../../components/lo/Icon";
import {Justify} from "../../../logic/style/Justify";
import {Align} from "../../../logic/style/Align";
import {Button} from "../../../components/lo/Button";
import {SettingsGroup} from "../../../components/lo/SettingsGroup";
import {DrawerHeader} from "../../../components/lo/DrawerHeader";
import {ObjectVisualMeaning, VM} from "../../../logic/style/ObjectVisualMeaning";
import {Dot} from "../../../components/lo/Dot";
import {OverflowBehaviour} from "../../../logic/style/OverflowBehaviour";
import {FlexWrap} from "../../../logic/style/FlexWrap";
import {Box} from "../../../components/lo/Box";
import {Cursor} from "../../../logic/style/Cursor";
import React from "react";
import {OverflowWithHeader} from "../../../components/lo/OverflowWithHeader";
import {ReactComponent as AttachmentIcon} from "../../../assets/icons/ic-20/ic20-attachment.svg";
import {ReactComponent as CreateIcon} from "../../../assets/icons/ic-20/ic20-edit.svg";
import {AtlasMain} from "../AtlasMain";
import {FolderComponent} from "./FolderComponent";
import {Q, Queryable} from "../../../logic/query/Queryable";
import {Folder} from "../data/Folder";
import {QueryDisplay} from "../../../components/logic/QueryDisplay";
import {FolderSetupDialog} from "./FolderSetupDialog";
import {AF} from "../../../components/logic/ArrayFragment";
import {Tooltip} from "../../../components/ho/tooltip/Tooltip";
import {createMargin} from "../../../logic/style/Margin";
import {StaticDrawerMenu} from "../../../components/lo/StaticDrawerMenu";
import {AtlasDocument} from "../data/AtlasDocument";
import {IAtlasAPI} from "../api/IAtlasAPI";
import {DocumentComponent} from "./DocumentComponent";
import {UnresolvedDocumentComponent} from "./UnresolvedDocumentComponent";
import {DocumentSetupDialog} from "./DocumentSetupDialog";
import {DocumentCreateWizard} from "./DocumentCreateWizard";
import {DocumentViewController} from "../documentViews/DocumentViewController";

export type VFSFolderViewProps = {
    initialFolderID?: string,
    onClose: () => void
}

export type VFSFolderViewLocalState = {
    currentFolderData: Q<Folder | undefined>
    currentFolderID?: string,

    openedDocument?: AtlasDocument
}

export class VFSFolderView extends BC<VFSFolderViewProps, any, VFSFolderViewLocalState> {

    constructor(props: VFSFolderViewProps) {
        super(props, undefined, {
            currentFolderID: props.initialFolderID ?? "root",
            currentFolderData: new Queryable<Folder | undefined>({
                component: () => this,
                listeners: ["current-folder"],
                fallback: undefined,
                process: (resolve, reject) => {
                    const rootFolderID: string = this.local.state.currentFolderID ?? props.initialFolderID ?? "root";
                    let currentFolder: Folder | undefined = AtlasMain.atlas().api().getFolder(rootFolderID);

                    if (currentFolder === undefined) {
                        currentFolder = {
                            categories: new Array<string>(),
                            title: "root",
                            id: "root",
                            description: "All your folders at-a-glance\nPress on the context icon to see available actions, like creating folders or accessing ISO-image manager",
                            tags: ["internal"]
                        }
                        if (AtlasMain.atlas().api().createFolder(currentFolder)) {
                            resolve(currentFolder);
                        } else {
                            reject();
                        }
                    } else {
                        resolve(currentFolder);
                    }
                }
            })
        });
    }

    private onClose() {
        this.props.onClose();
    }

    getCurrentFolder(): Folder {
        return this.local.state.currentFolderData.get()[0] as Folder;
    }

    componentDidMount() {
        super.componentDidMount();
        this.local.state.currentFolderData.query();
    }

    init() {
        super.init();
        this.folderViewAssembly();
        this.documentViewAssembly();
        this.folderLevelViewAssembly();
    }

    private updateCurrentFolder(newFolderID: string) {
        this.local.setState({
            currentFolderID: newFolderID
        }, new Map<string, any>(), () => {
            this.reloadFolderView();
        });
    }

    // TODO: merge with updateCurrentFolder(..)
    reloadFolderView() {
        this.local.state.currentFolderData.query();
        this.rerender("current-folder");
    }

    private folderLevelViewAssembly() {
        this.assembly.assembly("folder-level-view", theme => {
            const currentFolder = this.local.state.currentFolderData.get()[0];
            const tree: Array<Folder> = new Array<Folder>();

            let folder = currentFolder;
            tree.push(folder as Folder);
            while (folder?.parentFolder !== undefined) {
                folder = AtlasMain.atlas().api().getFolder(folder.parentFolder);
                tree.push(folder);
            }

            return (
                <Flex flexDir={FlexDirection.ROW} gap={theme.gaps.smallGab} align={Align.CENTER} elements={
                    tree.reverse().map((folder, index, array) => {
                        const isLast = !(index + 1 < array.length);
                        return (
                            <AF elements={[
                                <Tooltip title={`Go to ${folder.id}`} arrow children={
                                    <Text
                                        text={`${folder.title}`}
                                        cursor={Cursor.pointer}
                                        highlight={isLast}
                                        coloredText={isLast}
                                        visualMeaning={isLast ? VM.INFO : VM.UI_NO_HIGHLIGHT}
                                        onClick={() => {
                                            if (!isLast) {
                                                this.updateCurrentFolder(folder.id);
                                            }
                                        }
                                    }/>
                                }/>,
                                // !isLast ? <Dot/> : undefined
                                <Text text={"/"} type={TextType.secondaryDescription}/>
                            ]}/>
                        );
                    })
                }/>
            );
        })
    }

    private openCreateFolderSetup() {
        this.dialog(
            <StaticDrawerMenu body={props => (
                <FolderSetupDialog actions={{
                    onSubmit: (folder: Folder) => {
                        const [parentFolder] = this.local.state.currentFolderData.get();
                        if (parentFolder === undefined) {
                            return false;
                        }
                        folder.parentFolder = parentFolder.id;
                        try {
                            AtlasMain.atlas().api().createSubFolder(parentFolder.id, folder);
                            setTimeout(() => {
                                AtlasMain.atlas(atlas => {
                                    atlas.rerender("folders");
                                });
                            }, 1);
                            this.closeLocalDialog();
                            this.reloadFolderView();

                            return true;
                        } catch (e) {
                            return false;
                        }
                    }
                }}/>
            )}/>
        );
    }

    private openCreateBlankDocumentSetup() {
        this.dialog(
            <DocumentCreateWizard
                view={this}
                currentFolder={this.getCurrentFolder()}
            />
        );
    }

    private folderViewAssembly() {
        this.assembly.assembly("folder-view", theme => {
            const currentFolder = this.local.state.currentFolderData.get()[0] as Folder;
            const subFolders = AtlasMain.atlas().api().getAllFolders({
                test(subFolder: Folder): boolean {
                    return !!currentFolder.subFolderIDs?.includes(subFolder.id);
                }
            });

            return (
                <Flex fw elements={[
                    <Flex fw elements={[
                        <Flex fw flexDir={FlexDirection.ROW} align={Align.CENTER} justifyContent={Justify.SPACE_BETWEEN} elements={[
                            <Flex flexDir={FlexDirection.ROW} align={Align.CENTER} gap={theme.gaps.smallGab} elements={[
                                <Text text={"Folders"} bold/>,
                                <Dot/>,
                                <Text text={`${subFolders.length}`} type={TextType.secondaryDescription}/>,
                            ]}/>,

                            <Flex flexDir={FlexDirection.ROW} align={Align.CENTER} gap={theme.gaps.smallGab} elements={[
                                <Tooltip title={"Create folder"} arrow children={
                                    <Icon icon={<CreateIcon/>} size={px(16)} onClick={() => this.openCreateFolderSetup()}/>
                                }/>
                            ]}/>,
                        ]}/>,

                        subFolders.length > 0 ? (
                            <SettingsGroup elements={
                                subFolders.map(folder => {
                                    return (
                                        <FolderComponent data={folder} onSelect={(component, data) => new Promise<void>((resolve, reject) => {
                                            this.local.setState({
                                                currentFolderID: data.id
                                            }, new Map<string, any>(), () => {
                                                this.reloadFolderView();
                                            });
                                        })}/>
                                    );
                                })
                            }/>
                        ) : (
                            <Flex margin={createMargin(20, 0, 20, 0)} fw align={Align.CENTER} justifyContent={Justify.CENTER} gap={px()} elements={[
                                <Text
                                    text={"Empty"}
                                    // fontSize={px(11)}
                                    type={TextType.secondaryDescription}
                                    bold
                                />,
                                <Text
                                    text={"Create folder"}
                                    fontSize={px(11)}
                                    cursor={Cursor.pointer}
                                    highlight
                                    coloredText
                                    visualMeaning={VM.INFO}
                                    type={TextType.secondaryDescription}
                                    onClick={() => this.openCreateFolderSetup()}
                                />
                            ]}/>
                        )
                    ]}/>,
                ]}/>
            );
        });
    }

    private openDocument(data: AtlasDocument) {
        this.local.setStateWithChannels({
            openedDocument: data
        }, ["opened-document"])
    }

    private documentViewAssembly() {
        this.assembly.assembly("document-view", theme => {
            const documentIDs: Array<string> = this.getCurrentFolder().documentsIDs ?? new Array<string>();
            const documents: Array<AtlasDocument> = new Array<AtlasDocument>();

            AtlasMain.atlas(atlas => {
                const api: IAtlasAPI = atlas.api();
                documentIDs.forEach(docID => {
                    try {
                        const doc: AtlasDocument = api.getDocument(docID);
                        documents.push(doc);
                    } catch (e) {
                        console.error(e);
                    }
                });
            });



            return (
                <Flex fw elements={[
                    <Flex fw elements={[
                        <Flex fw flexDir={FlexDirection.ROW} align={Align.CENTER} justifyContent={Justify.SPACE_BETWEEN} elements={[
                            <Flex flexDir={FlexDirection.ROW} align={Align.CENTER} gap={theme.gaps.smallGab} elements={[
                                <Text text={"Documents"} bold/>,
                                <Dot/>,
                                <Text text={`${documents.length}`} type={TextType.secondaryDescription}/>,
                            ]}/>,

                            <Flex flexDir={FlexDirection.ROW} align={Align.CENTER} gap={theme.gaps.smallGab} elements={[
                                <Tooltip title={"Create document"} arrow children={
                                    <Icon icon={<CreateIcon/>} size={px(16)} onClick={() => this.openCreateBlankDocumentSetup()}/>
                                }/>
                            ]}/>,
                        ]}/>,

                        documents.length > 0 ? (
                            <SettingsGroup elements={
                                documents.map(doc => {
                                    try {
                                        return (
                                            <DocumentComponent data={doc} onSelect={(element, data) => {
                                                this.openDocument(data);
                                                return "break";
                                            }}/>
                                        );
                                    } catch (e) {
                                        return (
                                            <UnresolvedDocumentComponent id={doc.id} error={e}/>
                                        );
                                    }
                                })
                            }/>
                        ) : (
                            <Flex margin={createMargin(20, 0, 20, 0)} fw align={Align.CENTER} justifyContent={Justify.CENTER} gap={px()} elements={[
                                <Text
                                    text={"Empty"}
                                    // fontSize={px(11)}
                                    type={TextType.secondaryDescription}
                                    bold
                                />,
                                <Text
                                    text={"Create document"}
                                    fontSize={px(11)}
                                    cursor={Cursor.pointer}
                                    highlight
                                    coloredText
                                    visualMeaning={VM.INFO}
                                    type={TextType.secondaryDescription}
                                    onClick={() => this.openCreateBlankDocumentSetup()}
                                />
                            ]}/>
                        )
                    ]}/>
                ]}/>
            );
        });
    }

    componentRender(p: any, s: any, l: any, t: Themeable.Theme, a: Assembly): JSX.Element | undefined {
        return (
            <Screen deactivatePadding children={
                <OverflowWithHeader dir={FlexDirection.COLUMN_REVERSE} staticContainer={{
                    elements: [
                        <Flex fw padding paddingX={px(32)} paddingY={px(16)} style={{ backgroundColor: "#161b22" }} align={Align.CENTER} flexDir={FlexDirection.ROW} justifyContent={Justify.SPACE_BETWEEN} elements={[
                            <Icon icon={<AttachmentIcon/>}/>,
                            // <Input width={px(500)} placeholder={"Search"}/>,

                            <Button border={false} onClick={() => this.onClose()} children={
                                <Flex fw fh justifyContent={Justify.CENTER} align={Align.CENTER} elements={[
                                    <Icon icon={<ExitIcon/>}/>
                                ]}/>
                            }/>
                        ]}/>
                    ]
                }} overflowContainer={{
                    elements: [
                        <Flex fh fw gap={px()} flexDir={FlexDirection.ROW} elements={[
                            <Flex fh width={px(500)}  style={{ backgroundColor: t.colors.backgroundHighlightColor.css() }} elements={[
                                <OverflowWithHeader dir={FlexDirection.COLUMN_REVERSE} staticContainer={{
                                    elements: [
                                        <Flex fw padding align={Align.CENTER} flexDir={FlexDirection.ROW} justifyContent={Justify.CENTER} elements={[
                                            <Icon icon={<AttachmentIcon/>}/>,
                                            <Flex fw fh justifyContent={Justify.CENTER} gap={t.gaps.smallGab} align={Align.CENTER} elements={[
                                                // Badge.beta(),
                                                <Text text={"Atlas Document Viewer"} bold/>,
                                            ]}/>,
                                            <Icon icon={<SettingsIcon/>}/>
                                        ]}/>
                                    ]
                                }} overflowContainer={{
                                    elements: [
                                        <Flex height={px(50)} fw fh padding style={{ backgroundColor: t.colors.backgroundHighlightColor.css() }} elements={[
                                            this.component(() => this.a("folder-level-view"), "current-folder"),

                                            this.component(() => (
                                                <QueryDisplay<Folder | undefined> q={this.local.state.currentFolderData} renderer={{
                                                    processing(q: Queryable<Folder | undefined>): JSX.Element {
                                                        return (
                                                            <>processing..</>
                                                        );
                                                    },
                                                    success: (q: Queryable<Folder | undefined>, data: Folder | undefined) => {
                                                        return (
                                                            <Flex fw fh overflowYBehaviour={OverflowBehaviour.SCROLL} elements={[
                                                                <DrawerHeader
                                                                    header={String(this.getCurrentFolder()?.title)}
                                                                    badgeText={"Folder view"}
                                                                    enableBadge
                                                                    badgeVM={ObjectVisualMeaning.UI_NO_HIGHLIGHT}
                                                                    description={this.getCurrentFolder().description}
                                                                />,


                                                                <Flex margin={createMargin(0, 0, 40, 0)} wrap={FlexWrap.WRAP} flexDir={FlexDirection.ROW} fw gap={t.gaps.smallGab} align={Align.CENTER} justifyContent={Justify.CENTER} elements={
                                                                    this.getCurrentFolder().tags?.map(s => (
                                                                        <Box highlightShadow={false} cursor={Cursor.pointer} highlight opaque paddingY={px(4)} paddingX={px(7)} visualMeaning={VM.SUCCESS} borderRadiiConfig={{ enableCustomBorderRadii: true, fallbackCustomBorderRadii: px(500)}} borderless children={
                                                                            <Text text={s} whitespace={"nowrap"} cursor={Cursor.pointer} visualMeaning={VM.SUCCESS} fontSize={px(12)} coloredText type={TextType.secondaryDescription}/>
                                                                        }/>
                                                                    ))
                                                                }/>,

                                                                this.a("folder-view"),
                                                                this.a("document-view"),
                                                            ]}/>
                                                        );
                                                    },
                                                    error: (q, error) => {
                                                        return (
                                                            <>error</>
                                                        );
                                                    }
                                                }}/>
                                            ), ...Q.allChannels("current-folder"))
                                        ]}/>
                                    ]
                                }}/>
                            ]}/>,

                            this.component(local => {
                                return (
                                    <DocumentViewController
                                        document={local.state.openedDocument}
                                    />
                                );
                            }, "opened-document"),
                        ]}/>
                    ]
                }}/>
            }/>
        );
    }
}
