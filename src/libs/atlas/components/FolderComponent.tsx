import {BC} from "../../sql/logic/BernieComponent";
import {Folder} from "../data/Folder";
import {Themeable} from "../../sql/logic/style/Themeable";
import {Assembly} from "../../sql/logic/assembly/Assembly";
import {Text, TextType} from "../../sql/components/lo/Text";
import {getOr} from "../../sql/logic/Utils";
import {SettingsElement} from "../../sql/components/ho/settingsElement/SettingsElement";
import {ReactComponent as FolderIcon} from "../../../assets/icons/ic-20/ic20-folder.svg";
import {Flex, FlexRow} from "../../sql/components/lo/FlexBox";
import {VM} from "../../sql/logic/style/ObjectVisualMeaning";
import {Color} from "../../sql/logic/style/Color";
import {px} from "../../sql/logic/style/DimensionalMeasured";
import {Align} from "../../sql/logic/style/Align";
import {If} from "../../sql/components/logic/If";
import {Icon} from "../../sql/components/lo/Icon";
import {DriveFileMoveRounded, StarRounded} from "@mui/icons-material";
import React from "react";
import {StaticDrawerMenu} from "../../sql/components/lo/StaticDrawerMenu";
import {AtlasMain} from "../AtlasMain";
import {ReactComponent as ActionsIcon} from "../../../assets/icons/ic-20/ic20-more-ver.svg";
import {DrawerHeader} from "../../sql/components/lo/DrawerHeader";
import {SettingsGroup} from "../../sql/components/lo/SettingsGroup";
import {EntityMovePromptComponent} from "./EntityMovePromptComponent";
import {Description} from "../../sql/components/lo/Description";

export type FolderProps = {
    data: Folder,
    onSelect: (component: FolderComponent, data: Folder) => Promise<any>,
    renderDetails?: boolean,
    renderPinInfo?: boolean,
    renderContextMenu?: boolean
}

export class FolderComponent extends BC<FolderProps, any, any> {

    init() {
        super.init();
        this.appendixAssembly();
        this.pinnedAssembly();
        this.contextMenuAssembly();
        this.contextMenuOpenerAssembly();
    }

    private onClickTogglePinnedFlagIcon(event: React.MouseEvent<HTMLDivElement>) {
        event.preventDefault();
        event.stopPropagation();
        this.togglePinnedFlag();
    }

    private togglePinnedFlag() {
        AtlasMain.atlas(atlas => {
            atlas.api()?.updateFolder(this.props.data.id, folder => {
                folder.pinned = folder.pinned === undefined ? true : !folder.pinned
                return folder;
            });

            atlas.useVFSFolderView(view => {
                view.rerender("folder-view");
            }, () => {
                // TODO: VFS not opened
                console.error("Cannot rerender 'folder-view' in VFSFolderView, because VFSFolderView isn't opened.");
            })
        });
    }

    private pinnedAssembly() {
        this.assembly.assembly("pinned", (theme, element: SettingsElement) => {
            const isPinned = this.props.data.pinned ?? false;
            const renderPinInfo = this.props.renderPinInfo ?? true;
            if (!renderPinInfo) return <></>;

            return (
                <FlexRow align={Align.CENTER} elements={[
                    <If condition={isPinned} ifTrue={
                        <Icon
                            // tooltip={"Unpin"}
                            icon={<StarRounded/>}
                            onClick={(event) => this.onClickTogglePinnedFlagIcon(event)}
                        />
                    } ifFalse={
                        <Icon
                            // tooltip={"Pin"}
                            icon={<StarRounded/>}
                            uiNoHighlightOnDefault
                            coloredOnDefault={false}
                            onClick={(event) => this.onClickTogglePinnedFlagIcon(event)}
                        />
                    }/>
                ]}/>
            );
        })
    }

    private contextMenuAssembly() {
        this.assembly.assembly("context-menu", (theme, element: SettingsElement) => {
            const renderContextMenu = this.props.renderContextMenu ?? true;
            const folder = this.props.data;
            if (!renderContextMenu) return <></>;

            return (
                <StaticDrawerMenu body={props => {
                    return (
                        <Flex fw elements={[
                            <DrawerHeader
                                header={"Folder actions"}
                                description={`Common actions for folder **${folder.title}**`}
                                enableBadge={true}
                                badgeText={"Context"}
                                badgeVM={VM.UI_NO_HIGHLIGHT}
                            />,

                            <SettingsGroup title={"Actions"} elements={[
                                <SettingsElement title={"Move"} groupDisplayMode iconConfig={{ enable: true, iconGenerator: elem => <DriveFileMoveRounded/> }} promiseBasedOnClick={elem => new Promise<void>((resolve, reject) => {
                                    const api = AtlasMain.atlas().api();
                                    const root = api.getFolder("root");
                                    const parentFolder = folder.parentFolder !== undefined ? api.getFolder(folder.parentFolder) : root;

                                    elem.dialog((
                                        <EntityMovePromptComponent
                                            initialFolder={parentFolder}
                                            defaultCurrentFolder={parentFolder}
                                            baseFolder={root}
                                            onCancel={() => elem.closeLocalDialog()}
                                            secondaryFolderPredicate={{
                                                // Prevent current folder from being selectable as a valid new parent folder
                                                test: (obj: Folder): boolean => {
                                                    return obj.id !== this.props.data.id
                                                }
                                            }}
                                            onSubmit={(selectedFolder, instance) => {
                                                AtlasMain.atlas(atlas => {
                                                    const api = atlas.api();

                                                    // TODO: Add logic into AtlasAPI

                                                    // Remove this folder from parent folder :: This doesn't check if the folder has a parent (is root folder) -> This has to be checked somewhere else
                                                    if (this.props.data.parentFolder !== undefined) {
                                                        api.updateFolder(this.props.data.parentFolder, apiParentFolder => {
                                                            if (apiParentFolder.subFolderIDs !== undefined) {
                                                                // const indexOf = apiParentFolder.subFolderIDs.indexOf(this.props.data.parentFolder as string);
                                                                const indexOf = apiParentFolder.subFolderIDs.indexOf(this.props.data.id);
                                                                apiParentFolder.subFolderIDs.splice(indexOf, 1)
                                                            }
                                                            return apiParentFolder;
                                                        });
                                                    }

                                                    // Set current folder parent id
                                                    api.updateFolder(this.props.data.id, apiFolder => {
                                                        apiFolder.parentFolder = selectedFolder.id;
                                                        return apiFolder;
                                                    });

                                                    // Add current folder id to new parent's sub folder list
                                                    api.updateFolder(selectedFolder.id, apiSelectedFolder => {
                                                        if (apiSelectedFolder.subFolderIDs === undefined) apiSelectedFolder.subFolderIDs = [];
                                                        apiSelectedFolder.subFolderIDs.push(this.props.data.id);
                                                        return apiSelectedFolder;
                                                    });

                                                    // TODO: rerender all folder dependent components
                                                });

                                                elem.closeLocalDialog();
                                                this.props.onSelect?.(this, selectedFolder);
                                                resolve();
                                            }}
                                        />
                                    ), () => {
                                        elem.closeLocalDialog();
                                        resolve();
                                    })
                                })}/>
                            ]}/>
                        ]}/>
                    );
                }}/>
            );
        })
    }

    private contextMenuOpenerAssembly() {
        this.assembly.assembly("context-menu-opener", (theme, element: SettingsElement) => {
            const renderContextMenu = this.props.renderContextMenu ?? true;
            if (!renderContextMenu) return <></>;

            return (
                <Icon coloredOnDefault={false} uiNoHighlightOnDefault icon={<ActionsIcon/>} tooltip={"Actions"} size={px(18)} onClick={event => {
                    event.preventDefault();
                    event.stopPropagation();
                    element.dialog(this.a("context-menu", element));
                }}/>
            );
        })
    }

    private appendixAssembly() {
        this.assembly.assembly("appendix", (theme, element: SettingsElement) => {
            const renderDetails = this.props.renderDetails ?? true;

            return (
                <FlexRow align={Align.CENTER} gap={theme.gaps.smallGab} elements={[
                    (() => {
                        if (renderDetails) {
                            return (
                                <FlexRow gap={theme.gaps.smallGab} elements={[
                                    <Text
                                        type={TextType.secondaryDescription}
                                        text={getOr(this.props.data.creator, "N/A")}
                                        fontSize={px(11)}
                                    />,
                                    <Text
                                        bold
                                        text={"@"}
                                        coloredText
                                        visualMeaning={VM.UI_NO_HIGHLIGHT}
                                        type={TextType.secondaryDescription}
                                        fontSize={px(11)}
                                    />,
                                    <Text
                                        type={TextType.secondaryDescription}
                                        text={this.props.data.creationDate === undefined ? "N/A" : new Date(this.props.data.creationDate).toLocaleDateString()}
                                        fontSize={px(11)}
                                    />
                                ]}/>
                            );
                        } else return <></>
                    })(),

                    this.a("context-menu-opener", element),

                    this.a("pinned")
                ]}/>
            );
        })
    }

    componentRender(p: FolderProps, s: any, l: any, t: Themeable.Theme, a: Assembly): JSX.Element | undefined {
        const pfID = p.data.parentFolder;
        const parentFolder = pfID !== undefined ? AtlasMain.atlas().api().getFolder(pfID) : undefined;

        return (
            <SettingsElement
                forceRenderSubpageIcon
                groupDisplayMode

                // title={getOr(p.data.title, "N/A")}
                // title={`${parentFolder !== undefined ? `${parentFolder.title} / ` : ""}${getOr(p.data.title, "N/A")}`}

                title={""}
                alternateTitleRenderer={element => {
                    // Render title with path
                    if (parentFolder !== undefined) {
                        return (
                            <FlexRow align={Align.CENTER} gap={px()} elements={[
                                <Description visualMeaning={VM.WARNING} coloredText text={parentFolder.title ?? "N/A"}/>,
                                <Description visualMeaning={VM.UI_NO_HIGHLIGHT} coloredText text={"/"}/>,
                                <Description text={p.data.title ?? "N/A"}/>
                            ]}/>
                        );
                    }
                    // Render just the title
                    return (
                        <Description text={p.data.title ?? "N/A"}/>
                    );
                }}

                iconConfig={{
                    enable: true,
                    color: p.data.iconColorHEX === undefined ? undefined : Color.ofHex(p.data.iconColorHEX),
                    iconGenerator: element => (
                        <FolderIcon/>
                    )
                }}
                appendixGenerator={element => this.a("appendix", element)}
                promiseBasedOnClick={element => p.onSelect(this, p.data)}
            />
        );
    }
}
