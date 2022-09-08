import {BernieComponent} from "../../../logic/BernieComponent";
import {Themeable} from "../../../logic/style/Themeable";
import {Assembly} from "../../../logic/assembly/Assembly";
import {BottomNavigation, BottomNavigationAction} from "@mui/material";
import {Text, TextType} from "../../lo/Text";
import {percent, px} from "../../../logic/style/DimensionalMeasured";
import {Icon} from "../../lo/Icon";
import {ReactComponent as LogoIcon} from "../../../assets/logo.svg";
import {ObjectVisualMeaning, VM} from "../../../logic/style/ObjectVisualMeaning";
import {App} from "../../../logic/app/App";
import {StaticDrawerMenu} from "../../lo/StaticDrawerMenu";
import {QuickActionPanel} from "../quickPanel/QuickActionPanel";
import {AnomalyInfo} from "../anomalyInfo/AnomalyInfo";
import {AnomalyLevel} from "../../../logic/data/AnomalyLevel";
import {ReactComponent as SettingsIcon} from "../../../assets/icons/ic-24/ic24-settings.svg";
import {ReactComponent as QuickPanelIcon} from "../../../assets/icons/ic-20/ic20-view-boxes.svg";
import {Flex, FlexBox} from "../../lo/FlexBox";
import {Align} from "../../../logic/style/Align";
import {SettingsGroup} from "../../lo/SettingsGroup";
import {SettingsElement} from "../settingsElement/SettingsElement";
import {FlexDirection} from "../../../logic/style/FlexDirection";
import {Dot} from "../../lo/Dot";
import {Color} from "../../../logic/style/Color";
import {Group} from "../../lo/Group";
import {Orientation} from "../../../logic/style/Orientation";
import React from "react";
import {SettingsPage} from "../settingsPage/SettingsPage";
import {FormatSize, Notifications, Speaker} from "@mui/icons-material";
import {ReactComponent as DevelopmentIcon} from "../../../assets/icons/ic-24/ic24-bug.svg";
import {Route, Switch} from "react-router-dom";
import {getOr} from "../../../logic/Utils";
import {AF} from "../../logic/ArrayFragment";
import {DrawerHeader} from "../../lo/DrawerHeader";
import {Justify} from "../../../logic/style/Justify";
import {If} from "../../logic/If";
import {Badge} from "../../lo/Badge";
import {createMargin} from "../../../logic/style/Margin";
import {BoardingActionsDrawer} from "../boardingActionsDrawer/BoardingActionsDrawer";

export class MobileNavigation extends BernieComponent<any, any, any> {

    init() {
        super.init();
        this.actionsAssembly();
    }

    private actionsAssembly() {
        this.assembly.assembly("actions", theme => {
            return (
                <BoardingActionsDrawer/>
            );
        })
    }

    componentRender(p: any, s: any, l: any, t: Themeable.Theme, a: Assembly): JSX.Element | undefined {
        return (
            <Flex style={{ backgroundColor: t.colors.backgroundHighlightColor.css(), zIndex: 1500}} fw gap={px()} elements={[
                this.a("actions"),

                <BottomNavigation showLabels value={"app"} sx={{
                    width: "100%",
                    backgroundColor: t.colors.backgroundHighlightColor.css(),
                    marginY: px(3).css(),
                    zIndex: 1500
                }}>
                    <BottomNavigationAction value={"app"} label={
                        <Text text={"App"} type={TextType.secondaryDescription} fontSize={px(11)}/>
                    } icon={
                        <Icon icon={<LogoIcon/>} visualMeaning={ObjectVisualMeaning.SUCCESS} colored/>
                    } onClick={() => {
                        this.dialog(
                            <StaticDrawerMenu body={props => {
                                return (
                                    <Switch children={
                                        <AF elements={
                                            App.app().screenManager.screens.map((screen, index) => {

                                                return (
                                                    <Route exact={getOr(screen.routeExact, false)} path={screen.location} render={props => (
                                                        <Flex width={percent(100)} align={Align.CENTER} gap={px(40)}>
                                                            <DrawerHeader
                                                                header={`Locations at *${screen.location}*`}
                                                                enableBadge
                                                                badgeVM={VM.UI_NO_HIGHLIGHT}
                                                                badgeText={"Screen-Manager"}
                                                                description={`All available locations at *${screen.location}* are listed here. Choose one to switch to`}
                                                            />

                                                            <SettingsGroup elements={
                                                                screen.viewFactory(screen).map(view => {
                                                                    let loc = App.app().screenManager.viewLocations.get(screen.location);
                                                                    if (loc === undefined || loc === null) loc = screen.defaultView;
                                                                    const active = view.id === loc;

                                                                    return (
                                                                        <SettingsElement forceRenderSubpageIcon={!active} groupDisplayMode title={view.displayName} iconConfig={{
                                                                            enable: true,
                                                                            color: Color.ofHex("#ffbd29"),
                                                                            iconGenerator: element => {
                                                                                return view.iconRenderer.render({
                                                                                    screenConfig: screen,
                                                                                    viewConfig: view,
                                                                                    active: active,
                                                                                    viewLocation: loc as string
                                                                                });
                                                                            }
                                                                        }} appendixGenerator={element => {
                                                                            return (
                                                                                <Flex margin={active ? createMargin(0, t.gaps.smallGab.withPlus(2).measurand,0, 0) : undefined} flexDir={FlexDirection.ROW} align={Align.CENTER} justifyContent={Justify.CENTER} height={percent(100)}>
                                                                                    <If condition={active} ifTrue={
                                                                                        Badge.badge("current", {
                                                                                            visualMeaning: VM.INFO,
                                                                                            theme: t
                                                                                        })
                                                                                    }/>
                                                                                </Flex>
                                                                            );
                                                                        }} onClick={element => {
                                                                            if (loc != null && !active) {
                                                                                App.use(app => {
                                                                                    app.screenManager.viewLocations.set(screen.location, view.id);
                                                                                    app.rerenderGlobally();
                                                                                });
                                                                            }
                                                                        }}/>
                                                                    );
                                                                })
                                                            }/>
                                                        </Flex>
                                                    )}/>
                                                );
                                            })
                                        }/>
                                    }/>
                                );
                            }}/>
                        );
                    }}/>

                    <BottomNavigationAction value={"qa"} label={
                        <Text text={"Quick actions"} whitespace={"nowrap"} type={TextType.secondaryDescription} fontSize={px(11)}/>
                    } icon={
                        <Icon icon={<QuickPanelIcon/>}/>
                    } onClick={() => {
                        if (App.app()?.shortcuts !== undefined) {
                            this.dialog(
                                <StaticDrawerMenu body={() => <QuickActionPanel noPadding/>}/>
                            );
                        } else {
                            this.dialog(
                                <AnomalyInfo anomaly={{
                                    level: AnomalyLevel.ERROR,
                                    description: "Cannot open Quick-actions panel, because **App.app()** returned *undefined*. This mostly happens, when the app isn't initialized."
                                }}/>
                            );
                        }
                    }}/>

                    <BottomNavigationAction value={"settings"} label={
                        <Text text={"Settings"} type={TextType.secondaryDescription} fontSize={px(11)}/>
                    } icon={
                        <Icon icon={<SettingsIcon/>}/>
                    }  onClick={() => {
                        this.dialog(
                            <SettingsPage pageName={"Settings"} description={"Settings page, the hub for all settings, configurations & information"} onExit={this.closeLocalDialog} content={page => (
                                <FlexBox width={percent(100)} align={Align.CENTER}>

                                    <SettingsGroup elements={[
                                        <SettingsElement forceRenderSubpageIcon groupDisplayMode title={"Notifications"} iconConfig={
                                            {enable: true, color: Color.ofHex("#ff453a"), iconGenerator: (element) => <Notifications/>}
                                        }/>,
                                        <SettingsElement forceRenderSubpageIcon groupDisplayMode title={"Sounds & Haptics"} iconConfig={
                                            {enable: true, color: Color.ofHex("#ff375f"), iconGenerator: (element) => <Speaker/>}
                                        }/>,
                                        <SettingsElement forceRenderSubpageIcon groupDisplayMode title={"Appearance"} iconConfig={
                                            {enable: true, color: Color.ofHex("#0a84ff"), iconGenerator: (element) => <FormatSize/>}
                                        }/>,
                                    ]}/>




                                    <SettingsGroup elements={[
                                        <SettingsElement forceRenderSubpageIcon groupDisplayMode title={"Open subpage"} onClick={element => {

                                            // Open the subpage
                                            page.subpage(settingsPage => (
                                                <SettingsPage pageName={"Subpage"} parentPageName={"Settings"} onExit={() => page.closeSubpage()} content={() => (
                                                    <>end</>
                                                )}/>
                                            ));

                                        }}/>,
                                        <SettingsElement forceRenderSubpageIcon groupDisplayMode title={"Set Status"} appendixGenerator={element => (
                                            <Flex gap={t.gaps.smallGab} flexDir={FlexDirection.ROW} align={Align.CENTER}>
                                                <Dot/>
                                                <Text text={"Invisible"} type={TextType.secondaryDescription} fontSize={px(11)}/>
                                            </Flex>
                                        )} iconConfig={{enable: true, color: Color.ofHex("#ffffff"), iconGenerator: (element) => <>?</>}} subpage={element => (


                                            <Flex width={percent(100)}>
                                                <SettingsGroup title={"Billing settings"} elements={[
                                                    <SettingsElement forceRenderSubpageIcon groupDisplayMode title={"Get Nitro"} iconConfig={{enable: true, color: Color.ofHex("#ffffff"), iconGenerator: (element) => <>?</>}}/>,
                                                    <SettingsElement forceRenderSubpageIcon groupDisplayMode title={"Server Boost"} iconConfig={{enable: true, color: Color.ofHex("#ffffff"), iconGenerator: (element) => <>?</>}}/>,
                                                    <SettingsElement forceRenderSubpageIcon groupDisplayMode title={"Nitro Gifting"} iconConfig={{enable: true, color: Color.ofHex("#ffffff"), iconGenerator: (element) => <>?</>}}/>
                                                ]}/>
                                            </Flex>


                                        )}/>,
                                        <SettingsElement forceRenderSubpageIcon groupDisplayMode title={"Account"} iconConfig={{enable: true, color: Color.ofHex("#ff3b30"), iconGenerator: (element) => <>?</>}}/>,
                                        <SettingsElement forceRenderSubpageIcon groupDisplayMode title={"User Profile"} iconConfig={{enable: true, color: Color.ofHex("#ff9500"), iconGenerator: (element) => <>?</>}}/>,
                                        <SettingsElement forceRenderSubpageIcon groupDisplayMode title={"Privacy & Safety"} iconConfig={{enable: true, color: Color.ofHex("#4cd964"), iconGenerator: (element) => <>?</>}}/>,
                                        <SettingsElement forceRenderSubpageIcon groupDisplayMode title={"Authorized Aps"} iconConfig={{enable: true, color: Color.ofHex("#ffffff"), iconGenerator: (element) => <>?</>}}/>,
                                        <SettingsElement forceRenderSubpageIcon groupDisplayMode title={"Connections"} iconConfig={{enable: true, color: Color.ofHex("#007aff"), iconGenerator: (element) => <>?</>}}/>,
                                        <SettingsElement forceRenderSubpageIcon groupDisplayMode title={"Friend Requests"} iconConfig={{enable: true, color: Color.ofHex("#5956d6"), iconGenerator: (element) => <>?</>}}/>,
                                        <SettingsElement forceRenderSubpageIcon groupDisplayMode title={"Scan QR Code"} iconConfig={{enable: true, color: Color.ofHex("#ffffff"), iconGenerator: (element) => <>?</>}}/>
                                    ]}/>

                                    <SettingsGroup title={"Billing settings"} elements={[
                                        <SettingsElement forceRenderSubpageIcon groupDisplayMode title={"Get Nitro"} iconConfig={{enable: true, color: Color.ofHex("#ffffff"), iconGenerator: (element) => <>?</>}}/>,
                                        <SettingsElement forceRenderSubpageIcon groupDisplayMode title={"Server Boost"} iconConfig={{enable: true, color: Color.ofHex("#ffffff"), iconGenerator: (element) => <>?</>}}/>,
                                        <SettingsElement forceRenderSubpageIcon groupDisplayMode title={"Nitro Gifting"} iconConfig={{enable: true, color: Color.ofHex("#ffffff"), iconGenerator: (element) => <>?</>}}/>
                                    ]}/>

                                    <SettingsGroup title={"App settings"} elements={[
                                        <SettingsElement forceRenderSubpageIcon groupDisplayMode title={"Language"} appendixGenerator={element => (
                                            <Text text={"English, UK"} type={TextType.secondaryDescription} fontSize={px(11)}/>
                                        )} iconConfig={{enable: true, color: Color.ofHex("#ffffff"), iconGenerator: (element) => <>?</>}}/>,
                                    ]}/>

                                    <SettingsGroup elements={[
                                        <SettingsElement forceRenderSubpageIcon groupDisplayMode title={"Developer settings"} iconConfig={{enable: true, color: t.colors.betaHighlightColor, iconGenerator: (element) => <DevelopmentIcon/>}} onClick={element => {
                                            // Open the Developer settings-subpage
                                            page.subpage(settingsPage => (
                                                <SettingsPage pageName={"Developer settings"} parentPageName={"Settings"} onExit={() => page.closeSubpage()} content={() => (
                                                    <Flex width={percent(100)} align={Align.CENTER}>
                                                        <SettingsGroup title={"Billing settings"} elements={[
                                                            <SettingsElement forceRenderSubpageIcon groupDisplayMode title={"Get Nitro"} iconConfig={{enable: true, color: Color.ofHex("#ffffff"), iconGenerator: (element) => <>?</>}}/>,
                                                            <SettingsElement forceRenderSubpageIcon groupDisplayMode title={"Server Boost"} iconConfig={{enable: true, color: Color.ofHex("#ffffff"), iconGenerator: (element) => <>?</>}}/>,
                                                            <SettingsElement forceRenderSubpageIcon groupDisplayMode title={"Nitro Gifting"} iconConfig={{enable: true, color: Color.ofHex("#ffffff"), iconGenerator: (element) => <>?</>}}/>
                                                        ]}/>

                                                        <SettingsGroup title={"App settings"} elements={[
                                                            <SettingsElement forceRenderSubpageIcon groupDisplayMode title={"Language"} appendixGenerator={element => (
                                                                <Text text={"English, UK"} type={TextType.secondaryDescription} fontSize={px(11)}/>
                                                            )} iconConfig={{enable: true, color: Color.ofHex("#ffffff"), iconGenerator: (element) => <>?</>}}/>,
                                                        ]}/>
                                                    </Flex>
                                                )}/>
                                            ));
                                        }}/>,
                                    ]}/>

                                    <Group width={percent(100)} orientation={Orientation.VERTICAL} removeChildBorders elements={[
                                        <SettingsElement groupDisplayMode title={"Log Out"} iconConfig={{enable: true, color: Color.ofHex("#ffffff"), iconGenerator: (element) => <>?</>}} promiseBasedOnClick={element => {
                                            return new Promise((resolve, reject) => setTimeout(() => resolve(undefined), 3000));
                                        }}/>,
                                    ]}/>
                                </FlexBox>
                            )}/>
                        );
                    }}/>
                </BottomNavigation>
            ]}/>
        );
    }
}
