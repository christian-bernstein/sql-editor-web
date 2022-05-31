import {BernieComponent} from "../../../logic/BernieComponent";
import {Themeable} from "../../../logic/style/Themeable";
import {Assembly} from "../../../logic/assembly/Assembly";
import {Box} from "../../lo/Box";
import React from "react";
import {FlexBox} from "../../lo/FlexBox";
import {LiteGrid} from "../../lo/LiteGrid";
import {getOr} from "../../../logic/Utils";
import {Icon} from "../../lo/Icon";
import {ElementHeader} from "../../lo/ElementHeader";
import {CustomTooltip} from "../../lo/CustomTooltip";
import {ObjectVisualMeaning} from "../../../logic/style/ObjectVisualMeaning";
import {Button} from "../../lo/Button";
import {ReactComponent as QuickIcon} from "../../../assets/icons/ic-20/ic20-bolt.svg";
import {ReactComponent as HelpIcon} from "../../../assets/icons/ic-20/ic20-help.svg";
import {ReactComponent as RunIcon} from "../../../assets/icons/ic-20/ic20-play.svg";
import {ReactComponent as FilterIcon} from "../../../assets/icons/ic-20/ic20-filter.svg";
import {DimensionalMeasured, percent, px} from "../../../logic/style/DimensionalMeasured";
import {Text, TextType} from "../../lo/Text";
import {Separator} from "../../lo/Separator";
import {QuickActionConfig} from "../../../logic/data/quick/QuickActionConfig";
import {App, utilizeGlobalTheme} from "../../../logic/app/App";
import {If} from "../../logic/If";
import {Input} from "../../lo/Input";
import {FlexDirection} from "../../../logic/style/FlexDirection";
import {Align} from "../../../logic/style/Align";
import {CircularProgress} from "@mui/material";
import {Justify} from "../../../logic/style/Justify";
import {Orientation} from "../../../logic/style/Orientation";
import {OverflowBehaviour} from "../../../logic/style/OverflowBehaviour";
import {Dimension} from "../../../logic/style/Dimension";
import {QuickActionCategory} from "../../../logic/data/quick/QuickActionCategory";
import {Centered} from "../../lo/PosInCenter";
import {Default, Mobile} from "../../logic/Media";
import {Cursor} from "../../../logic/style/Cursor";

export type QuickActionPanelLocalState = {
    updating: boolean,
    rawFilter?: string
}

export class QuickActionPanel extends BernieComponent<any, any, QuickActionPanelLocalState> {

    constructor() {
        super(undefined, undefined, {
            updating: false
        });
    }

    private static handleQAClick(event: React.MouseEvent<HTMLSpanElement, MouseEvent>, qa: QuickActionConfig) {
        qa.onClick?.(event, qa);
    }

    private applyLocalFilter(qac: QuickActionCategory, actions: QuickActionConfig[]): QuickActionConfig[] {
        const filter = this.local.state.rawFilter;
        if (filter !== undefined) {
            return actions.filter(ac => {
                const applicants = [ac.displayName, ...ac.tags];
                for (const applicant of applicants) {
                    try {
                        if (applicant.match(filter)) {
                            return true;
                        }
                    } catch (e) {
                        console.error(e);
                    }
                }
                return false;
            });
        } else return actions;
    }

    private renderBody(): JSX.Element {
        const t = utilizeGlobalTheme();
        const filteredCategories = App.app().shortcuts.quickActionsShard().quickActionsCategories?.filter(qac => this.applyLocalFilter(qac, qac.getQuickActions(true)).length > 0);

        if (filteredCategories && filteredCategories.length > 0) {
            return (
                <>{
                    filteredCategories?.map(qac => {
                        const actions = this.applyLocalFilter(qac, qac.getQuickActions(true));
                        const theme = utilizeGlobalTheme();

                        const renderBase = (config: QuickActionConfig) => {
                            const allowedAction: boolean = config.isAllowedAction === undefined ? true : config.isAllowedAction();

                            return (
                                <span onClick={event => QuickActionPanel.handleQAClick(event, config)} children={
                                    <If condition={getOr(config.wrapInDefaultButton, true)} ifTrue={
                                        <Button cursor={allowedAction ? Cursor.pointer : Cursor.notAllowed} padding={theme.paddings.defaultObjectPadding} shrinkOnClick opaque={getOr(config.opaque, config.beta)} visualMeaning={config.visualMeaning ? config.visualMeaning : (config.beta ? ObjectVisualMeaning.BETA : ObjectVisualMeaning.UI_NO_HIGHLIGHT)} children={
                                            config.render(t, this, config)
                                        }/>
                                    } ifFalse={
                                        config.render(t, this, config)
                                    }/>
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
                                    {actions.map(config => {
                                        if (config.renderHover !== undefined) {
                                            return (
                                                <CustomTooltip enterDelay={700} wrapperStyle={config.wrapperStyleOverwrite} arrow title={config.renderHover(t, this)} children={renderBase(config)}/>
                                            );
                                        } else {
                                            return (
                                                <CustomTooltip enterDelay={700} wrapperStyle={config.wrapperStyleOverwrite} arrow noPadding noBorder title={
                                                    <Box width={percent(100)} gapY={theme.gaps.defaultGab}>
                                                        <ElementHeader title={config.displayName} boldHeader icon={<
                                                            Icon icon={<RunIcon/>}/>
                                                        } beta={getOr(config.beta, false)} appendix={
                                                            <FlexBox gap={theme.gaps.smallGab} overflowXBehaviour={OverflowBehaviour.SCROLL} flexDir={FlexDirection.ROW} children={config.tags.map(tag => {
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
                                                } children={renderBase(config)}/>
                                            );
                                        }
                                    })}
                                </LiteGrid>
                            </>
                        );
                    })
                }</>
            );
        } else {
            return (
                <Centered>
                    <FlexBox width={percent(100)} align={Align.CENTER} flexDir={FlexDirection.COLUMN}>
                        <Icon icon={<FilterIcon/>} size={px(30)}/>
                        <Text text={"No quick action was found"} align={Align.CENTER} type={TextType.secondaryDescription}/>
                    </FlexBox>
                </Centered>
            );
        }
    }

    componentRender(p: any, s: any, l: QuickActionPanelLocalState, t: Themeable.Theme, a: Assembly): JSX.Element | undefined {
        return (
            <Box width={percent(100)} maxHeight={DimensionalMeasured.of(100, Dimension.vw)} borderless gapY={t.gaps.defaultGab}>
                <ElementHeader title={"Quick-actions"} icon={
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
                    <FlexBox flexDir={FlexDirection.ROW} align={Align.CENTER} width={percent(50)}>
                        <Mobile>
                            <Input fontWeight={"lighter"} minWidth={percent(100)} bgColor={t.colors.backgroundHighlightColor200} minHeightBoundary={false} height={percent(100)} placeholder={"Search action"} onChange={ev => {
                                if (!this.local.state.updating) {
                                    this.local.setStateWithChannels({
                                        updating: true,
                                        rawFilter: ev.target.value.length === 0 ? undefined : ev.target.value
                                    }, ["updating"], () => {
                                        setTimeout(() => {
                                            this.local.setStateWithChannels({
                                                updating: false
                                            }, ["updating", "updating_finished"])
                                        }, 1200)
                                    });
                                }
                            }}/>
                        </Mobile>
                        <Default>
                            <Input fontWeight={"lighter"} minWidth={px(200)} bgColor={t.colors.backgroundHighlightColor200} minHeightBoundary={false} height={percent(100)} placeholder={"Search action"} onChange={ev => {
                                if (!this.local.state.updating) {
                                    this.local.setStateWithChannels({
                                        updating: true,
                                        rawFilter: ev.target.value.length === 0 ? undefined : ev.target.value
                                    }, ["updating"], () => {
                                        setTimeout(() => {
                                            this.local.setStateWithChannels({
                                                updating: false
                                            }, ["updating", "updating_finished"])
                                        }, 1200)
                                    });
                                }
                            }}/>
                            <CustomTooltip arrow title={<Text text={"This panel shows you some quick actions. \nThese are actions, which don't require multiple steps to complete."}/>} children={
                                <span children={
                                    <Icon icon={<HelpIcon/>}/>
                                }/>
                            }/>
                        </Default>
                    </FlexBox>
                }/>

                <FlexBox overflowYBehaviour={OverflowBehaviour.SCROLL} width={percent(100)}>
                    <FlexBox width={percent(100)}>
                        <FlexBox height={percent(100)} width={percent(100)}>
                            {this.component(() => this.renderBody(), "updating_finished")}
                        </FlexBox>
                    </FlexBox>
                </FlexBox>
            </Box>
        );
    }
}
