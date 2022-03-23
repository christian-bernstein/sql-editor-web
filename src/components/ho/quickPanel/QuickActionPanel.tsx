import {BernieComponent} from "../../../logic/BernieComponent";
import {Themeable} from "../../../Themeable";
import {Assembly} from "../../../logic/Assembly";
import {Box} from "../../Box";
import React, {useState} from "react";
import {FlexBox} from "../../FlexBox";
import {LiteGrid} from "../../LiteGrid";
import {getOr, Utils} from "../../../logic/Utils";
import {Icon} from "../../Icon";
import {ElementHeader} from "../../ElementHeader";
import {CustomTooltip} from "../../CustomTooltip";
import {ObjectVisualMeaning} from "../../../logic/ObjectVisualMeaning";
import {Button} from "../../Button";
import {ReactComponent as ChatIcon} from "../../../assets/icons/ic-20/ic20-chat.svg";
import {ReactComponent as LogIcon, ReactComponent as QuickIcon} from "../../../assets/icons/ic-20/ic20-bolt.svg";
import {ReactComponent as HelpIcon} from "../../../assets/icons/ic-20/ic20-help.svg";
import {percent, px} from "../../../logic/style/DimensionalMeasured";
import {Text} from "../../Text";
import {Separator} from "../../Separator";
import {QuickActionConfig} from "../../../logic/data/quick/QuickActionConfig";
import {App, utilizeGlobalTheme} from "../../../logic/App";
import {If} from "../../If";
import {BounceLoader} from "react-spinners";
import {Input} from "../../Input";
import {FlexDirection} from "../../../logic/style/FlexDirection";
import {Align} from "../../../logic/Align";
import {CircularProgress, Zoom} from "@mui/material";
import {Justify} from "../../../logic/style/Justify";
import {Constants} from "../../../Constants";
import {BadgedWrapper} from "../../BadgedWrapper";
import {Cursor} from "../../../logic/style/Cursor";
import {ReactComponent as FullscreenEnterIcon} from "../../../assets/icons/ic-20/ic20-fullscreen.svg";
import {ReactComponent as FullscreenExitIcon} from "../../../assets/icons/ic-20/ic20-fullscreen-exit.svg";

export type QuickActionPanelLocalState = {
    updating: boolean
}

export class QuickActionPanel extends BernieComponent<any, any, QuickActionPanelLocalState> {

    constructor() {
        super(undefined, undefined, {
            updating: false
        });
    }

    private getQuickActionConfigs(): QuickActionConfig[] {

        const Test: React.FC<{panel: QuickActionPanel}> = props => {
            const [working, setWorking] = useState(false);

            return (
                <If condition={working} ifTrue={
                    <Button padding={utilizeGlobalTheme().paddings.defaultObjectPadding} shrinkOnClick visualMeaning={ObjectVisualMeaning.UI_NO_HIGHLIGHT} children={
                        <BounceLoader size={"20px"} color={utilizeGlobalTheme().colors.warnColor.css()}/>
                    }/>
                } ifFalse={
                    <Button padding={utilizeGlobalTheme().paddings.defaultObjectPadding} shrinkOnClick opaque visualMeaning={ObjectVisualMeaning.BETA} onClick={() => {
                        setWorking(true);

                        setTimeout(() => {
                            props.panel.ifActive(() => setWorking(false));
                        }, 2000);
                    }} children={
                        <Icon icon={<ChatIcon/>}/>
                    }/>
                }/>
            );
        }

        return [
            {
                tags: [],
                render(theme: Themeable.Theme, panel: QuickActionPanel): JSX.Element {
                    return (
                        <Test panel={panel}/>
                    );
                },
                renderHover(theme: Themeable.Theme, panel: QuickActionPanel): JSX.Element {
                    return (
                        <Text text={"Hello world"}/>
                    );
                }
            },
            {
                tags: ["Open logs"],
                render(theme: Themeable.Theme, panel: QuickActionPanel): JSX.Element {
                    return (
                        <Box cursor={Cursor.pointer} highlight bgColor={theme.colors.backgroundHighlightColor200} children={
                            <CustomTooltip noBorder arrow title={"Open log dialog"} TransitionComponent={Zoom} onClick={() => {
                                App.app().callAction("open-main-dialog", Constants.logDialog)
                            }} children={
                                <span children={
                                    <BadgedWrapper badge={
                                        <Text text={`${App.app().sophisticatedLogHistory.length}`} fontSize={px(12)}/>
                                    } showBadgeInitially>
                                        <Icon icon={<LogIcon/>}/>
                                    </BadgedWrapper>
                                }/>
                            }/>
                        }/>
                    );
                }
            },
            {
                tags: ["Toggle fullscreen"],
                render(theme: Themeable.Theme, panel: QuickActionPanel): JSX.Element {
                    return (
                        <CustomTooltip noBorder arrow title={"Toggle fullscreen"} TransitionComponent={Zoom} children={
                            <span children={
                                <Box cursor={Cursor.pointer} highlight bgColor={theme.colors.backgroundHighlightColor200} children={
                                    <Icon icon={(() => {
                                        if (document.fullscreenElement === null) {
                                            return <FullscreenEnterIcon/>
                                        } else {
                                            return <FullscreenExitIcon/>
                                        }
                                    })()} onClick={() => Utils.toggleFullScreen(() => {
                                        App.app().rerenderGlobally();
                                    })}/>
                                }/>
                            }/>
                        }/>
                    );
                }
            }
        ];
    }

    componentRender(p: any, s: any, l: QuickActionPanelLocalState, t: Themeable.Theme, a: Assembly): JSX.Element | undefined {
        return (
            <Box width={percent(100)} borderless gapY={t.gaps.defaultGab}>
                <ElementHeader title={"Quick actions"} icon={
                    this.component(local => {
                        return (
                            <If condition={local.state.updating} ifTrue={
                                <FlexBox width={px(20)} height={px(20)} align={Align.CENTER} justifyContent={Justify.CENTER} children={
                                    <Icon size={px(16)} icon={
                                        <CircularProgress variant={"indeterminate"} size={16} sx={{
                                            color: t.colors.iconColor.css()
                                        }}/>
                                    }/>
                                }/>

                            } ifFalse={
                                <Icon icon={<QuickIcon/>}/>
                            }/>
                        );
                    }, "updating")
                } appendix={
                    <FlexBox flexDir={FlexDirection.ROW} align={Align.CENTER} width={percent(100)}>
                        <Input fontWeight={"lighter"} bgColor={t.colors.backgroundHighlightColor200} minHeightBoundary={false} height={percent(100)} placeholder={"Search action"} onChange={ev => {
                            if (!this.local.state.updating) {
                                this.local.setStateWithChannels({
                                    updating: true
                                }, ["updating"], () => {
                                    setTimeout(() => {
                                        this.local.setStateWithChannels({
                                            updating: false
                                        }, ["updating"])
                                    }, 2000)
                                });
                            }
                        }}/>
                        <CustomTooltip arrow title={<Text text={"This panel shows you some quick actions. \nThese are actions, which don't require multiple steps to complete."}/>} children={
                            <Icon icon={<HelpIcon/>}/>
                        }/>
                    </FlexBox>
                }/>
                <Separator/>
                <FlexBox height={percent(100)} width={percent(100)}>
                    <FlexBox>
                        <ElementHeader title={"App actions"}/>
                        <LiteGrid gap={t.gaps.smallGab} columns={8} rows={1}>
                            {this.getQuickActionConfigs().filter(config => getOr(config.shouldShow, () => true)()).map(config => {
                                if (config.renderHover !== undefined) {
                                    return (
                                        <CustomTooltip title={config.renderHover(t, this)} children={
                                            config.render(t, this)
                                        }/>
                                    );
                                } else {
                                    return config.render(t, this);
                                }
                            })}
                        </LiteGrid>
                    </FlexBox>
                </FlexBox>
            </Box>
        );
    }
}
