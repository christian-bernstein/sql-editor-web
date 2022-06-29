import {BernieComponent} from "../../../logic/BernieComponent";
import {Assembly} from "../../../logic/assembly/Assembly";
import {Themeable} from "../../../logic/style/Themeable";
import {Screen} from "../../../components/lo/Page";
import {LiteGrid} from "../../../components/lo/LiteGrid";
import React from "react";
import {FlexBox} from "../../../components/lo/FlexBox";
import {FlexDirection} from "../../../logic/style/FlexDirection";
import {Image} from "../../../components/lo/Image";
import Banner from "../../../assets/images/img-2.png";
import {percent, px} from "../../../logic/style/DimensionalMeasured";
import {Align} from "../../../logic/style/Align";
import {Justify} from "../../../logic/style/Justify";
import {Text, TextType} from "../../../components/lo/Text";
import {Badge} from "../../../components/lo/Badge";
import {ObjectVisualMeaning} from "../../../logic/style/ObjectVisualMeaning";
import {AppHeader} from "../../../components/lo/AppHeader";
import {ReactComponent as CloseIcon} from "../../../assets/icons/ic-20/ic20-close.svg";
import {ReactComponent as QuickPanelIcon} from "../../../assets/icons/ic-20/ic20-view-boxes.svg";
import {App} from "../../../logic/app/App";
import {Icon} from "../../../components/lo/Icon";
import {Box} from "../../../components/lo/Box";
import {OverflowBehaviour} from "../../../logic/style/OverflowBehaviour";
import {MenuState} from "./MenuState";
import styled from "styled-components";
import {ReactComponent as AppLogo} from "../../../assets/logo.svg";
import {ServerConnectionIcon} from "../../../components/ho/serverConnectionIcon/ServerConnectionIcon";
import {Separator} from "../../../components/lo/Separator";
import {Orientation} from "../../../logic/style/Orientation";
import {If} from "../../../components/logic/If";
import {ContextCompound} from "../../../components/ho/contextCompound/ContextCompound";
import {QuickActionPanel} from "../../../components/ho/quickPanel/QuickActionPanel";
import {Default, Mobile} from "../../../components/logic/Media";
import {SwipeableDrawer} from "@mui/material";
import {MobileMenuPage} from "../../mobileMenu/MobileMenuPage";

export type MenuPageV2Props = {
    children: JSX.Element
}

export type MenuPageV2LocalState = {
    state: MenuState,
    qaPanelOpenState: boolean
}

export class MenuPageV2 extends BernieComponent<MenuPageV2Props, any, MenuPageV2LocalState> {

    public static instance?: MenuPageV2 = undefined;

    constructor(props: MenuPageV2Props) {
        super(props, undefined, {
            // state: MenuState.SMALL,
            state: MenuState.HIDDEN,
            qaPanelOpenState: false
        });
        this.headerAssembly();
        this.mainAssembly();
        this.menuSmallWrapperAssembly();
        this.menuSmallAssembly();
        this.menuMobileWrapperAssembly();
    }

    componentDidMount() {
        super.componentDidMount();
        MenuPageV2.instance = this;
    }

    componentWillUnmount() {
        super.componentWillUnmount();
        MenuPageV2.instance = undefined;
    }

    public static setMenuState(state: MenuState) {
        if (MenuPageV2.instance !== undefined) {
            MenuPageV2.instance.local.setStateWithChannels({
                state: state
            }, ["main"]);
        }
    }

    private mainAssembly() {
        this.assembly.assembly("main", theme => {
            return (
                <Screen deactivatePadding>
                    <LiteGrid rows={3} height={percent(100)}>
                        {this.assembly.render({
                            component: "header"
                        })}
                    </LiteGrid>
                </Screen>
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
                            <Text text={"xyz@gmail.com"}/>
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

                                    <ContextCompound open={this.local.state.qaPanelOpenState} onClose={() => {
                                        this.local.setState({
                                            qaPanelOpenState: false
                                        })
                                    }} wrapMenu={false} menu={<QuickActionPanel/>} children={
                                        <Icon icon={<QuickPanelIcon/>} onClick={() => {
                                            this.local.setState({
                                                qaPanelOpenState: true
                                            })
                                        }}/>
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

    private menuMobileWrapperAssembly() {
        this.assembly.assembly("menu-mobile-wrapper", (theme, props) => {
            return this.component(local => {

                return (
                    <div style={{
                        position: "relative"
                    }}>
                        <div style={{
                            position: "absolute"
                        }} children={
                            <SwipeableDrawer
                                anchor={"left"}
                                open={this.local.state.state !== MenuState.HIDDEN}
                                onClose={() => {
                                    this.local.setStateWithChannels({
                                        state: MenuState.HIDDEN
                                    }, ["menu-extender"]);
                                }}
                                onOpen={() => {
                                    this.local.setStateWithChannels({
                                        state: MenuState.EXTENDED
                                    }, ["menu-extender"]);
                                }}
                                children={
                                    <MobileMenuPage/>
                                }
                            />
                        }/>
                        <Screen deactivatePadding children={this.props.children} onDoubleClick={() => {
                            this.local.setStateWithChannels({
                                state: MenuState.EXTENDED
                            }, ["menu-extender"]);
                        }}/>
                    </div>
                );

                //return (
                //    <>
                //        <Dialog open={this.local.state.state !== MenuState.HIDDEN} keepMounted onClose={() => this.local.setStateWithChannels({
                //            state: MenuState.HIDDEN
                //        }, ["menu-extender"])} TransitionComponent={this.DialogTransition} fullScreen={false} sx={{
                //            '& .MuiDialog-paper': {
                //                background: "transparent",
                //                maxHeight: "100vh !important",
                //                maxWidth: "100vw !important",
                //                margin: "0 !important",
                //                borderRadius: "0 !important"
                //            }
                //        }} children={
                //            <Screen children={
                //                <Centered fullHeight children={
                //                    <Text text={"menu"}/>
                //                }/>
                //            }/>
                //        }/>
                //    </>
                //);
            }, "menu-extender");
        })
    }

    componentRender(p: any, s: any, l: any, t: Themeable.Theme, a: Assembly): JSX.Element | undefined {
        return this.component(local => {
            if (local.state.state === MenuState.HIDDEN) {
                return this.props.children;
            } else {
                return (
                    <>
                        <Default children={
                            this.assembly.render({
                                component: "menu-small-wrapper"
                            })
                        }/>

                        <Mobile children={
                            this.assembly.render({
                                component: "menu-mobile-wrapper"
                            })
                        }/>
                    </>
                );
            }
        }, "main")
    }
}
