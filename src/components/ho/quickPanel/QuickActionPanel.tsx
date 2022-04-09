import {BernieComponent} from "../../../logic/BernieComponent";
import {Themeable} from "../../../Themeable";
import {Assembly} from "../../../logic/Assembly";
import {Box} from "../../Box";
import React, {useState} from "react";
import {FlexBox} from "../../FlexBox";
import {LiteGrid} from "../../LiteGrid";
import {array, getOr} from "../../../logic/Utils";
import {Icon} from "../../Icon";
import {ElementHeader} from "../../ElementHeader";
import {CustomTooltip} from "../../CustomTooltip";
import {ObjectVisualMeaning} from "../../../logic/ObjectVisualMeaning";
import {Button} from "../../Button";
import {ReactComponent as ChatIcon} from "../../../assets/icons/ic-20/ic20-chat.svg";
import {ReactComponent as QuickIcon} from "../../../assets/icons/ic-20/ic20-bolt.svg";
import {ReactComponent as HelpIcon} from "../../../assets/icons/ic-20/ic20-help.svg";
import {ReactComponent as RunIcon} from "../../../assets/icons/ic-20/ic20-play.svg";
import {DimensionalMeasured, percent, px} from "../../../logic/style/DimensionalMeasured";
import {Text, TextType} from "../../Text";
import {Separator} from "../../Separator";
import {QuickActionConfig} from "../../../logic/data/quick/QuickActionConfig";
import {App, utilizeGlobalTheme} from "../../../logic/App";
import {If} from "../../If";
import {BounceLoader} from "react-spinners";
import {Input} from "../../Input";
import {FlexDirection} from "../../../logic/style/FlexDirection";
import {Align} from "../../../logic/Align";
import {CircularProgress} from "@mui/material";
import {Justify} from "../../../logic/style/Justify";
import {Orientation} from "../../../logic/style/Orientation";
import {OverflowBehaviour} from "../../../logic/style/OverflowBehaviour";
import {Dimension} from "../../../logic/style/Dimension";

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
            const theme = utilizeGlobalTheme();

            return (
                <If condition={working} ifTrue={
                    <Button padding={theme.paddings.defaultObjectPadding} shrinkOnClick visualMeaning={ObjectVisualMeaning.UI_NO_HIGHLIGHT} children={
                        <BounceLoader size={"20px"} color={theme.colors.warnColor.css()}/>
                    }/>
                } ifFalse={
                    <Button padding={theme.paddings.defaultObjectPadding} shrinkOnClick opaque visualMeaning={ObjectVisualMeaning.BETA} onClick={() => {
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
            ...array({
                // todo add onClick
                tags: ["asd", "asdasd", "hellow", "asd", "asdasd", "hellow", "asd", "asdasd", "hellow"],
                displayName: "Hello world",
                description: "Description of the hello world action",
                render(theme: Themeable.Theme, panel: QuickActionPanel): JSX.Element {
                    return (
                        <Test panel={panel}/>
                    );
                }
            } as QuickActionConfig, 11)
        ];
    }

    private renderBody(): JSX.Element {
        const t = utilizeGlobalTheme();

        return (
            <>{
                App.app().shortcuts.quickActionsShard().quickActionsCategories?.map(qac => {
                    const actions = qac.getQuickActions();
                    const theme = utilizeGlobalTheme();

                    const renderBase = (config: QuickActionConfig) => {
                        return (
                            <If condition={getOr(config.wrapInDefaultButton, true)} ifTrue={
                                <Button padding={theme.paddings.defaultObjectPadding} shrinkOnClick opaque={config.beta} visualMeaning={config.visualMeaning ? config.visualMeaning : (config.beta ? ObjectVisualMeaning.BETA : ObjectVisualMeaning.UI_NO_HIGHLIGHT)} children={
                                    config.render(t, this, config)
                                }/>
                            } ifFalse={
                                config.render(t, this, config)
                            }/>
                        );
                    }

                    return (
                        <>
                            <ElementHeader title={qac.config.displayName} appendix={
                                <FlexBox flexDir={FlexDirection.ROW} align={Align.CENTER} width={percent(100)}>
                                    <Separator orientation={Orientation.HORIZONTAL}/>
                                    <Text text={`${actions.length}`} uppercase type={TextType.smallHeader} coloredText fontSize={px(10)}/>
                                </FlexBox>
                            }/>

                            <LiteGrid gap={t.gaps.smallGab} columns={8} rows={1}>
                                {qac.getQuickActions().filter(config => getOr(config.shouldShow, () => true)()).map(config => {
                                    if (config.renderHover !== undefined) {
                                        return (
                                            <CustomTooltip wrapperStyle={config.wrapperStyleOverwrite} arrow title={config.renderHover(t, this)} children={
                                                <span children={renderBase(config)}/>
                                            }/>
                                        );
                                    } else {
                                        return (
                                            <CustomTooltip wrapperStyle={config.wrapperStyleOverwrite} arrow noPadding noBorder enterDelay={2000} title={
                                                <Box width={percent(100)} gapY={theme.gaps.defaultGab}>
                                                    <ElementHeader title={config.displayName} boldHeader icon={<
                                                        Icon icon={<RunIcon/>}/>
                                                    } beta={getOr(config.beta, false)} appendix={
                                                        <FlexBox width={percent(100)} gap={theme.gaps.smallGab} overflowXBehaviour={OverflowBehaviour.SCROLL} flexDir={FlexDirection.ROW} children={config.tags.map(tag => {
                                                            return (
                                                                <Button padding={theme.paddings.defaultBadgePadding} visualMeaning={ObjectVisualMeaning.UI_NO_HIGHLIGHT} children={
                                                                    <Text text={tag} fontSize={px(12)} uppercase type={TextType.secondaryDescription}/>
                                                                }/>
                                                            );
                                                        })}/>
                                                    }/>

                                                    <If condition={config.description !== undefined} ifTrue={
                                                        <Text text={config.description as string}/>
                                                    }/>
                                                </Box>
                                            } children={
                                                <span children={renderBase(config)}/>
                                            }/>
                                        );
                                    }
                                })}
                            </LiteGrid>
                        </>
                    );
                })
            }</>
        );
    }

    componentRender(p: any, s: any, l: QuickActionPanelLocalState, t: Themeable.Theme, a: Assembly): JSX.Element | undefined {
        return (
            <Box width={percent(100)} maxHeight={DimensionalMeasured.of(100, Dimension.vw)} borderless gapY={t.gaps.defaultGab}>
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
                            <span children={
                                <Icon icon={<HelpIcon/>}/>
                            }/>
                        }/>
                    </FlexBox>
                }/>

                <FlexBox overflowYBehaviour={OverflowBehaviour.SCROLL} width={percent(100)}>
                    <FlexBox>
                        <FlexBox height={percent(100)}>
                            {this.renderBody()}
                        </FlexBox>
                    </FlexBox>
                </FlexBox>
            </Box>
        );
    }
}
