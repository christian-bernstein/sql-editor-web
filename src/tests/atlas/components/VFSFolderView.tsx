import {BC} from "../../../logic/BernieComponent";
import {Themeable} from "../../../logic/style/Themeable";
import {Assembly} from "../../../logic/assembly/Assembly";
import {Screen} from "../../../components/lo/Page";
import {Flex} from "../../../components/lo/FlexBox";
import {FlexDirection} from "../../../logic/style/FlexDirection";
import {Text, TextType} from "../../../components/lo/Text";
import {px} from "../../../logic/style/DimensionalMeasured";
import {ReactComponent as BackIcon} from "../../../assets/icons/ic-20/ic20-chevron-down.svg";
import {Icon} from "../../../components/lo/Icon";
import {Justify} from "../../../logic/style/Justify";
import {Align} from "../../../logic/style/Align";
import {Button} from "../../../components/lo/Button";
import {SettingsGroup} from "../../../components/lo/SettingsGroup";
import {SettingsElement} from "../../../components/ho/settingsElement/SettingsElement";
import {DrawerHeader} from "../../../components/lo/DrawerHeader";
import {ObjectVisualMeaning, VM} from "../../../logic/style/ObjectVisualMeaning";
import {Dot} from "../../../components/lo/Dot";
import {array} from "../../../logic/Utils";
import {OverflowBehaviour} from "../../../logic/style/OverflowBehaviour";
import {FlexWrap} from "../../../logic/style/FlexWrap";
import {Box} from "../../../components/lo/Box";
import {Cursor} from "../../../logic/style/Cursor";
import React from "react";
import {OverflowWithHeader} from "../../../components/lo/OverflowWithHeader";
import {ReactComponent as AttachmentIcon} from "../../../assets/icons/ic-20/ic20-attachment.svg";
import {AtlasMain} from "../AtlasMain";
import {FolderComponent} from "./FolderComponent";
import {Q, Queryable} from "../../../logic/query/Queryable";
import {Folder} from "../data/Folder";
import {QueryDisplay} from "../../../components/logic/QueryDisplay";

export type VFSFolderViewProps = {
    onClose: () => void
}

export type VFSFolderViewLocalState = {
    currentFolderData: Q<Folder | undefined>
}

export class VFSFolderView extends BC<VFSFolderViewProps, any, VFSFolderViewLocalState> {

    constructor(props: VFSFolderViewProps) {
        super(props, undefined, {
            currentFolderData: new Queryable<Folder | undefined>({
                component: () => this,
                listeners: ["current-folder"],
                fallback: undefined,
                process: (resolve, reject) => {
                    const rootFolderID = "root";

                    let currentFolder = AtlasMain.atlas().api().getFolder(rootFolderID);

                    if (currentFolder === undefined) {
                        currentFolder = {
                            categories: new Array<string>(),
                            id: "root"
                        }
                        if (AtlasMain.atlas().api().createFolder(currentFolder)) {
                            resolve(currentFolder);
                        } else {
                            reject();
                        }
                    }
                }
            })
        });
    }

    private onClose() {
        this.props.onClose();
    }

    componentDidMount() {
        super.componentDidMount();
        this.local.state.currentFolderData.query();
    }

    init() {
        super.init();
        this.folderViewAssembly();
        this.documentViewAssembly();
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
                        <Flex flexDir={FlexDirection.ROW} align={Align.CENTER} gap={theme.gaps.smallGab} elements={[
                            <Text text={"Folders"} bold/>,
                            <Dot/>,
                            <Text text={`${subFolders.length}`} type={TextType.secondaryDescription}/>,
                        ]}/>,

                        <SettingsGroup elements={
                            subFolders.map(folder => {
                                return (
                                    <FolderComponent data={folder} onSelect={(component, data) => new Promise<void>((resolve, reject) => {
                                        // TODO: Implement switch folder logic
                                    })}/>
                                );
                            })
                        }/>
                    ]}/>,
                ]}/>
            );
        });
    }

    private documentViewAssembly() {
        this.assembly.assembly("document-view", theme => {

            return (
                <Flex fw elements={[
                    <Flex fw elements={[
                        <Flex flexDir={FlexDirection.ROW} align={Align.CENTER} gap={theme.gaps.smallGab} elements={[
                            <Text text={"Files"} bold/>,
                            <Dot/>,
                            <Text text={"14"} type={TextType.secondaryDescription}/>,
                        ]}/>,

                        <SettingsGroup elements={array(<SettingsElement groupDisplayMode forceRenderSubpageIcon title={"Hello world"}/>, 14)}/>
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
                        <Flex fw padding paddingX={px(32)} paddingY={px(16)} style={{ backgroundColor: "#161b22" }} align={Align.CENTER} flexDir={FlexDirection.ROW} justifyContent={Justify.CENTER} elements={[
                            <Icon icon={<AttachmentIcon/>}/>,
                        ]}/>
                    ]
                }} overflowContainer={{
                    elements: [
                        <Flex fh fw gap={px()} flexDir={FlexDirection.ROW} elements={[
                            <Flex fh width={px(500)} style={{ backgroundColor: t.colors.backgroundHighlightColor.css() }} elements={[
                                <OverflowWithHeader dir={FlexDirection.COLUMN_REVERSE} staticContainer={{
                                    elements: [
                                        <Flex fw padding align={Align.CENTER} flexDir={FlexDirection.ROW} justifyContent={Justify.CENTER} elements={[
                                            <Icon icon={<AttachmentIcon/>}/>,
                                            <Flex fw fh justifyContent={Justify.CENTER} gap={t.gaps.smallGab} align={Align.CENTER} elements={[
                                                // Badge.beta(),
                                                <Text text={"Atlas Document Viewer"} bold/>,
                                            ]}/>,
                                            <Icon icon={<AttachmentIcon/>}/>
                                        ]}/>
                                    ]
                                }} overflowContainer={{
                                    elements: [
                                        <Flex height={px(50)} fw fh padding style={{ backgroundColor: t.colors.backgroundHighlightColor.css() }} elements={[
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
                                                                header={"FOP"}
                                                                badgeText={"Folder view"}
                                                                enableBadge
                                                                badgeVM={ObjectVisualMeaning.UI_NO_HIGHLIGHT}
                                                                description={"All your folders at-a-glance\nPress on the context icon to see available actions, like creating folders or accessing ISO-image manager"}
                                                            />,


                                                            <Flex wrap={FlexWrap.WRAP} flexDir={FlexDirection.ROW} fw gap={t.gaps.smallGab} align={Align.CENTER} justifyContent={Justify.CENTER} elements={
                                                                ["FS-2", "ASD", "ObjectVisualMeaning"].map(s => (
                                                                    <Box highlightShadow={false} cursor={Cursor.pointer} highlight opaque paddingY={px(4)} paddingX={px(7)} visualMeaning={VM.SUCCESS} borderRadiiConfig={{ enableCustomBorderRadii: true, fallbackCustomBorderRadii: px(500)}} borderless children={
                                                                        <Text text={s} whitespace={"nowrap"} cursor={Cursor.pointer} visualMeaning={VM.SUCCESS} fontSize={px(12)} coloredText type={TextType.secondaryDescription}/>
                                                                    }/>
                                                                ))
                                                            }/>,


                                                            <Flex flexDir={FlexDirection.ROW} paddingY={px(40)} paddingX={px()} padding elements={[
                                                                <Button height={px(50)} width={px(50)} border={false} onClick={() => this.onClose()} children={
                                                                    <Flex fw fh justifyContent={Justify.CENTER} align={Align.CENTER} elements={[
                                                                        <Icon icon={<BackIcon/>}/>
                                                                    ]}/>
                                                                }/>,
                                                                <Flex fh gap={px()} justifyContent={Justify.SPACE_BETWEEN} elements={[
                                                                    <Text fontSize={px(22)} bold text={"FOP"}/>,
                                                                    <Text fontSize={px(14)} whitespace={"nowrap"} text={"export class VFSFolderView"}/>,
                                                                ]}/>
                                                            ]}/>,

                                                            this.a("folder-view"),
                                                            this.a("document-view"),
                                                        ]}/>
                                                    );
                                                }
                                            }}/>,


                                        ]}/>
                                    ]
                                }}/>
                            ]}/>,
                            <Flex fw fh overflowYBehaviour={OverflowBehaviour.SCROLL} padding elements={[
                                <DrawerHeader
                                    header={"FOP"}
                                    badgeText={"Folder view"}
                                    enableBadge
                                    badgeVM={ObjectVisualMeaning.UI_NO_HIGHLIGHT}
                                    description={"All your folders at-a-glance\nPress on the context icon to see available actions, like creating folders or accessing ISO-image manager"}
                                />
                            ]}/>
                        ]}/>
                    ]
                }}/>
            }/>
        );
    }
}
