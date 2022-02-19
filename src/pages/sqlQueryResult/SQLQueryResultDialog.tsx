import {BernieComponent} from "../../logic/BernieComponent";
import {Assembly} from "../../logic/Assembly";
import {getMeaningfulColors, Themeable} from "../../Themeable";
import {SQLCommandQueryResponsePacketData} from "../../packets/in/SQLCommandQueryResponsePacketData";
import {FlexBox} from "../../components/FlexBox";
import {FlexDirection} from "../../logic/FlexDirection";
import {ReactComponent as FirstIcon} from "../../assets/icons/ic-20/ic20-audio-prev.svg";
import {ReactComponent as PrevIcon} from "../../assets/icons/ic-20/ic20-arrow-left.svg";
import {ReactComponent as NextIcon} from "../../assets/icons/ic-20/ic20-arrow-right.svg";
import {ReactComponent as LastIcon} from "../../assets/icons/ic-20/ic20-audio-next.svg";
import {Icon} from "../../components/Icon";
import React from "react";
import {Text, TextType} from "../../components/Text";
import {PageV2} from "../../components/Page";
import {LinearProgress} from "@mui/material";
import {percent, px} from "../../logic/DimensionalMeasured";
import {ObjectVisualMeaning} from "../../logic/ObjectVisualMeaning";
import {OverflowBehaviour} from "../../logic/OverflowBehaviour";
import {Box} from "../../components/Box";
import {TableDataDisplay} from "../../components/TableDataDisplay";
import {Justify} from "../../logic/Justify";
import {Align} from "../../logic/Align";
import {CustomTooltip} from "../../components/CustomTooltip";
import {ReactComponent as MenuIcon} from "../../assets/icons/ic-20/ic20-menu.svg";
import {App} from "../../logic/App";
import {Separator} from "../../components/Separator";
import {Orientation} from "../../logic/Orientation";
import {ReactComponent as CloseIcon} from "../../assets/icons/ic-20/ic20-close.svg";
import {LiteGrid} from "../../components/LiteGrid";
import {CodeEditor} from "../../components/CodeEditor";
import {oneDark} from "@codemirror/theme-one-dark";
import {sql} from "@codemirror/lang-sql";
import {HighlightStyle, tags} from "@codemirror/highlight";
import {ProfilePicture} from "../../components/ProfilePicture";
import {Cursor} from "../../logic/style/Cursor";
import dateFormat from "dateformat";
import {ReactComponent as RepeatIcon} from "../../assets/icons/ic-16/ic16-refresh.svg";
import {If} from "../../components/If";
import {ReactComponent as SuccessIcon} from "../../assets/icons/ic-16/ic16-check.svg";
import {ReactComponent as ErrorIcon} from "../../assets/icons/ic-16/ic16-close.svg";
import {ElementHeader} from "../../components/ElementHeader";

export enum DatasetSwitchMode {
    FIRST = "first",
    PREV = "prev",
    NEXT = "next",
    LAST = "last"
}

export type SQLQueryResultDialogProps = {
    data: SQLCommandQueryResponsePacketData[],
    startingIndex: number,
    onClose?: () => void
}

export type SQLQueryResultDialogLocalState = {
    current: number
}

export class SQLQueryResultDialog extends BernieComponent<SQLQueryResultDialogProps, any, SQLQueryResultDialogLocalState> {

    constructor(props: SQLQueryResultDialogProps) {
        super(props, undefined, {
            current: props.startingIndex
        });

        this.registerResultSwitcher();
        this.registerDatasetViewer();
        this.registerTelemetryViewer();
        this.registerHeader();
    }

    private dataset(): SQLCommandQueryResponsePacketData {
        return this.props.data[this.local.state.current - 1]
    }

    private canDatasetSwitchTo(mode: DatasetSwitchMode): boolean {
        const current = this.local.state.current;
        const len = this.props.data.length;
        switch (mode) {
            case DatasetSwitchMode.FIRST:
            case DatasetSwitchMode.PREV:
                return current > 0;
            case DatasetSwitchMode.NEXT:
            case DatasetSwitchMode.LAST:
                return current < len;
        }
    }

    private onDatasetSwitch(mode: DatasetSwitchMode) {
        if (this.canDatasetSwitchTo(mode)) {
            let nextIndex: number;
            const current = this.local.state.current;
            switch (mode) {
                case DatasetSwitchMode.FIRST:
                    nextIndex = 0;
                    break;
                case DatasetSwitchMode.PREV:
                    nextIndex = current - 1;
                    break;
                case DatasetSwitchMode.NEXT:
                    nextIndex = current + 1;
                    break;
                case DatasetSwitchMode.LAST:
                    nextIndex = this.props.data.length;
                    break;
            }
            if (nextIndex !== undefined) {
                this.local.setStateWithChannels({
                    current: nextIndex
                }, ["data"]);
            }
        }
    }

    private registerHeader() {
        this.assembly.assembly("header", (theme, props) => {
            return (
                <LiteGrid columns={3}>
                    <FlexBox align={Align.START} justifyContent={Justify.CENTER} gap={theme.gaps.smallGab}>

                        <Icon icon={(
                            <CustomTooltip title={"Toggle menu"} arrow>
                                <span>
                                    <MenuIcon/>
                                </span>
                            </CustomTooltip>
                        )} onClick={() => App.app().openMenu()}/>

                    </FlexBox>
                    <FlexBox align={Align.CENTER} justifyContent={Justify.CENTER}>
                        <Text uppercase align={Align.CENTER} type={TextType.smallHeader} text={"SQL Result"}/>
                    </FlexBox>
                    <FlexBox align={Align.CENTER} justifyContent={Justify.FLEX_END} flexDir={FlexDirection.ROW}>

                        {/*<CustomTooltip title={<Text text={"Toggles debugging mode"}/>} arrow noBorder>
                            <span>
                                <RenderExecutor id={v4()} channels={["debug"]} componentDidMountRelay={bridge => this.controller.register(bridge)} componentFactory={() => (
                                    <If condition={this.local.state.debug} ifTrue={
                                        <Icon icon={<DebugIcon/>} colored visualMeaning={ObjectVisualMeaning.INFO} onClick={() => this.toggleDebugMode()}/>
                                    } ifFalse={
                                        <Icon icon={<DebugIcon/>} colored visualMeaning={ObjectVisualMeaning.UI_NO_HIGHLIGHT} onClick={() => this.toggleDebugMode()}/>
                                    }/>
                                )}/>
                            </span>
                        </CustomTooltip>*/}

                        <Separator orientation={Orientation.VERTICAL}/>

                        <CustomTooltip title={<Text text={"Close"}/>} arrow noBorder>
                            <span>
                                <Icon icon={<CloseIcon/>} visualMeaning={ObjectVisualMeaning.UI_NO_HIGHLIGHT} colored={false} onClick={() => {
                                    this.props.onClose?.();
                                }}/>
                            </span>
                        </CustomTooltip>
                    </FlexBox>
                </LiteGrid>
            );
        })
    }

    private registerDatasetViewer() {
        this.assembly.assembly("dataset-viewer", (theme, props) => {
            return (
                <Box height={percent(100)} noPadding={true} overflowYBehaviour={OverflowBehaviour.HIDDEN} overflowXBehaviour={OverflowBehaviour.HIDDEN}>
                    <TableDataDisplay data={this.props.data[this.local.state.current - 1]}/>
                </Box>
            );
        })
    }

    private registerTelemetryViewer() {
        this.assembly.assembly("telemetry", (theme, props) => {
            const data = this.dataset();
            return (
                <Box gapY={theme.gaps.smallGab}>
                    <ElementHeader
                        wrapIcon={false}
                        title={`SQL-Query`}
                        beta={false}
                        icon={
                            <If condition={data.success} ifTrue={
                                <Icon icon={<SuccessIcon/>} visualMeaning={ObjectVisualMeaning.SUCCESS} colored/>
                            } ifFalse={
                                <Icon icon={<ErrorIcon/>}  visualMeaning={ObjectVisualMeaning.ERROR} colored/>
                            }/>
                        }
                        appendix={
                            <FlexBox flexDir={FlexDirection.ROW} height={percent(100)} align={Align.CENTER} gap={theme.gaps.smallGab}>
                                <ProfilePicture name={"root"}/>
                                <Text text={"root"} cursor={Cursor.pointer} type={TextType.secondaryDescription}/>
                                <Box visualMeaning={ObjectVisualMeaning.BETA} opaque paddingY={px(0)} paddingX={px(4)}>
                                    <Text text={data.client.type.toString()} bold uppercase fontSize={px(12)}/>
                                </Box>
                                <Text text={`${dateFormat(new Date(), "HH:mm:ss")}`} whitespace={"nowrap"} type={TextType.secondaryDescription}/>
                                {/*<Separator orientation={Orientation.VERTICAL}/>
                                <Icon icon={<RepeatIcon/>}/>*/}
                            </FlexBox>
                        }
                    />
                    <CodeEditor
                        theme={oneDark}
                        classnames={["cm"]}
                        width={percent(100)}
                        upstreamHook={() => {}}
                        value={data.sql}
                        editable={false}
                        extensions={[sql(), HighlightStyle.define([
                            {tag: tags.keyword, class: "keyword"},
                            {tag: tags.local, class: "local"},
                            {tag: tags.color, class: "color"},
                            {tag: tags.comment, class: "comment"},
                            {tag: tags.function, class: "function"},
                            {tag: tags.string, class: "string"},
                            {tag: tags.content, class: "content"},
                            {tag: tags.arithmeticOperator, class: "arithmeticOperator"},
                        ])]}
                    />
                </Box>
            );
        })
    }

    // this.props.data.length / 100 * this.local.state.current
    private registerResultSwitcher() {
        this.assembly.assembly("result-switcher", (theme, props) => {
            if (this.props.data.length > 1) {
                const mc = getMeaningfulColors(ObjectVisualMeaning.BETA, theme);
                const progressVal = Math.round((this.local.state.current) / this.props.data.length * 100);
                return (
                    <FlexBox gap={theme.gaps.smallGab} width={percent(100)} justifyContent={Justify.CENTER} align={Align.CENTER}>
                        <LinearProgress sx={{
                            width: "100%",
                            height: "8px",
                            borderRadius: "9999px",
                            border: "1px solid " + theme.colors.borderPrimaryColor.css(),
                            backgroundColor: mc.lighter.withAlpha(.1).css(),
                            ['& .MuiLinearProgress-bar']: {
                                backgroundColor: mc.lighter.css(),
                                borderRight: (this.props.data.length === this.local.state.current ? "0" : "1px") + " solid " + theme.colors.borderPrimaryColor.css(),
                            }
                        }} variant="determinate" value={progressVal}/>
                        <FlexBox flexDir={FlexDirection.ROW}>
                            <Icon colored={!this.canDatasetSwitchTo(DatasetSwitchMode.FIRST)} icon={<FirstIcon/>} onClick={() => this.onDatasetSwitch(DatasetSwitchMode.FIRST)}/>
                            <Icon colored={!this.canDatasetSwitchTo(DatasetSwitchMode.PREV)} icon={<PrevIcon/>} onClick={() => this.onDatasetSwitch(DatasetSwitchMode.PREV)}/>
                            <Text text={`${this.local.state.current}/${this.props.data.length}`} type={TextType.secondaryDescription}/>
                            <Icon colored={!this.canDatasetSwitchTo(DatasetSwitchMode.NEXT)} icon={<NextIcon/>} onClick={() => this.onDatasetSwitch(DatasetSwitchMode.NEXT)}/>
                            <Icon colored={!this.canDatasetSwitchTo(DatasetSwitchMode.LAST)} icon={<LastIcon/>} onClick={() => this.onDatasetSwitch(DatasetSwitchMode.LAST)}/>
                        </FlexBox>
                    </FlexBox>
                );
            } else {
                return <></>;
            }
        });
    }

    componentRender(p: SQLQueryResultDialogProps, s: any, l: any, t: Themeable.Theme, a: Assembly): JSX.Element | undefined {
        return (
            <PageV2>
                {this.component(() => this.assembly.render({component: "header"}), "header")}
                {this.component(() => this.assembly.render({component: "dataset-viewer"}), "data")}
                {this.component(() => this.assembly.render({component: "telemetry"}), "data")}
                {this.component(() => this.assembly.render({component: "result-switcher"}), "data")}
            </PageV2>
        );
    }
}
