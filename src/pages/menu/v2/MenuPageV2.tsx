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
import {ReactComponent as QuickPanelIcon} from "../../../assets/icons/ic-20/ic20-view-boxes.svg";
import {ReactComponent as SettingsIcon} from "../../../assets/icons/ic-20/ic20-settings.svg";
import {ReactComponent as ChatIcon} from "../../../assets/icons/ic-20/ic20-chat.svg";
import {App} from "../../../logic/App";
import {Icon} from "../../../components/Icon";
import {Box} from "../../../components/Box";
import {OverflowBehaviour} from "../../../logic/style/OverflowBehaviour";
import {MenuState} from "./MenuState";
import styled from "styled-components";
import {ReactComponent as AppLogo} from "../../../assets/logo.svg";
import {ServerConnectionIcon} from "../../../components/ServerConnectionIcon";
import {Separator} from "../../../components/Separator";
import {Orientation} from "../../../logic/style/Orientation";
import {If} from "../../../components/If";
import {ContextCompound} from "../../../components/ContextCompound";
import {QuickActionPanel} from "../../../components/ho/quickPanel/QuickActionPanel";
import {Default, Desktop} from "../../../components/Media";

export type MenuPageV2Props = {
    children: JSX.Element
}

export type MenuPageV2LocalState = {
    state: MenuState
}

export class MenuPageV2 extends BernieComponent<MenuPageV2Props, any, MenuPageV2LocalState> {

    constructor(props: MenuPageV2Props) {
        super(props, undefined, {
            state: MenuState.SMALL
        });
        this.headerAssembly();
        this.mainAssembly();
        this.menuSmallWrapperAssembly();
        this.menuSmallAssembly();
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

    private menuSmallAssembly() {
        this.assembly.assembly("menu-small", theme => {
            const Wrapper = styled.div`
              height: 100%;
              padding: ${theme.paddings.defaultObjectPadding.css()};
            `;

            return (
                <Default>
                    <Wrapper>
                        <FlexBox height={percent(100)} flexDir={FlexDirection.COLUMN} justifyContent={Justify.SPACE_BETWEEN}>
                            <FlexBox width={percent(100)} align={Align.CENTER} justifyContent={Justify.CENTER} flexDir={FlexDirection.COLUMN}>
                                <Box noPadding borderless noBGColor>
                                    <If condition={App.app().config.debugMode} ifTrue={
                                        <Icon colored visualMeaning={ObjectVisualMeaning.BETA} size={px(28)} icon={<AppLogo/>}/>
                                    } ifFalse={
                                        <Icon size={px(28)} icon={<AppLogo/>}/>
                                    }/>
                                </Box>
                                <Separator orientation={Orientation.HORIZONTAL}/>
                                {App.app().screenManager.renderMenuIcons()}
                            </FlexBox>

                            <Box borderless>
                                <FlexBox flexDir={FlexDirection.COLUMN} gap={theme.gaps.smallGab} align={Align.CENTER} justifyContent={Justify.CENTER} width={percent(100)} height={percent(100)}>
                                    <ServerConnectionIcon openConnectionMetricsDialog pulse={false}/>
                                    <Separator orientation={Orientation.HORIZONTAL}/>

                                    <ContextCompound wrapMenu={false} menu={<QuickActionPanel/>} children={
                                        <Icon icon={<QuickPanelIcon/>}/>
                                    }/>
                                </FlexBox>
                            </Box>
                        </FlexBox>
                    </Wrapper>
                </Default>

            );
        });
    }

    private menuSmallWrapperAssembly() {
        this.assembly.assembly("menu-small-wrapper", theme => {
            const Wrapper = styled.div`
              width: 100%;
              height: 100%;
              display: grid;
              grid-template-columns: auto 1fr;
              background-color: ${theme.colors.backgroundColorOuter.css()};
            `;

            const MenuWrapper = styled.div`
              width: 100%;
              height: 100%;
              background-color: ${theme.colors.backgroundColorOuter.css()};
            `;

            const BodyWrapper = styled.div`
              // height: calc(100vh - ${theme.paddings.defaultObjectPadding.css()});
              height: 100%;
              background-color: ${theme.colors.backgroundColorOuter.css()};
              align-self: end;
              // border-top-left-radius: ${theme.radii.defaultObjectRadius.withPlus(10).css()};
              overflow: hidden;
              position: relative;
            `;

            return (
                <Wrapper>
                    <MenuWrapper children={this.assembly.render({
                        component: "menu-small"
                    })}/>

                    <BodyWrapper id={"menu-body-container"}>
                        {this.props.children}
                    </BodyWrapper>
                </Wrapper>
            );
        })
    }

    componentRender(p: any, s: any, l: any, t: Themeable.Theme, a: Assembly): JSX.Element | undefined {
        return this.assembly.render({
            component: "menu-small-wrapper"
        })
    }
}
