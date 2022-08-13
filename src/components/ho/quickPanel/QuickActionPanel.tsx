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
import {ObjectVisualMeaning, VM} from "../../../logic/style/ObjectVisualMeaning";
import {Button} from "../../lo/Button";
import {ReactComponent as QuickIcon} from "../../../assets/icons/ic-20/ic20-bolt.svg";
import {ReactComponent as HelpIcon} from "../../../assets/icons/ic-20/ic20-help.svg";
import {ReactComponent as RunIcon} from "../../../assets/icons/ic-20/ic20-play.svg";
import {ReactComponent as FilterIcon} from "../../../assets/icons/ic-20/ic20-filter.svg";
import {ReactComponent as SettingsIcon} from "../../../assets/icons/ic-20/ic20-settings.svg";
import {DimensionalMeasured, percent, px} from "../../../logic/style/DimensionalMeasured";
import {Text, TextType} from "../../lo/Text";
import {Separator} from "../../lo/Separator";
import {QuickActionConfig} from "../../../logic/data/quick/QuickActionConfig";
import {App, utilizeGlobalTheme} from "../../../logic/app/App";
import {If} from "../../logic/If";
import {Input} from "../../lo/Input";
import {FlexDirection} from "../../../logic/style/FlexDirection";
import {Align} from "../../../logic/style/Align";
import {CircularProgress, styled, Switch} from "@mui/material";
import {Justify} from "../../../logic/style/Justify";
import {Orientation} from "../../../logic/style/Orientation";
import {OverflowBehaviour} from "../../../logic/style/OverflowBehaviour";
import {Dimension} from "../../../logic/style/Dimension";
import {QuickActionCategory} from "../../../logic/data/quick/QuickActionCategory";
import {Centered} from "../../lo/PosInCenter";
import {Default, Mobile} from "../../logic/Media";
import {Cursor} from "../../../logic/style/Cursor";
import {AF} from "../../logic/ArrayFragment";
import {SideScroller} from "../../layout/SideScroller";
import {createMargin} from "../../../logic/style/Margin";
import {FormDataHub} from "../../../tests/epicure/components/FormDataHub";
import {StaticDrawerMenu} from "../../lo/StaticDrawerMenu";
import {Badge} from "../../lo/Badge";
import _ from "lodash";
import {IOSwitch} from "../../lo/IOSwitch";

export type QuickActionPanelProps = {
    noPadding?: boolean
}

export type QuickActionPanelLocalState = {
    updating: boolean,
    rawFilter?: string,
    fdh: FormDataHub,
    filterChangeHandler: (filter: string) => void,
}

export class QuickActionPanel extends BernieComponent<QuickActionPanelProps, any, QuickActionPanelLocalState> {

    constructor(props: QuickActionPanelProps) {
        super(props, undefined, {
            updating: false,
            fdh: new FormDataHub("quick-action-panel").loadFromLocalStore(),
            filterChangeHandler: _.debounce((filter: string) => {
                this.local.setStateWithChannels({
                    rawFilter: filter
                }, ["updating", "updating_finished"])
            }, 500, {
                trailing: true
            })
        }, {
            enableLocalDialog: true
        });
    }

    init() {
        super.init();
        this.preferencesAssembly();
        this.headerAssembly();
        this.toolbarAssembly();
        this.bodyAssembly();
        if (this.local.state.fdh.get("show-experimental-actions") === undefined) {
            this.local.state.fdh.set("show-experimental-actions", false, true);
        }
    }

    private static handleQAClick(event: React.MouseEvent<HTMLSpanElement, MouseEvent>, qa: QuickActionConfig, panel: QuickActionPanel) {
        qa.onClick?.(event, qa, panel);
    }

    private applyLocalFilter(qac: QuickActionCategory, actions: QuickActionConfig[]): QuickActionConfig[] {
        const filter = this.local.state.rawFilter;

        // Apply experimental scope filter
        const showExperimentalActions = this.local.state.fdh.get("show-experimental-actions", false);
        if (!showExperimentalActions) {
            actions = actions.filter(qac => !qac.beta);
        }

        // Apply local filter from search input
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
                        const showCanonicalNames: boolean = this.local.state.fdh.get("show-canonical-names", true);

                        const renderBase = (config: QuickActionConfig) => {
                            const allowedAction: boolean = config.isAllowedAction === undefined ? true : config.isAllowedAction();

                            return (
                                <span style={{width: "100%", height: "100%"}} onClick={event => QuickActionPanel.handleQAClick(event, config, this)} children={
                                    <If condition={getOr(config.wrapInDefaultButton, true)} ifTrue={
                                        <Button cursor={allowedAction ? Cursor.pointer : Cursor.notAllowed} height={percent(100)} padding={theme.paddings.defaultObjectPadding} shrinkOnClick opaque={getOr(config.opaque, config.beta)} visualMeaning={config.visualMeaning ? config.visualMeaning : (config.beta ? ObjectVisualMeaning.BETA : ObjectVisualMeaning.UI_NO_HIGHLIGHT)} children={
                                            <FlexBox align={Align.CENTER} gap={theme.gaps.smallGab} width={percent(100)} height={percent(100)} children={
                                                <AF elements={[
                                                    config.render(t, this, config),
                                                    <If condition={showCanonicalNames} ifTrue={
                                                        <FlexBox width={percent(100)} align={Align.CENTER} overflowXBehaviour={OverflowBehaviour.SCROLL} children={
                                                            <Text whitespace={"nowrap"} text={getOr(config.canonicalDisplayName, config.displayName)} type={TextType.secondaryDescription} fontSize={px(11)}/>
                                                        }/>
                                                    }/>
                                                ]}/>
                                            }/>
                                        }/>
                                    } ifFalse={
                                        config.render(t, this, config)
                                    }/>
                                }/>
                            );
                        }

                        const grid = (
                            <LiteGrid gap={t.gaps.smallGab} style={{width: "100%"}} columns={8}>
                                {actions.map(config => {
                                    if (config.renderHover !== undefined) {
                                        return (
                                            <CustomTooltip enterDelay={700} wrapperStyle={config.wrapperStyleOverwrite} arrow title={config.renderHover(t, this)} children={renderBase(config)}/>
                                        );
                                    } else {
                                        return (
                                            <CustomTooltip enterDelay={700} wrapperStyle={config.wrapperStyleOverwrite} arrow noPadding noBorder title={
                                                <Box width={percent(100)} overflowXBehaviour={OverflowBehaviour.SCROLL} gapY={theme.gaps.defaultGab}>
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
                        );

                        return (
                            <>
                                <ElementHeader title={qac.config.displayName} appendix={
                                    <FlexBox flexDir={FlexDirection.ROW} align={Align.CENTER} width={percent(100)}>
                                        <Separator orientation={Orientation.HORIZONTAL}/>
                                        <Text text={`${actions.length}`} uppercase type={TextType.smallHeader} coloredText fontSize={px(10)}/>
                                    </FlexBox>
                                }/>

                                <Default children={
                                    <SideScroller useMouseDragging children={grid}/>
                                }/>

                                <Mobile children={
                                    <FlexBox width={percent(100)} style={{overflowY: "scroll", overflowX: "visible"}}>
                                        {grid}
                                    </FlexBox>
                                }/>
                            </>
                        );
                    })
                }</>
            );
        } else {
            return (
                <Centered>
                    <FlexBox margin={createMargin(40, 0, 40, 0)} width={percent(100)} align={Align.CENTER} flexDir={FlexDirection.COLUMN}>
                        <Icon icon={<FilterIcon/>} size={px(30)}/>
                        <Text text={"No quick action was found"} align={Align.CENTER} type={TextType.secondaryDescription}/>
                    </FlexBox>
                </Centered>
            );
        }
    }

    private preferencesAssembly() {
        this.assembly.assembly("preferences", theme => (
            <StaticDrawerMenu align={Align.CENTER} body={props => {
                const showCanonicalNames: boolean = this.local.state.fdh.get("show-canonical-names", true);

                return (
                    <FlexBox align={Align.CENTER} width={percent(100)}>
                        {Badge.badge("Development", {
                            visualMeaning: VM.SUCCESS
                        })}

                        <FlexBox width={percent(100)} align={Align.CENTER} gap={theme.gaps.smallGab}>
                            <Text text={"Quick-actions preferences"} type={TextType.smallHeader}/>
                            <Text text={"Configure the quick-action panel as you like"} type={TextType.secondaryDescription} fontSize={px(11)} margin={createMargin(0, 0, 40, 0)}/>
                        </FlexBox>

                        <FlexBox width={percent(100)} align={Align.START} gap={theme.gaps.smallGab}>
                            <Box width={percent(100)} noPadding borderless bgColor={theme.colors.backgroundHighlightColor200} children={
                                <FlexBox justifyContent={Justify.SPACE_BETWEEN} align={Align.CENTER} flexDir={FlexDirection.ROW}>
                                    <Text text={"Show action titles"} margin={createMargin(0, 0, 0, theme.gaps.smallGab.measurand)}/>
                                    <IOSwitch defaultChecked={showCanonicalNames} onChange={(event, checked) => {
                                        this.local.state.fdh.set("show-canonical-names", checked, true);
                                        setTimeout(() => this.rerender("*"), 100);
                                    }}/>
                                </FlexBox>
                            }/>
                            <Text text={"If checked, the canonical title of every quick action will be shown below it's icon"} align={Align.START} type={TextType.secondaryDescription} fontSize={px(11)}/>
                        </FlexBox>


                        <FlexBox width={percent(100)} align={Align.START} gap={theme.gaps.smallGab}>
                            <Box width={percent(100)} noPadding borderless bgColor={theme.colors.backgroundHighlightColor200} children={
                                <FlexBox justifyContent={Justify.SPACE_BETWEEN} align={Align.CENTER} flexDir={FlexDirection.ROW}>
                                    <Text text={"Show experimental actions"} margin={createMargin(0, 0, 0, theme.gaps.smallGab.measurand)}/>
                                    <IOSwitch defaultChecked={showCanonicalNames} onChange={(event, checked) => {
                                        this.local.state.fdh.set("show-experimental-actions", checked, true);
                                        setTimeout(() => this.rerender("*"), 100);
                                    }}/>
                                </FlexBox>
                            }/>
                            <Text text={"If checked, experimental actions are shown. **Warning: Experimental actions can cause damage to the website's local data. Experimental actions might not be tested.**"} align={Align.START} type={TextType.secondaryDescription} fontSize={px(11)}/>
                        </FlexBox>
                    </FlexBox>
                );
            }}/>
        ));
    }

    private headerAssembly() {
        this.assembly.assembly("header", theme => (
            <>
                {/*
                <FlexBox width={percent(100)} align={Align.CENTER} margin={createMargin(0, 0, 40, 0)} children={
                <AF elements={[
                    Badge.badge("Development", {
                        visualMeaning: VM.SUCCESS
                    }),
                    <FlexBox width={percent(100)} align={Align.CENTER} gap={theme.gaps.smallGab}>
                        <Text text={"Quick-actions panel"} type={TextType.smallHeader}/>
                        <Text text={"Quick actions panel. Execute quick actions with one click."} type={TextType.secondaryDescription} fontSize={px(11)}/>
                    </FlexBox>
                ]}/>
            }/>
                */}
            </>
        ));
    }

    private toolbarAssembly() {
        this.assembly.assembly("toolbar", t => (
            <AF elements={[
                // Mobile layout. Two rows
                <Mobile children={
                    <FlexBox margin={createMargin(0, 0, 20, 0)} width={percent(100)}>
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
                            <FlexBox align={Align.CENTER} flexDir={FlexDirection.ROW}>
                                {
                                    this.component(local => (
                                        <If condition={local.state.rawFilter !== undefined && local.state.rawFilter.trim().length > 0}  ifTrue={
                                            <Text highlight text={"Clear filter"} coloredText bold visualMeaning={VM.WARNING} cursor={Cursor.pointer} onClick={() => {
                                                this.local.setStateWithChannels({
                                                    updating: false,
                                                    rawFilter: undefined
                                                }, ["updating", "updating_finished"]);
                                            }}/>
                                        }/>
                                    ), "updating")
                                }

                                <CustomTooltip arrow title={<Text text={"Preferences"}/>} children={
                                    <span children={
                                        <Icon icon={<SettingsIcon/>} onClick={() => {
                                            this.dialog(this.a("preferences"));
                                        }}/>
                                    }/>
                                }/>
                            </FlexBox>
                        }/>

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

                        {/*
                        <Input fontWeight={"lighter"} minWidth={px(200)} bgColor={t.colors.backgroundHighlightColor200} minHeightBoundary={false} height={percent(100)} placeholder={"Search action"} onChange={ev => {
                            this.local.state.filterChangeHandler(ev.target.value);
                        }}/>
                        */}
                    </FlexBox>
                }/>,

                // Desktop layout. One row
                <Default children={
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

                            <CustomTooltip arrow title={<Text text={"Preferences"}/>} children={
                                <span children={
                                    <Icon icon={<SettingsIcon/>} onClick={() => {
                                        this.dialog(this.a("preferences"));
                                    }}/>
                                }/>
                            }/>
                        </FlexBox>
                    }/>
                }/>
            ]}/>
        ));
    }

    private bodyAssembly() {
        this.assembly.assembly("body", theme => (
            <FlexBox height={percent(100)} width={percent(100)} overflowXBehaviour={OverflowBehaviour.SCROLL} children={
                this.component(() => this.renderBody(), "updating_finished")
            }/>
        ));
    }

    componentRender(p: QuickActionPanelProps, s: any, l: QuickActionPanelLocalState, t: Themeable.Theme, a: Assembly): JSX.Element | undefined {
        return this.component(local => (
            <Box noPadding={getOr(p.noPadding, false)} width={percent(100)} maxHeight={DimensionalMeasured.of(100, Dimension.vw)} borderless gapY={t.gaps.defaultGab} children={
                <AF elements={[
                    this.a("header"),
                    this.a("toolbar"),
                    this.a("body")
                ]}/>
            }/>
        ), "*");
    }
}
