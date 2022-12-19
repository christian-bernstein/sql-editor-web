import {BC} from "../../../logic/BernieComponent";
import {Assembly} from "../../../logic/assembly/Assembly";
import {Themeable} from "../../../logic/style/Themeable";
import {Folder} from "../data/Folder";
import {StaticDrawerMenu} from "../../../components/lo/StaticDrawerMenu";
import {Flex, FlexRow} from "../../../components/lo/FlexBox";
import {Text} from "../../../components/lo/Text";
import {Description} from "../../../components/lo/Description";
import {AF} from "../../../components/logic/ArrayFragment";
import {AtlasMain} from "../AtlasMain";
import {FolderComponent} from "./FolderComponent";
import {SettingsGroup} from "../../../components/lo/SettingsGroup";
import React from "react";
import {Justify} from "../../../logic/style/Justify";
import {Button} from "../../../components/lo/Button";
import {VM} from "../../../logic/style/ObjectVisualMeaning";
import {FolderPathView} from "./FolderPathView";
import {If} from "../../../components/logic/If";
import {Cursor} from "../../../logic/style/Cursor";
import {percent, px} from "../../../logic/style/DimensionalMeasured";
import {Centered} from "../../../components/lo/PosInCenter";
import {isMobile} from "react-device-detect";
import {LiteGrid} from "../../../components/lo/LiteGrid";
import {IPredicate} from "../api/IPredicate";
import {DriveFileMoveRounded} from "@mui/icons-material";
import {DrawerHeader} from "../../../components/lo/DrawerHeader";

export type EntityMovePromptComponentProps = {
    baseFolder: Folder,
    defaultCurrentFolder: Folder,
    initialFolder: Folder,
    onCancel?: () => void,
    onSubmit: (selectedFolder: Folder, instance: EntityMovePromptComponent) => void,
    secondaryFolderPredicate?: IPredicate<Folder>
}

export type EntityMovePromptComponentLocalState = {
    currentFolder: Folder
}

export class EntityMovePromptComponent extends BC<EntityMovePromptComponentProps, any, EntityMovePromptComponentLocalState> {

    constructor(props: EntityMovePromptComponentProps) {
        super(props, undefined, {
            currentFolder: props.defaultCurrentFolder
        });
    }

    init() {
        super.init();
        this.titleAssembly();
        this.folderLevelAssembly();
        this.subFolderSelectorAssembly();
        this.actionsAssembly();
    }

    // INTERNAL LOGIC

    private moveCurrentFolderPointer(newCurrentFolder: Folder) {
        // TODO: Check if newCurrentFolder is a legal folder -> not above the root folder
        this.local.setStateWithChannels({
            currentFolder: newCurrentFolder
        }, ["folder-pointer"]);
    }


    private isCurrentFolderInitialFolder(): boolean {
        return this.ls().currentFolder.id === this.props.initialFolder.id;
    }

    private cancel() {
        this.props.onCancel?.();
    }

    private submit() {
        this.props.onSubmit(this.ls().currentFolder, this);
    }

    // ASSEMBLIES

    private titleAssembly() {
        this.assembly.assembly("title", theme => {

            if (isMobile) {
                return (
                    <DrawerHeader
                        enableBadge={true}
                        badgeVM={VM.UI_NO_HIGHLIGHT}
                        badgeText={"VFS"}
                        header={"Move"}
                        description={`Select destination for folder **${undefined}**`}
                    />
                );
            }

            return (
                <Flex gap={theme.gaps.smallGab} fw elements={[
                    <Text text={"Move"} bold/>,
                    <Description text={`Select destination for folder **${undefined}**`}/>,
                ]}/>
            );
        })
    }

    private folderLevelAssembly() {
        this.assembly.assembly("folder-level", theme => {
            const currentFolder = this.ls().currentFolder;
            const tree: Array<Folder> = new Array<Folder>();
            let folder = currentFolder;
            tree.push(folder as Folder);
            while (folder?.parentFolder !== undefined) {
                folder = AtlasMain.atlas().api().getFolder(folder.parentFolder);
                tree.push(folder);
            }
            // TODO: Display root folder path -> Make a prop in FolderPathView: ( readonly: boolean )
            return (
                <FolderPathView
                    path={tree.reverse()}
                    gotoFolder={selectedFolder => {
                        this.moveCurrentFolderPointer(selectedFolder)
                    }}
                />
            );
        })
    }

    private getAllFolders(): Folder[] {
        const currentFolderID = this.ls().currentFolder.id;
        const predicates: IPredicate<Folder>[] = [{
            test(obj: Folder): boolean {
                return obj.parentFolder == currentFolderID;
            }
        }];
        const sfp = this.props.secondaryFolderPredicate;
        if (sfp !== undefined) predicates.push(sfp);
        return AtlasMain.atlas().api().getAllFolders(...predicates);
    }

    private subFolderSelectorAssembly() {
        this.assembly.assembly("sub-folder-selector", theme => {
            // Get folders
            const currentFolderID = this.ls().currentFolder.id;
            const folders: Array<Folder> = this.getAllFolders();


            if (folders.length === 0) {
                return (
                    <Flex fw padding paddingY={px(30)} elements={[
                        <Centered fullHeight children={
                            <Description text={"Empty"}/>
                        }/>
                    ]}/>
                );
            }

            return (
                <SettingsGroup elements={
                    folders.map(folder => {
                        return (
                            <FolderComponent renderContextMenu={false} renderPinInfo={false} renderDetails={false} data={folder} onSelect={(component, data) => new Promise<void>((resolve, reject) => {
                                // TODO: Make better rerender logic -> 2 Renders
                                this.moveCurrentFolderPointer(data);
                                resolve();
                            })}/>
                        );
                    })
                }/>
            );
        })
    }

    private actionsAssembly() {
        this.assembly.assembly("actions", theme => {
            if (isMobile) {
                return (
                    <LiteGrid gap={theme.gaps.smallGab} columns={2} children={
                        <AF elements={[
                            <Button width={percent(100)} text={"Cancel"} onClick={this.cancel}/>,
                            <If condition={this.isCurrentFolderInitialFolder()} ifTrue={
                                // Cannot move :: Not a different folder
                                <Button
                                    width={percent(100)}
                                    cursor={Cursor.notAllowed}
                                    text={`Move`}
                                />
                            } ifFalse={
                                // Can move :: Current folder is not the initial folder
                                <Button
                                    width={percent(100)}
                                    text={`Move to *${this.ls().currentFolder.title}*`}
                                    onClick={() => this.submit()}
                                />
                            }/>,
                        ]}/>
                    }/>
                );
            }

            return (
                <FlexRow fw justifyContent={Justify.FLEX_END} gap={theme.gaps.smallGab} elements={[
                    <Button text={"Cancel"} onClick={this.cancel}/>,
                    <If condition={this.isCurrentFolderInitialFolder()} ifTrue={
                        // Cannot move :: Not a different folder
                        <Button
                            tooltip={"Select a different folder"}
                            cursor={Cursor.notAllowed}
                            text={`Move`}
                        />
                    } ifFalse={
                        // Can move :: Current folder is not the initial folder
                        <Button
                            text={`Move to *${this.ls().currentFolder.title}*`}
                            onClick={() => this.submit()}
                        />
                    }/>,
                ]}/>
            );
        })
    }

    componentRender(p: EntityMovePromptComponentProps, s: any, l: EntityMovePromptComponentLocalState, t: Themeable.Theme, a: Assembly): JSX.Element | undefined {
        return (
            <StaticDrawerMenu body={props => {
                return (
                    <Flex fw elements={[
                        this.a("title"),
                        this.component(() => (
                            <AF elements={[
                                this.a("folder-level"),
                                this.a("sub-folder-selector"),
                                this.a("actions"),
                            ]}/>
                        ), "folder-pointer")
                    ]}/>
                );
            }}/>
        );
    }
}
