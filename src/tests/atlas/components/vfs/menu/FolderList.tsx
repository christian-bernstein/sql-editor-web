import {BernieComponent} from "../../../../../logic/BernieComponent";
import {Assembly} from "../../../../../logic/assembly/Assembly";
import {Themeable} from "../../../../../logic/style/Themeable";
import {Folder} from "../../../data/Folder";
import {AtlasMain} from "../../../AtlasMain";
import {Flex} from "../../../../../components/lo/FlexBox";
import {FlexDirection} from "../../../../../logic/style/FlexDirection";
import {Align} from "../../../../../logic/style/Align";
import {Justify} from "../../../../../logic/style/Justify";
import {Text, TextType} from "../../../../../components/lo/Text";
import {Dot} from "../../../../../components/lo/Dot";
import {Tooltip} from "../../../../../components/ho/tooltip/Tooltip";
import {Icon} from "../../../../../components/lo/Icon";
import {ReactComponent as CreateIcon} from "../../../../../assets/icons/ic-20/ic20-edit.svg";
import {percent, px} from "../../../../../logic/style/DimensionalMeasured";
import {SettingsGroup} from "../../../../../components/lo/SettingsGroup";
import {FolderComponent} from "../../FolderComponent";
import {createMargin} from "../../../../../logic/style/Margin";
import {Cursor} from "../../../../../logic/style/Cursor";
import {VM} from "../../../../../logic/style/ObjectVisualMeaning";
import React from "react";
import {VFSFolderView} from "../../VFSFolderView";
import {InformationBox} from "../../../../../components/ho/informationBox/InformationBox";
import {Description} from "../../../../../components/lo/Description";
import {AtlasDocument} from "../../../data/AtlasDocument";
import {AF} from "../../../../../components/logic/ArrayFragment";

export type FolderListProps = {
    folders: Array<Folder>
}

export class FolderList extends BernieComponent<FolderListProps, any, any> {

    init() {
        super.init();
        this.noVFSViewFallbackAssembly();
        this.mainAssembly();
    }

    private noVFSViewFallbackAssembly() {
        this.assembly.assembly("no-vfs-view-fallback", (theme) => {
            return (
                <InformationBox visualMeaning={VM.ERROR} width={percent(100)} children={
                    <Description text={"Cannot render DocumentList-component, because VFSFolderView isn't active"}/>
                }/>
            );
        })
    }

    private renderFolders(folders: Array<Folder>, view: VFSFolderView): JSX.Element {
        if (folders.length === 0) return <></>;
        return (
            <SettingsGroup elements={
                folders.map(folder => {
                    return (
                        <FolderComponent renderDetails={false} data={folder} onSelect={(component, data) => new Promise<void>((resolve, reject) => {
                            view.local.setState({
                                currentFolderID: data.id
                            }, new Map<string, any>(), () => {
                                view.reloadFolderView();
                            });
                        })}/>
                    );
                })
            }/>
        );
    }

    private mainAssembly() {
        this.assembly.assembly("main", (theme, view: VFSFolderView) => {
            type FolderArray = Array<Folder>;
            const folders = this.props.folders;
            const pinnedSubFolders: FolderArray = folders.filter(folder => folder.pinned ?? false);
            const unpinnedSubFolders: FolderArray = folders.filter(folder => !(folder.pinned ?? false));


            return (
                <Flex fw elements={[
                    <Flex fw elements={[
                        <Flex fw flexDir={FlexDirection.ROW} align={Align.CENTER} justifyContent={Justify.SPACE_BETWEEN} elements={[
                            <Flex flexDir={FlexDirection.ROW} align={Align.CENTER} gap={theme.gaps.smallGab} elements={[
                                <Text text={"Folders"} bold/>,
                                <Dot/>,
                                <Text text={`${folders.length}`} type={TextType.secondaryDescription}/>,
                            ]}/>,

                            <Flex flexDir={FlexDirection.ROW} align={Align.CENTER} gap={theme.gaps.smallGab} elements={[
                                <Tooltip title={"Create folder"} arrow children={
                                    <Icon icon={<CreateIcon/>} size={px(16)} onClick={() => view.openCreateFolderSetup()}/>
                                }/>
                            ]}/>,
                        ]}/>,

                        folders.length > 0 ? (
                            <AF elements={[
                                this.renderFolders(pinnedSubFolders, view),
                                this.renderFolders(unpinnedSubFolders, view),
                            ]}/>
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
                                    onClick={() => view.openCreateFolderSetup()}
                                />
                            ]}/>
                        )
                    ]}/>,
                ]}/>
            );
        });
    }

    componentRender(p: FolderListProps, s: any, l: any, t: Themeable.Theme, a: Assembly): JSX.Element | undefined {
        const view = AtlasMain.atlas().ls().vfsFolderViewInstance;
        if (view === undefined) return this.a("no-vfs-view-fallback");
        return this.a("main", view);
    }
}
