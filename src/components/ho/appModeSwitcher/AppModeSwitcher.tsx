import {BernieComponent} from "../../../logic/BernieComponent";
import {Themeable} from "../../../logic/style/Themeable";
import {Assembly} from "../../../logic/assembly/Assembly";
import {StaticDrawerMenu} from "../../lo/StaticDrawerMenu";
import {Flex, FlexBox} from "../../lo/FlexBox";
import {percent, px} from "../../../logic/style/DimensionalMeasured";
import {Text, TextType} from "../../lo/Text";
import {LiteGrid} from "../../lo/LiteGrid";
import {Button} from "../../lo/Button";
import {ObjectVisualMeaning, VM} from "../../../logic/style/ObjectVisualMeaning";
import {Justify} from "../../../logic/style/Justify";
import {Align} from "../../../logic/style/Align";
import {HOCWrapper} from "../../HOCWrapper";
import {AppPageMode} from "../../../libs/sql/pages/app/AppPageMode";
import {getOr} from "../../../logic/Utils";
import React, {useEffect, useState} from "react";
import {Step as MUIStep, StepContent, StepLabel, Stepper} from "@mui/material";
import {createMargin} from "../../../logic/style/Margin";
import {Icon} from "../../lo/Icon";
import {ReactComponent as ReleaseIcon} from "../../../assets/icons/ic-24/ic24-globe.svg";
import {ReactComponent as DevelopmentIcon} from "../../../assets/icons/ic-24/ic24-bug.svg";
import {ReactComponent as UnittestIcon} from "../../../assets/icons/ic-24/ic24-extension.svg";
import {Badge} from "../../lo/Badge";
import {utilizeGlobalTheme} from "../../../logic/app/App";

export class AppModeSwitcher extends BernieComponent<any, any, any> {

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

        const mode: AppPageMode = Number(getOr(window.localStorage.getItem("app-page-mode"), AppPageMode.UNIT_TEST.toString()));

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

        const onModeClick = (nextMode: AppPageMode) => {
            if (mode === nextMode) {
                return;
            }

            this.dialog(confirmBody(() => {
                this.closeLocalDialog();
            }, () => {
                window.localStorage.setItem("app-page-mode", nextMode.toString())
                reloadWebsite();
            }));
        }

        return (
            <StaticDrawerMenu body={props => {

                class AppModeChooser extends BernieComponent<any, any, any> {
                    constructor() {
                        super(undefined, undefined, undefined, {
                            enableLocalDialog: true
                        });
                    }
                    componentRender(p: any, s: any, l: any, t: Themeable.Theme, a: Assembly): JSX.Element | undefined {

                        return (
                            <LiteGrid columns={3} gap={t.gaps.defaultGab}>
                                <Button onClick={() => onModeClick(AppPageMode.RELEASE)} visualMeaning={mode === AppPageMode.RELEASE ? VM.SUCCESS : VM.UI_NO_HIGHLIGHT} opaque width={percent(100)} padding={px()} highlight children={
                                    <Flex width={percent(100)} paddingX={px()} padding paddingY={px(20)} gap={t.gaps.smallGab} justifyContent={Justify.CENTER} align={Align.CENTER}>
                                        <Icon size={px(24)} icon={<ReleaseIcon/>}/>
                                        <Text text={"Live"} type={TextType.secondaryDescription} fontSize={px(12)}/>
                                    </Flex>
                                }/>

                                <Button onClick={() => onModeClick(AppPageMode.DEVELOPMENT)} visualMeaning={mode === AppPageMode.DEVELOPMENT ? VM.BETA : VM.UI_NO_HIGHLIGHT} opaque highlight padding={px()} children={
                                    <Flex width={percent(100)} padding paddingY={px(20)} gap={t.gaps.smallGab} justifyContent={Justify.CENTER} align={Align.CENTER}>
                                        <Icon size={px(24)} icon={<DevelopmentIcon/>}/>
                                        <Text text={"Development"} type={TextType.secondaryDescription} fontSize={px(12)}/>
                                    </Flex>
                                }/>

                                <Button onClick={() => onModeClick(AppPageMode.UNIT_TEST)} visualMeaning={mode === AppPageMode.UNIT_TEST ? VM.BETA : VM.UI_NO_HIGHLIGHT} opaque highlight padding={px()} children={
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
                    <Flex width={percent(100)} align={Align.CENTER}>
                        {Badge.badge("development", {
                            visualMeaning: ObjectVisualMeaning.SUCCESS,
                        })}
                        <Text text={"Select app mode"} type={TextType.smallHeader}/>
                        <Text margin={createMargin(0, 0, 30, 0)} align={Align.CENTER} text={"Change the websites app mode. "} type={TextType.secondaryDescription} fontSize={px(12)}/>
                        <AppModeChooser/>
                        <Text text={"**Changing the app mode causes the website to reload. Unsaved data e.g. forms will be deleted**"} fontSize={px(12)} type={TextType.secondaryDescription}/>

                        <Text margin={createMargin(30, 0, 0, 0)} align={Align.CENTER} text={"[Help center]()"} type={TextType.secondaryDescription} fontSize={px(12)}/>
                    </Flex>
                );
            }}/>
        );
    }

}
