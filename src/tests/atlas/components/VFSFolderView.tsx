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

export type VFSFolderViewProps = {
    onClose: () => void
}

export class VFSFolderView extends BC<VFSFolderViewProps, any, any> {

    private onClose() {
        this.props.onClose();
    }

    componentRender(p: any, s: any, l: any, t: Themeable.Theme, a: Assembly): JSX.Element | undefined {
        return (
            <Screen deactivatePadding children={
                <Flex fw fh overflowYBehaviour={OverflowBehaviour.SCROLL} padding elements={[
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


                    <Flex fw elements={[
                        <Flex flexDir={FlexDirection.ROW} align={Align.CENTER} gap={t.gaps.smallGab} elements={[
                            <Text text={"Folders"} bold/>,
                            <Dot/>,
                            <Text text={"5"} type={TextType.secondaryDescription}/>,
                        ]}/>,

                        <SettingsGroup elements={array(<SettingsElement groupDisplayMode forceRenderSubpageIcon title={"Hello world"}/>, 5)}/>
                    ]}/>,

                    <Flex fw elements={[
                        <Flex flexDir={FlexDirection.ROW} align={Align.CENTER} gap={t.gaps.smallGab} elements={[
                            <Text text={"Files"} bold/>,
                            <Dot/>,
                            <Text text={"14"} type={TextType.secondaryDescription}/>,
                        ]}/>,

                        <SettingsGroup elements={array(<SettingsElement groupDisplayMode forceRenderSubpageIcon title={"Hello world"}/>, 14)}/>
                    ]}/>
                ]}/>
            }/>
        );
    }
}
