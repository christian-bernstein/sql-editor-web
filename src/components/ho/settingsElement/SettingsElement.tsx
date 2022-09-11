import {BernieComponent} from "../../../logic/BernieComponent";
import {percent, px} from "../../../logic/style/DimensionalMeasured";
import {Align} from "../../../logic/style/Align";
import {Box} from "../../lo/Box";
import {Flex, FlexBox} from "../../lo/FlexBox";
import {Justify} from "../../../logic/style/Justify";
import {FlexDirection} from "../../../logic/style/FlexDirection";
import {Text} from "../../lo/Text";
import {createMargin} from "../../../logic/style/Margin";
import React from "react";
import {Assembly} from "../../../logic/assembly/Assembly";
import {Themeable} from "../../../logic/style/Themeable";
import {getOr} from "../../../logic/Utils";
import {WithVisualMeaning} from "../../../logic/style/WithVisualMeaning";
import {AnomalyInfo} from "../anomalyInfo/AnomalyInfo";
import {AnomalyLevel} from "../../../logic/data/AnomalyLevel";
import {Color} from "../../../logic/style/Color";
import {Cursor} from "../../../logic/style/Cursor";
import {If} from "../../logic/If";
import {ReactComponent as SubpageIcon} from "../../../assets/icons/ic-16/ic16-chevron-right.svg";
import {Icon} from "../../lo/Icon";
import {HashLoader} from "react-spinners";
import {Button} from "../../lo/Button";
import {StaticDrawerMenu} from "../../lo/StaticDrawerMenu";
import {DrawerHeader} from "../../lo/DrawerHeader";
import {Group} from "../../lo/Group";
import {Orientation} from "../../../logic/style/Orientation";
import {Accordion, AccordionDetails, AccordionSummary} from "@mui/material";
import {OverflowBehaviour} from "../../../logic/style/OverflowBehaviour";

export type SettingsElementIconConfig = {
    enable: boolean,
    color?: Color,
    iconGenerator: (element: SettingsElement) => JSX.Element
}

export type SettingsElementProps = WithVisualMeaning & {
    groupDisplayMode?: boolean,
    title: string,
    description?: string,
    tooltipGenerator?: (element: SettingsElement) => JSX.Element,
    appendixGenerator?: (element: SettingsElement) => JSX.Element,
    subpage?: (element: SettingsElement) => JSX.Element,
    renderNotifyChannels?: Array<string>,
    iconConfig?: SettingsElementIconConfig,
    onClick?: (element: SettingsElement) => void,
    promiseBasedOnClick?: (element: SettingsElement) => Promise<any>,
    forceRenderSubpageIcon?: boolean,

    quickChildElements?: (element: SettingsElement) => Array<JSX.Element>
}

export type SettingsElementLocalState = {
    processing: boolean
}

export class SettingsElement extends BernieComponent<SettingsElementProps, any, SettingsElementLocalState> {

    constructor(props: SettingsElementProps) {
        super(props, undefined, {
            processing: false
        });
    }

    private onSelect() {
        if (!this.local.state.processing) {

            this.local.setStateWithChannels({
                processing: true
            }, ["processing"], () => {

                if (this.props.subpage !== undefined) {
                    setTimeout(() => {
                        this.dialog(
                            <StaticDrawerMenu body={props => {
                                return (
                                    <Flex width={percent(100)} height={percent(100)}>
                                        <DrawerHeader header={"Set Status"} description={"Update your status"}/>
                                        <Button text={"close"} onClick={() => this.closeLocalDialog()}/>
                                        {this.props.subpage?.(this)}
                                    </Flex>
                                );
                            }}/>
                        );

                        this.local.setStateWithChannels({
                            processing: false
                        }, ["processing"]);
                    }, 50);
                    return;
                }

                if (this.props.promiseBasedOnClick !== undefined && this.props.onClick === undefined) {
                    // Unambiguously able to call 'promiseBasedOnClick'
                    this.props.promiseBasedOnClick?.(this).catch(reason => {
                        console.error("Error caught while processing SettingsElement-onClick routine", reason);
                        this.dialog(
                            <AnomalyInfo anomaly={{
                                level: AnomalyLevel.ERROR,
                                data: reason,
                                description: `Error caught while processing SettingsElement-onClick routine\n\n**<u>Native error</u>**\n_${reason}_`
                            }}/>
                        );
                    }).finally(() => {
                        this.local.setStateWithChannels({
                            processing: false
                        }, ["processing"]);
                    });
                } else if (this.props.promiseBasedOnClick === undefined && this.props.onClick !== undefined) {
                    // Unambiguously able to call 'onClick'
                    try {
                        this.props.onClick?.(this);
                    } catch (e) {
                        console.error("Error caught while processing SettingsElement-onClick routine", e);
                        this.dialog(
                            <AnomalyInfo anomaly={{
                                level: AnomalyLevel.ERROR,
                                data: e,
                                description: `Error caught while processing SettingsElement-onClick routine\n\n**<u>Native error</u>**\n_${e}_`
                            }}/>
                        );
                    } finally {
                        this.local.setStateWithChannels({
                            processing: false
                        }, ["processing"]);
                    }
                } else {
                    // Not clear what to call, this is considered an anomaly
                    this.local.setStateWithChannels({
                        processing: false
                    }, ["processing"]);
                    this.dialog(
                        <AnomalyInfo mapDescriptionVMToAnomalyLevel anomaly={{
                            level: AnomalyLevel.WARN,
                            description: `Cannot execute SettingsElement-onClick routine, because the system is not able to call a handler unambiguously\n\nOnly one handler (_promiseBasedOnClick_ **or** _onClick_) can be set. The other one has to be _undefined_`
                        }}/>
                    );
                }
            });
        }
    }

    private rerenderAppendix() {
        this.rerender("appendix");
    }

    componentRender(p: SettingsElementProps, s: any, l: SettingsElementLocalState, t: Themeable.Theme, a: Assembly): JSX.Element | undefined {
        return (
            <FlexBox width={percent(100)} align={Align.START} gap={t.gaps.smallGab}>

                <FlexBox width={percent(100)} align={Align.START} gap={px()}>
                    <Box width={percent(100)} style={{justifyContent: "center"}} minHeight={px(40)} cursor={Cursor.pointer} onClick={() => this.onSelect()} borderRadiiConfig={{
                        enableCustomBorderRadii: getOr(p.groupDisplayMode, false),
                        fallbackCustomBorderRadii: px()
                    }} noPadding borderless bgColor={t.colors.backgroundHighlightColor200} children={
                        <FlexBox justifyContent={Justify.SPACE_BETWEEN} height={percent(100)} align={Align.CENTER} flexDir={FlexDirection.ROW}>

                            <FlexBox align={Align.CENTER} flexDir={FlexDirection.ROW} gap={t.gaps.smallGab} height={percent(100)}>
                                <If condition={p.iconConfig?.enable} ifTrue={
                                    <Box
                                        borderless
                                        noPadding
                                        bgColor={p.iconConfig?.color}
                                        overflowXBehaviour={OverflowBehaviour.HIDDEN}
                                        overflowYBehaviour={OverflowBehaviour.HIDDEN}
                                        width={px(26)}
                                        height={px(26)}
                                        style={{
                                            position: "absolute",
                                            marginLeft: t.gaps.smallGab.measurand,
                                        }}
                                        children={
                                            <Flex height={percent(100)} width={percent(100)} justifyContent={Justify.CENTER} align={Align.CENTER} children={
                                                <Icon icon={getOr(p.iconConfig?.iconGenerator?.(this), <>?</>)} size={px(20)}/>
                                            }/>
                                    }/>
                                }/>
                                <Text cursor={Cursor.pointer} text={p.title} margin={createMargin(0, 0, 0, t.gaps.smallGab.times(2).withPlus(26).measurand)}/>
                            </FlexBox>

                            <FlexBox align={Align.CENTER} flexDir={FlexDirection.ROW} gap={t.gaps.smallGab} height={percent(100)}>
                                {this.component(() => getOr(p.appendixGenerator?.(this), <></>), "appendix")}

                                {this.component(local => {
                                    return (
                                        <If condition={local.state.processing} ifTrue={
                                            <FlexBox width={px(16)} height={px(16)} margin={createMargin(0, t.gaps.smallGab.withPlus(2).measurand, 0, t.gaps.smallGab.measurand)} children={
                                                <HashLoader size={"16px"} color={t.colors.iconColor.toHex("")}/>
                                            }/>
                                        } ifFalse={(() => {
                                            if (p.subpage !== undefined || p.forceRenderSubpageIcon) {
                                                return (
                                                    <FlexBox width={px(16)} height={px(16)} margin={createMargin(0, t.gaps.smallGab.withPlus(2).measurand, 0, t.gaps.smallGab.measurand)} children={
                                                        <Icon icon={<SubpageIcon/>} size={px(16)}/>
                                                    }/>
                                                );
                                            } else {
                                                return <></>;
                                            }
                                        })()}/>
                                    );
                                }, "processing")}
                            </FlexBox>
                        </FlexBox>
                    }/>

                    <If condition={p.quickChildElements !== undefined && p.quickChildElements.length > 0 && false} ifTrue={
                        <Accordion sx={{
                            width: "100%",
                            padding: "0 !important",
                            margin: "0 !important",
                            background: t.colors.backgroundHighlightColor200.css(),
                            '& .MuiAccordionSummary-root': {
                                minHeight: "0 !important",
                                padding: "0 !important"
                            }
                        }}>
                            <AccordionSummary
                                children={
                                    <Box width={percent(100)} style={{justifyContent: "center"}} minHeight={px(40)} cursor={Cursor.pointer} onClick={() => {}} borderRadiiConfig={{
                                        enableCustomBorderRadii: getOr(p.groupDisplayMode, false),
                                        fallbackCustomBorderRadii: px()
                                    }} noPadding borderless bgColor={t.colors.backgroundHighlightColor200} children={
                                        <FlexBox justifyContent={Justify.SPACE_BETWEEN} height={percent(100)} align={Align.CENTER} flexDir={FlexDirection.ROW}>

                                            <FlexBox align={Align.CENTER} flexDir={FlexDirection.ROW} gap={t.gaps.smallGab} height={percent(100)}>
                                                <If condition={p.iconConfig?.enable} ifTrue={
                                                    <Box borderless style={{
                                                        position: "absolute",
                                                        marginLeft: t.gaps.smallGab.measurand,
                                                    }} noPadding bgColor={p.iconConfig?.color} width={px(26)} height={px(26)} children={
                                                        <Flex height={percent(100)} width={percent(100)} justifyContent={Justify.CENTER} align={Align.CENTER} children={
                                                            <Icon icon={getOr(p.iconConfig?.iconGenerator?.(this), <>?</>)} size={px(20)}/>
                                                        }/>
                                                    }/>
                                                }/>
                                                <Text cursor={Cursor.pointer} text={p.title} margin={createMargin(0, 0, 0, t.gaps.smallGab.times(2).withPlus(26).measurand)}/>
                                            </FlexBox>

                                            <FlexBox align={Align.CENTER} flexDir={FlexDirection.ROW} gap={t.gaps.smallGab} height={percent(100)}>
                                                {this.component(() => getOr(p.appendixGenerator?.(this), <></>), "appendix")}

                                                {this.component(local => {
                                                    return (
                                                        <If condition={local.state.processing} ifTrue={
                                                            <FlexBox width={px(16)} height={px(16)} margin={createMargin(0, t.gaps.smallGab.withPlus(2).measurand, 0, t.gaps.smallGab.measurand)} children={
                                                                <HashLoader size={"16px"} color={t.colors.iconColor.toHex("")}/>
                                                            }/>
                                                        } ifFalse={(() => {
                                                            if (p.subpage !== undefined || p.forceRenderSubpageIcon) {
                                                                return (
                                                                    <FlexBox width={px(16)} height={px(16)} margin={createMargin(0, t.gaps.smallGab.withPlus(2).measurand, 0, t.gaps.smallGab.measurand)} children={
                                                                        <Icon icon={<SubpageIcon/>} size={px(16)}/>
                                                                    }/>
                                                                );
                                                            } else {
                                                                return <></>;
                                                            }
                                                        })()}/>
                                                    );
                                                }, "processing")}
                                            </FlexBox>
                                        </FlexBox>
                                    }/>
                                }
                                aria-controls="panel1a-content"
                                id="panel1a-header"
                                sx={{
                                    '.MuiAccordionSummary-content': {
                                        margin: "0 !important",
                                    }
                                }}
                            />
                            <AccordionDetails sx={{
                                padding: "0 !important",
                            }}>
                                <FlexBox width={percent(100)} style={{paddingLeft: t.gaps.smallGab.times(2).withPlus(26).css()}}>
                                    <Group elements={getOr((p.quickChildElements?.(this)), [])} removeChildBorders width={percent(100)} orientation={Orientation.VERTICAL}/>
                                </FlexBox>
                            </AccordionDetails>
                        </Accordion>
                    }/>
                </FlexBox>






                {/*<Text text={"If checked, the canonical title of every quick action will be shown below it's icon"} align={Align.START} type={TextType.secondaryDescription} fontSize={px(11)}/>*/}
            </FlexBox>
        );
    }

}
