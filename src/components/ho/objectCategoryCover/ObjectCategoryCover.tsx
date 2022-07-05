import {BernieComponent} from "../../../logic/BernieComponent";
import {Themeable} from "../../../logic/style/Themeable";
import {Assembly} from "../../../logic/assembly/Assembly";
import {Box} from "../../lo/Box";
import {FlexBox} from "../../lo/FlexBox";
import {percent, px} from "../../../logic/style/DimensionalMeasured";
import {FlexDirection} from "../../../logic/style/FlexDirection";
import {Justify} from "../../../logic/style/Justify";
import {Text, TextType} from "../../lo/Text";
import {Icon} from "../../lo/Icon";
import {ReactComponent as ContextIcon} from "../../../assets/icons/ic-20/ic20-more-ver.svg";
import {ReactComponent as ShareIcon} from "../../../assets/icons/ic-24/ic24-share.svg";
import {ReactComponent as StatisticsIcon} from "../../../assets/icons/ic-20/ic20-chart-bar.svg";
import {ReactComponent as OpenIcon} from "../../../assets/icons/ic-16/ic16-play.svg";
import {Align} from "../../../logic/style/Align";
import {createMargin} from "../../../logic/style/Margin";
import {Dimension} from "../../../logic/style/Dimension";
import {Cursor} from "../../../logic/style/Cursor";
import {ContextCompound} from "../contextCompound/ContextCompound";
import {ContextMenuElement} from "../../lo/ContextMenuElement";
import {Badge} from "../../lo/Badge";
import {ObjectVisualMeaning} from "../../../logic/style/ObjectVisualMeaning";
import {Button} from "../../lo/Button";

export type ObjectCategoryCoverProps = {
    icon: (props: ObjectCategoryCoverProps) => JSX.Element,
    title: string,
    objectCount: number,
    onSelect?: (props: ObjectCategoryCoverProps) => void
}

export class ObjectCategoryCover extends BernieComponent<ObjectCategoryCoverProps, any, any> {

    constructor(props: ObjectCategoryCoverProps) {
        super(props, undefined, undefined);
    }

    init() {
        super.init();
        this.desktopMenuAssembly();
    }

    private desktopMenuAssembly() {
        this.assembly.assembly("desktop-menu", theme => (
            <FlexBox gap={px(1)} height={percent(100)}>
                <ContextMenuElement visualMeaning={ObjectVisualMeaning.BETA} icon={() => <Icon icon={<StatisticsIcon/>}/>} opaque titleAppendix={() => Badge.beta()} title={"Statistics"}/>
                <ContextMenuElement title={"Browse"}/>
                <ContextMenuElement title={"Filter"}/>
                <ContextMenuElement title={"Change visibility"}/>
                <ContextMenuElement icon={() => <Icon icon={<ShareIcon/>}/>} title={"Share"}/>
            </FlexBox>
        ));
    }

    private onSelect() {
        this.props.onSelect?.(this.props);
    }

    componentRender(p: ObjectCategoryCoverProps, s: any, l: any, t: Themeable.Theme, a: Assembly): JSX.Element | undefined {
        return (
            <Box onClick={this.onSelect} cursor={Cursor.pointer} width={px(200)} height={px(200)} children={
                <FlexBox width={percent(100)} height={percent(100)} flexDir={FlexDirection.ROW} justifyContent={Justify.SPACE_BETWEEN}>
                    <FlexBox height={percent(100)} width={percent(50)} flexDir={FlexDirection.COLUMN} justifyContent={Justify.SPACE_BETWEEN}>
                        {p.icon(p)}
                        <FlexBox gap={t.gaps.smallGab}>
                            <Text cursor={Cursor.pointer} text={p.title} whitespace={"nowrap"} type={TextType.smallHeader} margin={createMargin(0, 0, t.gaps.smallGab.measurand, 0, Dimension.px)}/>
                            <Text cursor={Cursor.pointer} text={String(p.objectCount).replace(/\B(?=(\d{3})+(?!\d))/g, ".")} type={TextType.secondaryDescription} fontSize={px(12)}/>
                            <Text cursor={Cursor.pointer} text={"5 Days ago"} type={TextType.secondaryDescription} fontSize={px(12)}/>
                        </FlexBox>
                    </FlexBox>

                    <FlexBox height={percent(100)} width={percent(50)} flexDir={FlexDirection.COLUMN} align={Align.END} justifyContent={Justify.SPACE_BETWEEN} >
                        <ContextCompound menu={this.a("desktop-menu")} children={
                            <Icon icon={<ContextIcon/>}/>
                        }/>

                    </FlexBox>
                </FlexBox>
            }/>
        );
    }

}
