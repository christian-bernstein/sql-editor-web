import {BernieComponent} from "../../../logic/BernieComponent";
import {Assembly} from "../../../logic/Assembly";
import {Themeable} from "../../../Themeable";
import {PageV2} from "../../../components/Page";
import {LiteGrid} from "../../../components/LiteGrid";
import React from "react";
import {FlexBox} from "../../../components/FlexBox";
import {FlexDirection} from "../../../logic/style/FlexDirection";
import {Image} from "../../../components/Image";
import Banner from "../../../assets/images/img-2.png";
import {percent, px} from "../../../logic/style/DimensionalMeasured";
import {Align} from "../../../logic/Align";
import {Justify} from "../../../logic/style/Justify";
import {Text, TextType} from "../../../components/Text";
import {Badge} from "../../../components/Badge";
import {ObjectVisualMeaning} from "../../../logic/ObjectVisualMeaning";
import {AppHeader} from "../../../components/AppHeader";
import {ReactComponent as CloseIcon} from "../../../assets/icons/ic-20/ic20-close.svg";
import {App} from "../../../logic/App";
import {Icon} from "../../../components/Icon";
import {Box} from "../../../components/Box";
import {OverflowBehaviour} from "../../../logic/style/OverflowBehaviour";

export class MenuPageV2 extends BernieComponent<any, any, any> {

    constructor() {
        super(undefined, undefined, undefined);
        this.headerAssembly();
        this.mainAssembly();
    }

    private mainAssembly() {
        this.assembly.assembly("main", theme => {
            return (
                <PageV2 deactivatePadding>
                    <LiteGrid rows={3} height={percent(100)}>
                        {this.assembly.render({
                            component: "header"
                        })}
                    </LiteGrid>
                </PageV2>
            );
        })
    }

    // <Image src={Banner}/>
    private headerAssembly() {
        this.assembly.assembly("header", theme => {
            return (
                <FlexBox gap={px()} padding paddingX={px()} paddingY={px()} width={percent(100)}>
                    <FlexBox width={percent(100)} padding paddingX={theme.paddings.defaultObjectPadding}>
                        <AppHeader title={"Menu"} right={
                            <Icon icon={<CloseIcon/>} onClick={() => App.app().toggleMainDialog("closed")}/>
                        }/>
                    </FlexBox>
                    {/*<FlexBox width={percent(100)} gap={px()}>
                        <Image src={Banner} pure width={percent(100)} height={px(200)} objPosX={"center"} objPosY={px(-50)}/>
                        <Separator orientation={Orientation.HORIZONTAL}/>
                    </FlexBox>*/}
                    <FlexBox width={percent(100)} padding paddingX={theme.paddings.defaultObjectPadding} paddingY={px()} flexDir={FlexDirection.ROW} gap={theme.gaps.defaultGab} align={Align.CENTER}>
                        <Box overflowXBehaviour={OverflowBehaviour.HIDDEN} overflowYBehaviour={OverflowBehaviour.HIDDEN} noPadding height={px(70)} width={px(70)} children={<Image pure src={Banner} onClick={() => {
                            this.goto("cdn/IMPLEMENT")
                        }}/>}/>
                        <FlexBox flexDir={FlexDirection.COLUMN} gap={px()} justifyContent={Justify.CENTER}>
                            <Text text={"Christian"} type={TextType.smallHeader} bold/>
                            <Text text={"christian.bernsteinde@gmail.com"}/>
                            <FlexBox flexDir={FlexDirection.ROW} gap={theme.gaps.smallGab}>
                                <Badge visualMeaning={ObjectVisualMeaning.BETA} opaque>
                                    <Text text={"team"} uppercase bold/>
                                </Badge>
                            </FlexBox>
                        </FlexBox>
                    </FlexBox>
                </FlexBox>
            );
        })
    }

    componentRender(p: any, s: any, l: any, t: Themeable.Theme, a: Assembly): JSX.Element | undefined {
        return this.assembly.render({
            component: "main"
        })
    }
}
