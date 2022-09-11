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
import {Text, TextType} from "../../components/lo/Text";
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
import {Select, SelectElement} from "../../components/lo/Select";
import {UnitTestUtils} from "./UnitTestUtils";
import {UnitTest} from "./UnitTest";
import {ProjectCardTest} from "./tests/ProjectCardTest";
import {QuickTest} from "./QuickTest";
import {NumPadTest} from "./tests/NumPadTest";
import {SnackbarTest} from "./tests/SnackbarTest";
import {AtlasTest} from "./tests/AtlasTest";

export type UnitTestPageLocalState = {
    fdh: FormDataHub
}

export class UnitTestPage extends BernieComponent<any, any, UnitTestPageLocalState> {

    static loadExternalUnittests() {
        UnitTestUtils.createTest(QuickTest.test);
        UnitTestUtils.createTest(ProjectCardTest.test);
        UnitTestUtils.createTest(NumPadTest.test);
        UnitTestUtils.createTest(SnackbarTest.test);
        UnitTestUtils.createTest(AtlasTest.test);
    }

    constructor() {
        super(undefined, undefined, {
            fdh: new FormDataHub("unit-test-page").loadFromLocalStore()
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
        UnitTestPage.loadExternalUnittests();
        this.testAssembly();
        this.headerAssembly();
        this.hoverControlButtonAssembly();
        this.toolbarAssembly();
        this.unitSelectorAssembly();
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

    private unitSelectorAssembly() {
        this.assembly.assembly("unit-selector", theme => {
            const fdhAddress: string = "unittest";
            const unittestsMap: Map<string, UnitTest<any>> = UnitTestUtils.unittests;
            const unittests: [string, UnitTest<any>][] = Array.from(unittestsMap);

            const elements: SelectElement[] = unittests.map(([name, unit]) => ({
                value: unit.name
            } as SelectElement));
            const activeUnittestName: string | undefined = this.local.state.fdh.get(fdhAddress);

            const activeUnittest: UnitTest<any> | undefined =
                activeUnittestName !== undefined
                    ? unittestsMap.get(activeUnittestName)
                    : unittests[0]?.[1]

            return this.component(() => (
                <Flex width={percent(100)} children={
                    <AF elements={[
                        <Text text={"Unittest Selector"} uppercase bold type={TextType.secondaryDescription} fontSize={px(12)} align={Align.START}/>,
                        <Select
                            elements={() => elements}
                            initialValue={activeUnittest?.name}
                            onChange={(value: string) => {
                                this.local.state.fdh.set(fdhAddress, value, true);

                                setTimeout(() => {
                                    this.rerender("data", "test", "unit-selector");
                                }, 1);
                            }}
                        />
                    ]}/>
                }/>
            ), "unit-selector");
        });
    }

    private toolbarAssembly() {
        this.assembly.assembly("toolbar", theme => {
            return (
                <Flex
                    margin={createMargin(0, 0, 40, 0)}
                    flexDir={FlexDirection.ROW}
                    width={percent(100)}
                    overflowXBehaviour={OverflowBehaviour.SCROLL}
                    justifyContent={Justify.CENTER}
                    align={Align.CENTER}
                    children={
                        <Flex align={Align.CENTER} flexDir={FlexDirection.ROW} children={
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
                                <HOCWrapper body={wrapper => (
                                    <Button text={"App mode"} onClick={() => {
                                        wrapper.dialog(
                                            <AppModeSwitcher/>
                                        );
                                    }}/>
                                )}/>,
                                <Button text={"Rerender 'test'"} onClick={() => {
                                    this.rerender("test")
                                }}/>
                            ]}/>
                        }/>
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

                                                <AF elements={[
                                                    this.a("toolbar"),
                                                    this.a("unit-selector")
                                                ]}/>

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

    private testAssembly() {
        this.assembly.assembly("test", (theme, props) => {
            const fdhAddress: string = "unittest";
            const unittestsMap: Map<string, UnitTest<any>> = UnitTestUtils.unittests;
            const unittests: [string, UnitTest<any>][] = Array.from(unittestsMap);
            const elements: SelectElement[] = unittests.map(([name, unit]) => ({ value: `${unit.displayName} _(${unit.name})_` } as SelectElement));
            const activeUnittestName: string | undefined = this.local.state.fdh.get(fdhAddress);
            const activeUnittest: UnitTest<any> | undefined = activeUnittestName !== undefined ? unittestsMap.get(activeUnittestName) : unittests[0]?.[1];

            if (activeUnittestName === undefined && activeUnittest !== undefined) {
                this.local.state.fdh.set(fdhAddress, activeUnittest.name, true);
            }

            if (activeUnittest === undefined) {
                // todo make drawer error message & better 'no assembly' screen
                return (
                    <>no unittest found</>
                );
            }

            return activeUnittest.factory(activeUnittest.element);
        });
    }

    componentRender(p: any, s: any, l: any, t: Themeable.Theme, a: Assembly): JSX.Element | undefined {
        return this.component(local => (
            <Screen children={
                <Flex align={Align.CENTER} style={{ maxHeight: "100%" }} width={percent(100)} height={percent(100)} children={
                    <AF elements={[
                        this.a("hover-control"),
                        this.component((local) => {
                            if (!local.state.fdh.get("pure", false)) {
                                return this.a("header");
                            } else return <></>;
                        }, "data"),
                        <Flex style={{flex: "1 1 auto"}} overflowYBehaviour={OverflowBehaviour.SCROLL} align={Align.CENTER} justifyContent={Justify.CENTER} width={percent(100)} children={
                            this.component(local => {
                                return this.a("test");
                            }, "test")
                        }/>
                    ]}/>
                }/>
            }/>
        ), "unittest-root");
    }
}
