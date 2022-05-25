import {BernieComponent} from "../../../logic/BernieComponent";
import {Assembly} from "../../../logic/assembly/Assembly";
import {Themeable} from "../../../logic/style/Themeable";
import {TitledBox} from "../../lo/TitledBox";
import {Text} from "../../lo/Text";
import {percent, px} from "../../../logic/style/DimensionalMeasured";
import {FlexBox} from "../../lo/FlexBox";
import {Icon} from "../../lo/Icon";

import {ReactComponent as ServerIcon} from "../../../assets/icons/ic-20/ic20-dns.svg";
import {ReactComponent as WarningIcon} from "../../../assets/icons/ic-16/ic16-report.svg";
import {ReactComponent as OptionsIcon} from "../../../assets/icons/ic-20/ic20-more-ver.svg";
import {ReactComponent as HistoryIcon} from "../../../assets/icons/ic-20/ic20-bookmark.svg";
import {FlexDirection} from "../../../logic/style/FlexDirection";
import {Align} from "../../../logic/style/Align";
import {Justify} from "../../../logic/style/Justify";
import {ObjectVisualMeaning} from "../../../logic/style/ObjectVisualMeaning";
import {Button} from "../../lo/Button";
import {ContextCompound} from "../contextCompound/ContextCompound";
import {ContextMenuElement} from "../../lo/ContextMenuElement";
import {Box} from "../../lo/Box";
import {Badge} from "../../lo/Badge";
import {Separator} from "../../lo/Separator";
import {Orientation} from "../../../logic/style/Orientation";

export class ServiceMonitorOverview extends BernieComponent<any, any, any> {

    constructor() {
        super(undefined, undefined, undefined);
    }

    componentRender(p: any, s: any, l: any, t: Themeable.Theme, a: Assembly): JSX.Element | undefined {
        return this.component(local => (
            <TitledBox width={percent(50)} titleRenderer={instance => (
                <FlexBox flexDir={FlexDirection.ROW} align={Align.CENTER} width={percent(100)} justifyContent={Justify.SPACE_BETWEEN}>
                    <FlexBox gap={t.gaps.smallGab} flexDir={FlexDirection.ROW} align={Align.CENTER}>
                        <Icon size={px(20)} icon={<ServerIcon/>}/>
                        <Text text={"SQL-Editor Server"}/>
                    </FlexBox>
                    <FlexBox gap={t.gaps.smallGab} flexDir={FlexDirection.ROW} align={Align.CENTER} height={percent(100)}>
                        <Text text={"partial outage"} coloredText visualMeaning={ObjectVisualMeaning.WARNING} fontSize={px(10)}/>
                        <Icon size={px(20)} icon={<WarningIcon/>} colored visualMeaning={ObjectVisualMeaning.WARNING}/>
                    </FlexBox>
                </FlexBox>
            )} bodyRenderers={new Map<string, (instance: TitledBox) => JSX.Element>([
                ["default", instance => (
                    <FlexBox flexDir={FlexDirection.ROW} align={Align.CENTER} width={percent(100)} justifyContent={Justify.SPACE_BETWEEN}>
                        <FlexBox gap={t.gaps.smallGab} flexDir={FlexDirection.ROW} align={Align.CENTER}>
                            <Button padding={t.paddings.defaultTextIconPadding}>
                                <Text text={"Test"}/>
                            </Button>
                            <Button padding={t.paddings.defaultTextIconPadding}>
                                <Text text={"History"}/>
                            </Button>
                        </FlexBox>
                        <ContextCompound menu={
                            <FlexBox gap={px(1)}>
                                <ContextMenuElement title={"History"} icon={() => <Icon icon={<HistoryIcon/>}/>}/>
                                <ContextMenuElement title={"Copy service id"} icon={() => Badge.beta()} visualMeaning={ObjectVisualMeaning.BETA} opaque/>
                            </FlexBox>
                        } children={
                            <Icon size={px(20)} icon={<OptionsIcon/>}/>
                        }/>
                    </FlexBox>
                )]
            ])}/>
        ), "container");
    }
}
