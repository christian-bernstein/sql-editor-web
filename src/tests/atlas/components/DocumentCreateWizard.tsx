import {BC} from "../../../logic/BernieComponent";
import {Assembly} from "../../../logic/assembly/Assembly";
import {Themeable} from "../../../logic/style/Themeable";
import {Flex} from "../../../components/lo/FlexBox";
import {Align} from "../../../logic/style/Align";
import {Icon} from "../../../components/lo/Icon";
import {ImportExportRounded, Upload} from "@mui/icons-material";
import {percent, px} from "../../../logic/style/DimensionalMeasured";
import {DrawerHeader} from "../../../components/lo/DrawerHeader";
import {VM} from "../../../logic/style/ObjectVisualMeaning";
import {LiteGrid} from "../../../components/lo/LiteGrid";
import {AF} from "../../../components/logic/ArrayFragment";
import {Tooltip} from "../../../components/ho/tooltip/Tooltip";
import {Button} from "../../../components/lo/Button";
import {Text, TextType} from "../../../components/lo/Text";
import {StaticDrawerMenu} from "../../../components/lo/StaticDrawerMenu";
import React from "react";
import {FlexDirection} from "../../../logic/style/FlexDirection";
import {Justify} from "../../../logic/style/Justify";
import {Dot} from "../../../components/lo/Dot";
import {ReactComponent as HelpIcon} from "../../../assets/icons/ic-20/ic20-help.svg";
import {ReactComponent as NoteIcon} from "../../../assets/icons/ic-20/ic20-file-edit.svg";
import {createMargin} from "../../../logic/style/Margin";
import {SettingsGroup} from "../../../components/lo/SettingsGroup";
import {SettingsElement} from "../../../components/ho/settingsElement/SettingsElement";
import {Input} from "../../../components/lo/Input";
import {WizardRoutineCard} from "./documentWizard/WizardRoutineCard";
import {wizardRoutines} from "../wizard/document/routines/WizardRoutineCollection";
import {HOCWrapper} from "../../../components/HOCWrapper";
import {VFSFolderView} from "./VFSFolderView";
import {Folder} from "../data/Folder";
import {AtlasMain} from "../AtlasMain";

export type DocumentCreateWizardProps = {
    currentFolder: Folder,
    view: VFSFolderView
}

export class DocumentCreateWizard extends BC<DocumentCreateWizardProps, any, any> {

    componentRender(p: DocumentCreateWizardProps, s: any, l: any, t: Themeable.Theme, a: Assembly): JSX.Element | undefined {
        return (
            <StaticDrawerMenu body={props => {
                return (
                    <Flex fw align={Align.CENTER} elements={[
                        <Icon icon={<ImportExportRounded/>} style={{ transform: "rotate(45deg)" }} size={px(40)}/>,

                        <DrawerHeader
                            header={"Document creation wizard"}
                            enableBadge
                            badgeVM={VM.UI_NO_HIGHLIGHT}
                            badgeText={"Atlas-Viewer"}
                            description={"Manage the creation & installation of ISO-images.\nISO-Images are used to **import** & **export** data from Atlas™."}
                            // margin={createMargin(0, 0, 40, 0)}
                        />,

                        <Flex fw justifyContent={Justify.CENTER} align={Align.CENTER} margin={createMargin(40, 0, 40, 0)} elements={[
                            <Flex width={percent(100 / 5 * 4)} elements={[
                                <Input
                                    placeholder={"Search for routines & templates"}
                                />,
                            ]}/>
                        ]}/>,

                        <Flex fw flexDir={FlexDirection.ROW} align={Align.CENTER} justifyContent={Justify.SPACE_BETWEEN} elements={[
                            <Flex flexDir={FlexDirection.ROW} align={Align.CENTER} gap={t.gaps.smallGab} elements={[
                                <Text text={"Recommended"} bold/>,
                                <Dot/>,
                                <Text text={`${3}`} type={TextType.secondaryDescription}/>,
                            ]}/>,

                            <Flex flexDir={FlexDirection.ROW} align={Align.CENTER} gap={t.gaps.smallGab} elements={[
                                <Tooltip title={"Help"} arrow children={
                                    <Icon icon={<HelpIcon/>} size={px(16)}/>
                                }/>
                            ]}/>,
                        ]}/>,

                        <HOCWrapper body={wrapper => (
                            <LiteGrid columns={2} gap={t.gaps.smallGab} children={
                                <AF elements={[
                                    ...wizardRoutines.map(routine => routine.previewCard(() => {
                                        routine.run(p.view, p.currentFolder, wrapper).then(document => {
                                            const folder = p.view.getCurrentFolder();
                                            AtlasMain.atlas().api().createDocumentInFolder(folder.id, document);
                                            setTimeout(() => {
                                                AtlasMain.atlas(atlas => {
                                                    atlas.rerender("folders");
                                                });
                                            }, 1);
                                            wrapper.closeLocalDialog();
                                            p.view.closeLocalDialog();
                                            p.view.reloadFolderView();
                                        });
                                    }))
                                ]}/>
                            }/>
                        )}/>,






                        <Flex margin={createMargin(20, 0, 0, 0)} fw flexDir={FlexDirection.ROW} align={Align.CENTER} justifyContent={Justify.SPACE_BETWEEN} elements={[
                            <Flex flexDir={FlexDirection.ROW} align={Align.CENTER} gap={t.gaps.smallGab} elements={[
                                <Text text={"Templates"} bold/>,
                                <Dot/>,
                                <Text text={`${2}`} type={TextType.secondaryDescription}/>,
                            ]}/>,

                            <Flex flexDir={FlexDirection.ROW} align={Align.CENTER} gap={t.gaps.smallGab} elements={[
                                <Tooltip title={"Help"} arrow children={
                                    <Icon icon={<HelpIcon/>} size={px(16)}/>
                                }/>
                            ]}/>,
                        ]}/>,

                        <SettingsGroup elements={[
                            <SettingsElement groupDisplayMode title={"Event note"}/>,
                            <SettingsElement groupDisplayMode title={"Memory log"}/>,
                        ]}/>,
                    ]}/>
                );
            }}/>
        );
    }
}
