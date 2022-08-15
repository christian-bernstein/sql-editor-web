import {BernieComponent} from "../../logic/BernieComponent";
import {Assembly} from "../../logic/assembly/Assembly";
import {Themeable} from "../../logic/style/Themeable";
import React, {useEffect, useState} from "react";
import {Screen} from "../../components/lo/Page";
import {percent, px} from "../../logic/style/DimensionalMeasured";
import {Flex, FlexBox} from "../../components/lo/FlexBox";
import {Button} from "../../components/lo/Button";
import {Justify} from "../../logic/style/Justify";
import {LiteGrid} from "../../components/lo/LiteGrid";
import {StaticDrawerMenu} from "../../components/lo/StaticDrawerMenu";
import {ReactComponent as ReleaseIcon} from "../../assets/icons/ic-24/ic24-globe.svg";
import {ReactComponent as DevelopmentIcon} from "../../assets/icons/ic-24/ic24-bug.svg";
import {ReactComponent as UnittestIcon} from "../../assets/icons/ic-24/ic24-extension.svg";
import {ReactComponent as SettingsIcon} from "../../assets/icons/ic-24/ic24-settings.svg";
import {ReactComponent as LogoIcon} from "../../assets/logo.svg";
import {Icon} from "../../components/lo/Icon";
import {Align} from "../../logic/style/Align";
import {Text, TextType} from "../../components/lo/Text";
import {App, utilizeGlobalTheme} from "../../logic/app/App";
import {AppPageMode} from "../app/AppPageMode";
import {getOr} from "../../logic/Utils";
import {ObjectVisualMeaning, VM} from "../../logic/style/ObjectVisualMeaning";
import {ProgressTracker} from "../../components/indev/ProgressTracker";
import {
    BottomNavigation,
    BottomNavigationAction,
    Step as MUIStep,
    StepContent,
    StepLabel,
    Stepper
} from "@mui/material";
import {createMargin} from "../../logic/style/Margin";
import {HOCWrapper} from "../../components/HOCWrapper";
import {QuickActionPanel} from "../../components/ho/quickPanel/QuickActionPanel";
import {AnomalyInfo} from "../../components/ho/anomalyInfo/AnomalyInfo";
import {AnomalyLevel} from "../../logic/data/AnomalyLevel";
import {EnumSelector} from "../../components/logic/EnumSelector";
import {SettingsElement} from "../../components/ho/settingsElement/SettingsElement";
import {Group} from "../../components/lo/Group";
import {Orientation} from "../../logic/style/Orientation";
import {FlexDirection} from "../../logic/style/FlexDirection";
import {Dot} from "../../components/lo/Dot";
import {Color} from "../../logic/style/Color";
import {SettingsGroup} from "../../components/lo/SettingsGroup";
import {SettingsPage} from "../../components/ho/settingsPage/SettingsPage";
import {FormatSize, Notifications, Speaker} from "@mui/icons-material";

export class UnitTestPage extends BernieComponent<any, any, any> {

    constructor() {
        super(undefined, undefined, undefined, {
            enableLocalDialog: true
        });
    }

    componentRender(p: any, s: any, l: any, t: Themeable.Theme, a: Assembly): JSX.Element | undefined {

        const confirmBody = (requestClose: () => void, submit: () => void) => (
            <StaticDrawerMenu vibration={{
                enable: true,
                pattern: [100],
                activeChannels: ["appear"]
            }} onCancel={() => {
                requestClose();
            }} onSubmit={() => {
                requestClose();
                submit();
            }} body={p => (
                <Flex width={percent(100)} gap={t.gaps.smallGab}>
                    <Text text={"Apply changes?"} type={TextType.smallHeader}/>
                    <Text text={"Applying changes will cause the website to reload."} type={TextType.secondaryDescription} fontSize={px(12)}/>
                    <LiteGrid columns={2} gap={t.gaps.smallGab}>
                        <Button text={"Cancel"} onClick={() => p.onCancel?.()}/>
                        <Button text={"Apply"} visualMeaning={ObjectVisualMeaning.WARNING} opaque onClick={() => p.onSubmit?.()}/>
                    </LiteGrid>
                </Flex>
            )}/>
        );

        return (
            <Screen children={
                <Flex width={percent(100)} height={percent(100)} justifyContent={Justify.FLEX_END} align={Align.CENTER}>
                    <HOCWrapper body={wrapper => (
                        <Button text={"QA-Panel"} onClick={() => {
                            wrapper.dialog(
                                <StaticDrawerMenu body={props => (
                                    <QuickActionPanel noPadding/>
                                )}/>
                            );
                        }}/>
                    )}/>

                    <Button text={"App settings"} onClick={() => {
                        const mode: AppPageMode = Number(getOr(window.localStorage.getItem("app-page-mode"), AppPageMode.UNIT_TEST.toString()))
                        const t = utilizeGlobalTheme();
                        this.dialog(
                            <StaticDrawerMenu body={props => {

                                class AppModeChooser extends BernieComponent<any, any, any> {
                                    constructor() {
                                        super(undefined, undefined, undefined, {
                                            enableLocalDialog: true
                                        });
                                    }
                                    componentRender(p: any, s: any, l: any, t: Themeable.Theme, a: Assembly): JSX.Element | undefined {

                                        const ProgressTracker: React.FC<{
                                            onComplete: (success: boolean) => void,
                                            actions: Array<{
                                                title: string,
                                                text: string,
                                                action: () => void
                                            }>
                                        }> = props => {
                                            const [state, setState] = useState({
                                                step: 0,
                                                success: true
                                            });

                                            useEffect(() => {
                                                const runner = setInterval(() => {
                                                    if (state.step === props.actions.length - 1 || !state.success) {
                                                        clearInterval(runner);
                                                        props.onComplete(state.success);
                                                    } else {
                                                        props.actions[state.step].action();
                                                        setState(prevState => ({
                                                            ...prevState,
                                                            step: prevState.step + 1,
                                                        }));
                                                    }
                                                }, 2000);
                                            });

                                            return (
                                                <Stepper activeStep={state.step} orientation="vertical" sx={{width: "100%"}}>
                                                    {
                                                        props.actions.map(action => (
                                                            <MUIStep key={String(0)}>
                                                                <StepLabel optional={
                                                                    <Text fontSize={px(11)} text={"optional"} uppercase visualMeaning={ObjectVisualMeaning.WARNING} coloredText/>
                                                                } children={
                                                                    <Text bold fontSize={px(13)} text={action.title}/>
                                                                }/>
                                                                <StepContent children={
                                                                    <FlexBox width={percent(100)}>
                                                                        <Text text={action.text}/>
                                                                    </FlexBox>
                                                                }/>
                                                            </MUIStep>
                                                        ))
                                                    }
                                                </Stepper>
                                            );
                                        }

                                        const reloadWebsite = () => {
                                            setTimeout(() => {
                                                this.dialog(
                                                    <HOCWrapper body={wrapper => <></>} componentDidMount={wrapper => {
                                                        wrapper.openLocalDialog(component => (
                                                            <StaticDrawerMenu body={props => (
                                                                <Flex width={percent(100)} align={Align.CENTER}>
                                                                    <Text text={"Preparing website restart"} type={TextType.smallHeader}/>
                                                                    <Text margin={createMargin(0, 0, 30, 0)} align={Align.CENTER} text={"This usually takes a couple seconds. Please don't manually reload the website, unless the website tells you to reload the site. After completing the shutdown, the website will automatically reload."} type={TextType.secondaryDescription} fontSize={px(12)}/>

                                                                    <ProgressTracker onComplete={() => {
                                                                        wrapper.closeLocalDialog();
                                                                        window.location.reload();
                                                                    }} actions={[
                                                                        {
                                                                            title: "Saving local data",
                                                                            text: "Trying to save all local data, like forms, settings & other information. *It cannot be guarantied, that all data can be persisted throughout the reloading.*",
                                                                            action: () => {}
                                                                        }, {
                                                                            title: "Disengage connection to node",
                                                                            text: "Closing all existing network websocket connections.",
                                                                            action: () => {}
                                                                        }
                                                                    ]}/>

                                                                    <Text margin={createMargin(30, 0, 0, 0)} align={Align.CENTER} text={"[Help center]()"} type={TextType.secondaryDescription} fontSize={px(12)}/>
                                                                </Flex>
                                                            )}/>
                                                        ));
                                                    }}/>
                                                );
                                            }, 100);
                                        };

                                        return (
                                            <LiteGrid columns={3} gap={t.gaps.defaultGab}>
                                                <Button onClick={() => {
                                                    if (mode === AppPageMode.RELEASE) {
                                                        return;
                                                    }

                                                    this.dialog(confirmBody(() => this.closeLocalDialog(), () => {
                                                        window.localStorage.setItem("app-page-mode", AppPageMode.RELEASE.toString());
                                                        reloadWebsite();
                                                    }));
                                                }} visualMeaning={mode === AppPageMode.RELEASE ? VM.SUCCESS_DEFAULT : VM.UI_NO_HIGHLIGHT} opaque width={percent(100)} padding={px()} highlight children={
                                                    <Flex width={percent(100)} paddingX={px()} padding paddingY={px(20)} gap={t.gaps.smallGab} justifyContent={Justify.CENTER} align={Align.CENTER}>
                                                        <Icon size={px(24)} icon={<ReleaseIcon/>}/>
                                                        <Text text={"Live"} type={TextType.secondaryDescription} fontSize={px(12)}/>
                                                    </Flex>
                                                }/>

                                                <Button onClick={() => {
                                                    if (mode === AppPageMode.DEVELOPMENT) {
                                                        return;
                                                    }

                                                    this.dialog(confirmBody(() => this.closeLocalDialog(), () => {
                                                        window.localStorage.setItem("app-page-mode", AppPageMode.DEVELOPMENT.toString())
                                                        reloadWebsite();
                                                    }));
                                                }} visualMeaning={mode === AppPageMode.DEVELOPMENT ? VM.SUCCESS_DEFAULT : VM.UI_NO_HIGHLIGHT} opaque highlight padding={px()} children={
                                                    <Flex width={percent(100)} padding paddingY={px(20)} gap={t.gaps.smallGab} justifyContent={Justify.CENTER} align={Align.CENTER}>
                                                        <Icon size={px(24)} icon={<DevelopmentIcon/>}/>
                                                        <Text text={"Development"} type={TextType.secondaryDescription} fontSize={px(12)}/>
                                                    </Flex>
                                                }/>

                                                <Button onClick={() => {
                                                    if (mode === AppPageMode.UNIT_TEST) {
                                                        return;
                                                    }

                                                    this.dialog(confirmBody(() => {
                                                        this.closeLocalDialog();
                                                    }, () => {
                                                        window.localStorage.setItem("app-page-mode", AppPageMode.UNIT_TEST.toString())
                                                        reloadWebsite();
                                                    }));

                                                }} visualMeaning={mode === AppPageMode.UNIT_TEST ? VM.SUCCESS_DEFAULT : VM.UI_NO_HIGHLIGHT} opaque highlight padding={px()} children={
                                                    <Flex width={percent(100)} padding paddingY={px(20)} gap={t.gaps.smallGab} justifyContent={Justify.CENTER} align={Align.CENTER}>
                                                        <Icon size={px(24)} icon={<UnittestIcon/>}/>
                                                        <Text text={"Unittest"} type={TextType.secondaryDescription} fontSize={px(12)}/>
                                                    </Flex>
                                                }/>
                                            </LiteGrid>
                                        );
                                    }
                                }

                                return (
                                    <Flex>
                                        <Text text={"App mode"} type={TextType.smallHeader}/>
                                        <AppModeChooser/>
                                        <Text text={"Choose the app mode. **Changing the app mode causes the website to reload. Unsaved data e.g. forms will be deleted**"} fontSize={px(12)} type={TextType.secondaryDescription}/>
                                    </Flex>
                                );
                            }}/>
                        );
                    }}/>

                    <Button text={"Anomaly"} onClick={() => {
                        this.dialog(
                            <EnumSelector from={AnomalyLevel} onSubmit={element => {
                                this.dialog(
                                    <AnomalyInfo anomaly={{
                                        level: AnomalyLevel[element as keyof typeof AnomalyLevel]
                                    }}/>
                                );
                            }}/>
                        );
                    }}/>





                    <Button text={"Open settings"} onClick={() => {
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







                    <BottomNavigation
                        showLabels
                        sx={{
                            width: "100%",
                            backgroundColor: t.colors.backgroundHighlightColor.css(),
                            borderRadius: t.radii.defaultObjectRadius.css()
                        }}
                        value={"app"}
                        onChange={(event, newValue) => {

                        }}
                    >
                        <BottomNavigationAction value={"app"} label={
                            <Text text={"App"} type={TextType.secondaryDescription} fontSize={px(11)}/>
                        } icon={
                            <Icon icon={<LogoIcon/>} visualMeaning={ObjectVisualMeaning.SUCCESS} colored/>
                        }/>
                        <BottomNavigationAction value={"qa"} label={
                            <Text text={"Quick actions"} whitespace={"nowrap"} type={TextType.secondaryDescription} fontSize={px(11)}/>
                        } icon={
                            <Icon icon={<ReleaseIcon/>}/>
                        } onClick={() => {
                            if (App.app()?.shortcuts !== undefined) {
                                this.dialog(
                                    <StaticDrawerMenu body={() => <QuickActionPanel/>}/>
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






                                <StaticDrawerMenu body={props => {
                                    return (
                                        <FlexBox width={percent(100)} align={Align.CENTER}>
                                            <SettingsGroup elements={[
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

                                            <Group width={percent(100)} orientation={Orientation.VERTICAL} removeChildBorders elements={[
                                                <SettingsElement groupDisplayMode title={"Log Out"} iconConfig={{enable: true, color: Color.ofHex("#ffffff"), iconGenerator: (element) => <>?</>}} promiseBasedOnClick={element => {
                                                    return new Promise((resolve, reject) => setTimeout(() => resolve(undefined), 3000));
                                                }}/>,
                                            ]}/>
                                        </FlexBox>
                                    );
                                }}/>















                            );
                        }}/>
                    </BottomNavigation>
                </Flex>
            }/>
        );
    }
}
