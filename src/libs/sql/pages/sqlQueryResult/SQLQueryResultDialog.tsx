import {BernieComponent} from "../../../../logic/BernieComponent";
import {Assembly} from "../../../../logic/assembly/Assembly";
import {getMeaningfulColors, Themeable} from "../../../../logic/style/Themeable";
import {SQLCommandQueryResponsePacketData} from "../../packets/in/SQLCommandQueryResponsePacketData";
import {FlexBox} from "../../../../components/lo/FlexBox";
import {FlexDirection} from "../../../../logic/style/FlexDirection";
import {ReactComponent as FirstIcon} from "../../../../assets/icons/ic-20/ic20-audio-prev.svg";
import {ReactComponent as PrevIcon} from "../../../../assets/icons/ic-20/ic20-arrow-left.svg";
import {ReactComponent as NextIcon} from "../../../../assets/icons/ic-20/ic20-arrow-right.svg";
import {ReactComponent as LastIcon} from "../../../../assets/icons/ic-20/ic20-audio-next.svg";
import {ReactComponent as DeleteIcon} from "../../../../assets/icons/ic-16/ic16-delete.svg";
import {Icon} from "../../../../components/lo/Icon";
import React from "react";
import {Text, TextType} from "../../../../components/lo/Text";
import {Screen} from "../../../../components/lo/Page";
import {LinearProgress, Pagination} from "@mui/material";
import {percent, px} from "../../../../logic/style/DimensionalMeasured";
import {ObjectVisualMeaning} from "../../../../logic/style/ObjectVisualMeaning";
import {OverflowBehaviour} from "../../../../logic/style/OverflowBehaviour";
import {Box} from "../../../../components/lo/Box";
import {TableDataDisplay} from "../../../../components/ho/tableDataDisplay/TableDataDisplay";
import {Justify} from "../../../../logic/style/Justify";
import {Align} from "../../../../logic/style/Align";
import {CustomTooltip} from "../../../../components/lo/CustomTooltip";
import {ReactComponent as MenuIcon} from "../../../../assets/icons/ic-20/ic20-menu.svg";
import {App} from "../../../../logic/app/App";
import {Separator} from "../../../../components/lo/Separator";
import {Orientation} from "../../../../logic/style/Orientation";
import {ReactComponent as CloseIcon} from "../../../../assets/icons/ic-20/ic20-close.svg";
import {ReactComponent as OptionsIcon} from "../../../../assets/icons/ic-20/ic20-more-ver.svg";
import {LiteGrid} from "../../../../components/lo/LiteGrid";
import {CodeEditor} from "../../../../components/lo/CodeEditor";
import {oneDark} from "@codemirror/theme-one-dark";
import {sql} from "@codemirror/lang-sql";
import {HighlightStyle, tags} from "@codemirror/highlight";
import {If} from "../../../../components/logic/If";
import {ReactComponent as SuccessIcon} from "../../../../assets/icons/ic-16/ic16-check.svg";
import {ReactComponent as ErrorIcon} from "../../../../assets/icons/ic-16/ic16-close.svg";
import {ElementHeader} from "../../../../components/lo/ElementHeader";
import {ContextCompound} from "../../../../components/ho/contextCompound/ContextCompound";
import {SQLResultDisplay} from "../../../../components/ho/dbErrorDisplay/SQLResultDisplay";
import {EditorCommandError} from "../editor/EditorCommandError";
import {ContextMenuElement} from "../../../../components/lo/ContextMenuElement";
import {ClientDisplay} from "../../../../components/ho/clientDisplay/ClientDisplay";

export enum DatasetSwitchMode {
    FIRST = "first",
    PREV = "prev",
    NEXT = "next",
    LAST = "last"
}

export type SQLQueryResultDialogProps = {
    data: SQLCommandQueryResponsePacketData[],
    deleteCurrentSelectionBridge?: (data: SQLCommandQueryResponsePacketData[]) => void,
    startingIndex: number,
    onClose?: () => void
}

export type SQLQueryResultDialogLocalState = {
    localData: SQLCommandQueryResponsePacketData[],
    current: number
}

export class SQLQueryResultDialog extends BernieComponent<SQLQueryResultDialogProps, any, SQLQueryResultDialogLocalState> {

    constructor(props: SQLQueryResultDialogProps) {
        super(props, undefined, {
            localData: props.data,
            current: props.startingIndex
        });

        this.registerResultSwitcher();
        this.resultSwitcherV2Assembly();
        this.registerDatasetViewer();
        this.registerTelemetryViewer();
        this.registerHeader();
        this.registerContextMenu();
    }

    private dataset(): SQLCommandQueryResponsePacketData {
        // return this.props.data[this.local.state.current - 1];
        return this.local.state.localData[this.local.state.current];
    }

    private canDatasetSwitchTo(mode: DatasetSwitchMode): boolean {
        const current = this.local.state.current;
        const len = this.local.state.localData.length;
        switch (mode) {
            case DatasetSwitchMode.FIRST:
            case DatasetSwitchMode.PREV:
                return current > 0;
            case DatasetSwitchMode.NEXT:
            case DatasetSwitchMode.LAST:
                return current + 1 < len;
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
                    nextIndex = this.props.data.length - 1;
                    break;
            }
            if (nextIndex !== undefined) {
                this.switchPage(nextIndex);
            }
        }
    }

    private switchPage(page: number) {
        this.local.setStateWithChannels({
            current: page
        }, ["data"]);
    }

    private removeLocalResults(data: SQLCommandQueryResponsePacketData[]) {
        data.forEach(elem => {
            const cache = this.local.state.localData;
            const index = cache.indexOf(elem, 0);
            if (index > -1) {
                cache.splice(index, 1);
            }
        });
    }

    private tryToMovePointerToNextSavePosition(): boolean {
        const ls = this.local.state;
        if (ls.localData.length === 0) {
            return false;
        } else if (ls.current > ls.localData.length - 1) {
            ls.current = ls.localData.length - 1;
            return true;
        } else {
            return true;
        }
    }

    private registerContextMenu() {
        this.assembly.assembly("ctx-menu", (theme, props) => {
            return (
                <FlexBox gap={px(1)}>

                    <ContextMenuElement title={"Delete current result"} icon={() => <Icon icon={<DeleteIcon/>} size={px(16)}/>} onClick={() => {
                        this.props.deleteCurrentSelectionBridge?.([this.dataset()]);
                        if (this.tryToMovePointerToNextSavePosition()) {
                            this.controller.rerender("data");
                        } else {
                            this.props.onClose?.();
                        }
                    }}/>

                    <ContextMenuElement title={"Clear results"} icon={() => <Icon icon={<DeleteIcon/>} size={px(16)}/>} onClick={() => {
                        this.props.deleteCurrentSelectionBridge?.(this.props.data);
                        this.props.onClose?.();
                    }}/>
                </FlexBox>
            );
        });
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
                    <FlexBox align={Align.CENTER} gap={theme.gaps.smallGab} justifyContent={Justify.FLEX_END} flexDir={FlexDirection.ROW}>

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

                        <ContextCompound menu={this.assembly.render({component: "ctx-menu"})} children={
                            <CustomTooltip title={<Text text={"Show options…"}/>} arrow noBorder>
                                <span>
                                    <Icon icon={<OptionsIcon/>} visualMeaning={ObjectVisualMeaning.UI_NO_HIGHLIGHT} colored={false}/>
                                </span>
                            </CustomTooltip>
                        }/>

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
        });
    }

    private registerLoadingScreen() {
        this.assembly.assembly("loading-screen", theme => {
            return (
                <>Test 123</>
            );
        })
    }

    private registerDatasetViewer() {
        this.assembly.assembly("dataset-viewer", (theme, props) => {
            const dataset = this.dataset();
            if (dataset.error !== null) {
                return (
                    <SQLResultDisplay height={percent(100)} error={dataset.error as EditorCommandError} deleteIcon={false}/>
                );
            } else {
                return (
                    <Box height={percent(100)} noPadding={true} overflowYBehaviour={OverflowBehaviour.HIDDEN} overflowXBehaviour={OverflowBehaviour.HIDDEN}>
                        <TableDataDisplay data={dataset}/>
                    </Box>
                );
            }
        });
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
                                {/*<ProfilePicture name={"root"}/>*/}
                                {/*<Text text={"root"} cursor={Cursor.pointer} type={TextType.secondaryDescription}/>*/}
                                {/*<Box visualMeaning={ObjectVisualMeaning.BETA} opaque paddingY={px(0)} paddingX={px(4)}>
                                    <Text text={data.client.type.toString()} bold uppercase fontSize={px(12)}/>
                            </Box>*/}
                                <ClientDisplay clientID={data.client.id} enableClientBadge={false}/>
                                {/*<Text text={`${dateFormat(data.timestamp, "HH:mm:ss")}`} whitespace={"nowrap"} type={TextType.secondaryDescription}/>*/}
                                <Text text={`${data.timestamp}`} whitespace={"nowrap"} type={TextType.secondaryDescription} fontSize={px(12)}/>
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
        });
    }

    // this.props.data.length / 100 * this.local.state.current
    private registerResultSwitcher() {
        this.assembly.assembly("result-switcher", (theme, props) => {
            if (this.props.data.length > 1) {
                const mc = getMeaningfulColors(ObjectVisualMeaning.BETA, theme);
                const progressVal = Math.round((this.local.state.current + 1) / this.props.data.length * 100);
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
                                borderRight: (this.props.data.length === this.local.state.current + 1 ? "0" : "1px") + " solid " + theme.colors.borderPrimaryColor.css(),
                            }
                        }} variant="determinate" value={progressVal}/>
                        <FlexBox flexDir={FlexDirection.ROW}>
                            <Icon colored={!this.canDatasetSwitchTo(DatasetSwitchMode.FIRST)} icon={<FirstIcon/>} onClick={() => this.onDatasetSwitch(DatasetSwitchMode.FIRST)}/>
                            <Icon colored={!this.canDatasetSwitchTo(DatasetSwitchMode.PREV)} icon={<PrevIcon/>} onClick={() => this.onDatasetSwitch(DatasetSwitchMode.PREV)}/>
                            <Text text={`${this.local.state.current + 1}/${this.props.data.length}`} type={TextType.secondaryDescription}/>
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

    private resultSwitcherV2Assembly() {
        this.assembly.assembly("result-switcher-v2", (theme, props) => {
            return (
                <FlexBox width={percent(100)} align={Align.CENTER} justifyContent={Justify.CENTER} children={
                    <Pagination count={this.local.state.localData.length} page={this.local.state.current + 1} variant="outlined" shape="rounded" style={{
                        fontFamily: "OperatorMono"
                    }} color={"primary"} onChange={(event, page) => {
                        this.switchPage(page - 1);
                    }}/>
                }/>
            );
        })
    }

    componentRender(p: SQLQueryResultDialogProps, s: any, l: SQLQueryResultDialogLocalState, t: Themeable.Theme, a: Assembly): JSX.Element | undefined {
        return (
            <Screen>
                {this.component(() => this.assembly.render({component: "header"}), "header")}
                {this.component(() => this.assembly.render({component: "dataset-viewer"}), "data")}
                {this.component(() => this.assembly.render({component: "telemetry"}), "data")}
                {this.component(() => this.assembly.render({component: "result-switcher"}), "data")}
                {this.component(() => this.assembly.render({component: "result-switcher-v2"}), "data")}
            </Screen>
        );
    }
}
