import {BernieComponent} from "../../logic/BernieComponent";
import {Assembly} from "../../logic/assembly/Assembly";
import {Themeable} from "../../logic/style/Themeable";
import React from "react";
import {Screen} from "../../components/lo/Page";
import {Flex} from "../../components/lo/FlexBox";
import {Align} from "../../logic/style/Align";
import {AF} from "../../components/logic/ArrayFragment";
import {percent, px} from "../../logic/style/DimensionalMeasured";
import {Justify} from "../../logic/style/Justify";
import {Button} from "../../components/lo/Button";
import {Text} from "../../components/lo/Text";
import {OverflowBehaviour} from "../../logic/style/OverflowBehaviour";
import {ReactComponent as ControlsIcon} from "../../assets/icons/ic-20/ic20-unfold-more.svg";
import {HOCWrapper} from "../../components/HOCWrapper";
import {FlexDirection} from "../../logic/style/FlexDirection";
import {StaticDrawerMenu} from "../../components/lo/StaticDrawerMenu";
import {QuickActionPanel} from "../../components/ho/quickPanel/QuickActionPanel";
import {EnumSelector} from "../../components/logic/EnumSelector";
import {AnomalyLevel} from "../../logic/data/AnomalyLevel";
import {AnomalyInfo} from "../../components/ho/anomalyInfo/AnomalyInfo";
import {AppModeSwitcher} from "../../components/ho/appModeSwitcher/AppModeSwitcher";
import {DrawerHeader} from "../../components/lo/DrawerHeader";
import {ObjectVisualMeaning, VM} from "../../logic/style/ObjectVisualMeaning";
import {createMargin} from "../../logic/style/Margin";
import {App} from "../../logic/app/App";
import {If} from "../../components/logic/If";
import {Cursor} from "../../logic/style/Cursor";
import {Icon} from "../../components/lo/Icon";
import {FormDataHub} from "../../tests/epicure/components/FormDataHub";
import {SettingsElement} from "../../components/ho/settingsElement/SettingsElement";
import {IOSwitch} from "../../components/lo/IOSwitch";
import {SettingsGroup} from "../../components/lo/SettingsGroup";
import {Separator} from "../../components/lo/Separator";
import {Orientation} from "../../logic/style/Orientation";
import {AppPageMode} from "../app/AppPageMode";
import {getOr} from "../../logic/Utils";
import {Dot} from "../../components/lo/Dot";
import {Color} from "../../logic/style/Color";

export type UnitTestPageLocalState = {
    fdh: FormDataHub
}

export class UnitTestPage extends BernieComponent<any, any, UnitTestPageLocalState> {

    // TEST SECTION

    /**
     * Note: Test assembly can be re-rendered by calling the 'test' channel.
     */
    private testAssembly() {
        // You may use this pre-made utility function to reload the test assembly
        const rerender = () => this.rerender("test");

        this.assembly.assembly("test", (theme, props) => {
            // Display your test component here
            return (
                <>No test</>
            );
        })
    }

    // INTERNAL COMPONENT CODE

    constructor() {
        super(undefined, undefined, {
            fdh: new FormDataHub("unit-test-page")
        }, {
            enableLocalDialog: true
        });
    }

    componentDidMount() {
        super.componentDidMount();
        this.local.state.fdh.loadFromLocalStore();
        this.rerender("data");
    }

    init() {
        super.init();
        this.testAssembly();
        this.headerAssembly();
        this.hoverControlButtonAssembly();
        this.toolbarAssembly();
    }

    private togglePureMode(pure: boolean | undefined, rerenderDelay?: number) {
        const newPure = pure === undefined ? !this.isPure() : pure;
        this.local.state.fdh.set("pure", newPure, true);
        if (rerenderDelay !== undefined) {
            setTimeout(() => this.rerender("data"), rerenderDelay);
        } else {
            this.rerender("data");
        }
    }

    private isPure(): boolean {
        return this.local.state.fdh.get("pure", false);
    }

    private static getAppMode(): AppPageMode {
        return Number(getOr(window.localStorage.getItem("app-page-mode"), AppPageMode.UNIT_TEST.toString()));
    }

    private toolbarAssembly() {
        this.assembly.assembly("toolbar", theme => {
            return (
                <Flex
                    width={percent(100)}
                    margin={createMargin(0, 0, 40, 0)}
                    overflowXBehaviour={OverflowBehaviour.SCROLL}
                    flexDir={FlexDirection.ROW}
                    justifyContent={Justify.CENTER}
                    align={Align.CENTER}
                    children={
                        <AF elements={[
                            <HOCWrapper body={wrapper => (
                                <If condition={App.app() !== undefined} ifTrue={
                                    <Button text={"QA-Panel"} onClick={() => {
                                        wrapper.dialog(
                                            <StaticDrawerMenu body={props => (
                                                <QuickActionPanel noPadding/>
                                            )}/>
                                        );
                                    }}/>
                                } ifFalse={
                                    <Button cursor={Cursor.notAllowed} opaque children={
                                        <Text whitespace={"nowrap"} text={"QA-Panel"} coloredText visualMeaning={VM.UI_NO_HIGHLIGHT}/>
                                    }/>
                                }/>
                            )}/>,
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
                            }}/>,
                            <Button text={"App mode"} onClick={() => {
                                this.dialog(
                                    <AppModeSwitcher/>
                                );
                            }}/>,
                            <Button text={"Rerender 'test'"} onClick={() => {
                                this.rerender("test")
                            }}/>
                        ]}/>
                    }
                />
            );
        });
    }

    private hoverControlButtonAssembly() {
        this.assembly.assembly("hover-control", theme => {
            return (
                <HOCWrapper body={wrapper => {
                    return (
                        <Flex style={{
                            position: "absolute",
                            zIndex: 1000,
                            top: theme.paddings.defaultObjectPadding.css(),
                            right: theme.paddings.defaultObjectPadding.css()
                        }} children={
                            <Button children={
                                <Icon icon={<ControlsIcon/>}/>
                            } onClick={() => {
                                wrapper.dialog(
                                    <StaticDrawerMenu body={props => {

                                        return (
                                            <Flex width={percent(100)}>
                                                <DrawerHeader
                                                    header={"Control-Center"}
                                                    description={"Configure the unit-test page to your needs"}
                                                    enableBadge
                                                    badgeVM={ObjectVisualMeaning.UI_NO_HIGHLIGHT}
                                                    badgeText={"Unit-test"}
                                                />

                                                {
                                                    this.a("toolbar")
                                                }

                                                <Flex width={percent(100)}>
                                                    <SettingsGroup title={"UI settings"} elements={[
                                                        <SettingsElement
                                                            title={"Enable pure mode"}
                                                            description={"Pure mode hides unnecessary UI elements from the unit-test page"}
                                                            groupDisplayMode
                                                            appendixGenerator={element => {
                                                                return this.component(local => {
                                                                    const pure = this.isPure();
                                                                    return (
                                                                        <IOSwitch value={pure} onChange={(event, checked) => {
                                                                            this.togglePureMode(checked, 100);
                                                                        }}/>
                                                                    );
                                                                }, "data");
                                                            }}
                                                            onClick={element => {
                                                                this.togglePureMode(undefined);
                                                            }}
                                                            iconConfig={{
                                                                enable: true,
                                                                iconGenerator: element => (
                                                                    <Icon icon={<ControlsIcon/>}/>
                                                                )
                                                            }}
                                                        />
                                                    ]}/>

                                                </Flex>
                                            </Flex>
                                        );
                                    }}/>
                                );
                            }}/>
                        }/>
                    );
                }}/>
            );
        })
    }

    private headerAssembly() {
        this.assembly.assembly("header", theme => {
            return (
                <Flex width={percent(100)} align={Align.CENTER}>
                    <DrawerHeader
                        header={"Unit-test page"}
                        description={"This page is designed to test SQL-Editor react components & systems with high efficiency."}
                        enableBadge
                        badgeVM={ObjectVisualMeaning.UI_NO_HIGHLIGHT}
                        badgeText={"Unit-test"}
                    />
                    {
                        this.a("toolbar")
                    }

                    <Flex width={percent(100)} align={Align.CENTER} flexDir={FlexDirection.ROW} justifyContent={Justify.CENTER}>
                        <Separator orientation={Orientation.HORIZONTAL}/>
                        <Flex flexDir={FlexDirection.ROW} align={Align.CENTER} justifyContent={Justify.CENTER} children={
                            <AF elements={[
                                this.component(local => (
                                    <Text
                                        whitespace={"nowrap"}
                                        fontSize={px(13)}
                                        text={new Date().toLocaleTimeString()}
                                    />
                                ), "test"),
                                <If condition={UnitTestPage.getAppMode() === AppPageMode.UNIT_TEST} ifTrue={
                                    <Flex align={Align.CENTER} justifyContent={Justify.CENTER} flexDir={FlexDirection.ROW} children={
                                        <AF elements={[
                                            <Dot/>,
                                            <Text
                                                whitespace={"nowrap"}
                                                bold
                                                text={"Unit mode"}
                                                uppercase
                                                coloredText
                                                fontSize={px(13)}
                                                // color={Color.ofHex("#ffbd29")}
                                                visualMeaning={VM.WARNING}
                                            />
                                        ]}/>
                                    }/>
                                }/>
                            ]}/>
                        }/>
                        <Separator orientation={Orientation.HORIZONTAL}/>
                    </Flex>

                </Flex>
            );
        })
    }

    componentRender(p: any, s: any, l: any, t: Themeable.Theme, a: Assembly): JSX.Element | undefined {
        return (
            <Screen children={
                <Flex align={Align.CENTER} width={percent(100)} height={percent(100)} children={
                    <AF elements={[
                        this.a("hover-control"),
                        this.component((local) => {
                            if (!local.state.fdh.get("pure", false)) {
                                return this.a("header");
                            } else return <></>;
                        }, "data"),
                        <Flex style={{flex: "1 1 auto"}} align={Align.CENTER} justifyContent={Justify.CENTER} width={percent(100)} children={
                            this.component(local => {
                                return this.a("test");
                            }, "test")
                        }/>
                    ]}/>
                }/>
            }/>
        );
    }
}
