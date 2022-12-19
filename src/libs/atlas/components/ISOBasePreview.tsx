import {BC} from "../../sql/logic/BernieComponent";
import {ISOBase} from "../iso/ISOBase";
import {Assembly} from "../../sql/logic/assembly/Assembly";
import {Themeable} from "../../sql/logic/style/Themeable";
import {Box} from "../../sql/components/lo/Box";
import {percent, px} from "../../sql/logic/style/DimensionalMeasured";
import {Flex, FlexRow} from "../../sql/components/lo/FlexBox";
import {DrawerHeader} from "../../sql/components/lo/DrawerHeader";
import {VM} from "../../sql/logic/style/ObjectVisualMeaning";
import {Text, TextType} from "../../sql/components/lo/Text";
import {Tooltip} from "../../sql/components/ho/tooltip/Tooltip";
import {Icon} from "../../sql/components/lo/Icon";
import {ReactComponent as FolderIcon} from "../../../assets/icons/ic-20/ic20-folder.svg";
import {ReactComponent as CategoryIcon} from "../../../assets/icons/ic-20/ic20-list-bullet.svg";
import {
    CalendarTodayRounded,
    ListAltRounded,
    SimCardRounded
} from "@mui/icons-material";
import moment from "moment";
import {SettingsGroup} from "../../sql/components/lo/SettingsGroup";
import {SettingsElement} from "../../sql/components/ho/settingsElement/SettingsElement";
import {ISOV1Data} from "../iso/v1/ISOV1Data";
import {createMargin} from "../../sql/logic/style/Margin";

export type ISOBasePreviewProps = {
    iso: ISOBase
}

export class ISOBasePreview extends BC<ISOBasePreviewProps, any, any> {

    componentRender(p: ISOBasePreviewProps, s: any, l: any, t: Themeable.Theme, a: Assembly): JSX.Element | undefined {
        const data: ISOV1Data = p.iso.data;

        return (
            <Box width={percent(100)} elements={[
                <Flex fw elements={[
                    <DrawerHeader
                        header={"ISO-image preview"}
                        badgeText={p.iso.version}
                        enableBadge
                        badgeVM={VM.UI_NO_HIGHLIGHT}
                    />,

                    <Flex fw gap={t.gaps.smallGab} elements={[
                        <Tooltip title={`ISO-image uuid: ${p.iso.id}`} arrow noBorder children={
                            <FlexRow gap={t.gaps.smallGab.times(.5)} elements={[
                                <Icon icon={<SimCardRounded/>} size={px(16)} color={t.colors.fontSecondaryColor}/>,
                                <Text text={p.iso.id} type={TextType.secondaryDescription} fontSize={px(11)}/>
                            ]}/>
                        }/>,

                        <Tooltip title={`ISO-image created at: ${p.iso.timestamp}`} arrow noBorder children={
                            <FlexRow gap={t.gaps.smallGab.times(.5)} elements={[
                                <Icon icon={<CalendarTodayRounded/>} size={px(16)} color={t.colors.fontSecondaryColor}/>,
                                <Flex gap={px()} elements={[
                                    <Text text={p.iso.timestamp} type={TextType.secondaryDescription} fontSize={px(11)}/>,
                                    <Text text={`*${moment(p.iso.timestamp).fromNow()}*`} type={TextType.secondaryDescription} fontSize={px(11)}/>
                                ]}/>
                            ]}/>
                        }/>
                    ]}/>,

                    <SettingsGroup title={"ISO data"} elements={[
                        <SettingsElement title={"Folders"} groupDisplayMode forceRenderSubpageIcon iconConfig={{
                            enable: true,
                            iconGenerator: () => <FolderIcon/>
                        }} appendixGenerator={element => (
                            // margin={createMargin(0, t.gaps.defaultGab.measurand, 0, 0)}
                            <FlexRow gap={t.gaps.smallGab.times(.5)} elements={[
                                <Icon icon={<ListAltRounded/>} size={px(16)} color={t.colors.fontSecondaryColor}/>,
                                <Text text={`${data.folders.length}`} type={TextType.secondaryDescription} fontSize={px(11)}/>
                            ]}/>
                        )}/>,

                        <SettingsElement title={"Categories"} groupDisplayMode forceRenderSubpageIcon iconConfig={{
                            enable: true,
                            iconGenerator: () => <CategoryIcon/>
                        }} appendixGenerator={element => (
                            // margin={createMargin(0, t.gaps.defaultGab.measurand, 0, 0)}
                            <FlexRow gap={t.gaps.smallGab.times(.5)} elements={[
                                <Icon icon={<ListAltRounded/>} size={px(16)} color={t.colors.fontSecondaryColor}/>,
                                <Text text={`${data.categories.length}`} type={TextType.secondaryDescription} fontSize={px(11)}/>
                            ]}/>
                        )}/>,
                    ]}/>
                ]}/>
            ]}/>
        );
    }
}
