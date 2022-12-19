import {BernieComponent} from "../../logic/BernieComponent";
import {Themeable} from "../../logic/style/Themeable";
import {Screen} from "../../components/lo/Page";
import {AppHeader} from "../../components/lo/AppHeader";
import React, {CSSProperties} from "react";
import {ReactComponent as CloseIcon} from "../../../../assets/icons/ic-20/ic20-close.svg";
import {ReactComponent as ReloadIcon} from "../../../../assets/icons/ic-20/ic20-refresh.svg";
import {ReactComponent as DeleteIcon} from "../../../../assets/icons/ic-20/ic20-delete.svg";
import {ReactComponent as PacketIcon} from "../../../../assets/icons/ic-20/ic20-archive.svg";
import {ReactComponent as TextIcon} from "../../../../assets/icons/ic-20/ic20-text-fields.svg";
import {ReactComponent as ColorToggleIcon} from "../../../../assets/icons/ic-20/ic20-brightness-medium.svg";
import {App} from "../../logic/app/App";
import {Icon} from "../../components/lo/Icon";
import {Box} from "../../components/lo/Box";
import {ObjectVisualMeaning} from "../../logic/style/ObjectVisualMeaning";
import {Text, TextType} from "../../components/lo/Text";
import {FlexBox} from "../../components/lo/FlexBox";
import {FlexDirection} from "../../logic/style/FlexDirection";
import {getOr} from "../../logic/Utils";
import ReactJson from "react-json-view";
import dateFormat from "dateformat";
import {Separator} from "../../components/lo/Separator";
import {Orientation} from "../../logic/style/Orientation";
import {Align} from "../../logic/style/Align";
import {percent, px} from "../../logic/style/DimensionalMeasured";
import {OverflowBehaviour} from "../../logic/style/OverflowBehaviour";
import {LogEntry} from "../../logic/data/LogEntry";
import {Centered} from "../../components/lo/PosInCenter";
import {Assembly} from "../../logic/assembly/Assembly";
import {Environment} from "../../logic/Environment";
import {LogEntryAppendix} from "../../logic/data/LogEntryAppendix";
import {InformationBox} from "../../components/ho/informationBox/InformationBox";
import {ObjectJSONDisplay} from "../../components/ho/objectJSONDisplay/ObjectJSONDisplay";
import {LiteGrid} from "../../components/lo/LiteGrid";
import {Cursor} from "../../logic/style/Cursor";
import {Togglable} from "../../components/logic/Togglable";
import {v4} from "uuid";
import {FilterProps} from "./FilterProps";
import {If} from "../../components/logic/If";
import ReactDataGrid from "@inovua/reactdatagrid-community";
import {CustomTooltip} from "../../components/lo/CustomTooltip";
import {ElementHeader} from "../../components/lo/ElementHeader";
import DateFilter from "@inovua/reactdatagrid-community/DateFilter";
import {Justify} from "../../logic/style/Justify";
import {CopyIcon} from "../../components/ho/copyIcon/CopyIcon";
import {LogPageDisplayVersion} from "./LogPageDisplayVersion";
import {LogBodyRenderer} from "./LogBodyRenderer";

export type LogPageProps = {
    version: LogPageDisplayVersion,
    enableClipboard: boolean
}

export type LogPageLocalState = {
    filters: Map<"all" | "trc" | "deb" | "inf" | "wrn" | "err", boolean>,
    quantities: Map<"all" | "trc" | "deb" | "inf" | "wrn" | "err", number>,
    logInterceptorID: string,
    live: boolean,
    filterMultiColorMode: boolean
}

// noinspection ALL
export class LogPage extends BernieComponent<LogPageProps, any, LogPageLocalState> {

    private static readonly levelMapper: Map<string, "trc" | "deb" | "inf" | "wrn" | "err"> = new Map<string, "trc" | "deb" | "inf" | "wrn" | "err">([
        ["TRACE", "trc"],
        ["DEBUG", "deb"],
        ["INFO", "inf"],
        ["LOG", "inf"],
        ["WARN", "wrn"],
        ["ERROR", "err"],
        ["SEVERE", "err"],
    ]);

    private readonly asmMap: Map<string, string> = new Map<string, string>([
        ["string", "string-appendix-asm"],
        ["object", "object-appendix-asm"],
        ["packet", "packet-appendix-asm"],
        ["any", "any-appendix-asm"],
    ])

    private static readonly versionMap: Map<LogPageDisplayVersion, LogBodyRenderer> = new Map<LogPageDisplayVersion, LogBodyRenderer>([
        [LogPageDisplayVersion.V1, {
            render(instance: LogPage, history: Array<LogEntry>, t: Themeable.Theme): JSX.Element {
                return instance.renderLogBodyV1(history, t);
            }
        }],
        [LogPageDisplayVersion.V2, {
            render(instance: LogPage, history: Array<LogEntry>, t: Themeable.Theme): JSX.Element {
                return instance.renderLogBodyV2(history, t);
            }
        }]
    ]);

    constructor(props: LogPageProps) {
        super(props, undefined, {
            filters: new Map<"all" | "trc" | "deb" | "inf" | "wrn" | "err", boolean>([
                ["all", true],
                ["trc", false],
                ["deb", false],
                ["inf", false],
                ["wrn", false],
                ["err", false]
            ]),
            quantities: new Map<"all" | "trc" | "deb" | "inf" | "wrn" | "err", number>([
                ["all", 0],
                ["trc", 0],
                ["deb", 0],
                ["inf", 0],
                ["wrn", 0],
                ["err", 0]
            ]),
            logInterceptorID: v4(),
            live: false,
            filterMultiColorMode: false
        });

        this.assembly.assembly("string-appendix-asm", (theme, props) => {
            const c: string = String(props);
            return (
                <Text text={c} type={TextType.secondaryDescription}/>
            );
        });

        this.assembly.assembly("object-appendix-asm", (theme, props) => {
            const c: object = props;
            return (
                <ReactJson
                    src={c}
                    displayDataTypes={false}
                    displayObjectSize={false}
                    collapsed={true}
                    onEdit={edit => {}}
                    enableClipboard={getOr(this.props.enableClipboard, false)}
                    theme={theme.libraries.reactJson.theme}
                    iconStyle={"square"}
                    style={{
                        whiteSpace: "nowrap",
                        width: "100%",
                        backgroundColor: "transparent"
                    }}
                />
            );
        });

        this.assembly.assembly("packet-appendix-asm", (theme, props) => {
            const c: Environment.Packet = props;
            return (
                <FlexBox width={percent(100)} gap={theme.gaps.smallGab}>
                    <Text leftAppendix={
                        <Icon icon={<PacketIcon/>} size={px(16)}/>
                    } enableLeftAppendix text={"**Packet**"}/>
                    <Separator/>
                    <FlexBox width={percent(100)} overflowXBehaviour={OverflowBehaviour.SCROLL} gap={percent()}>
                        <Text whitespace={"nowrap"} text={`**Type:** ${c.type}`} type={TextType.secondaryDescription}/>
                        <Text whitespace={"nowrap"} text={`**Packet-ID:** ${c.packetID}`} type={TextType.secondaryDescription}/>
                        <Text whitespace={"nowrap"} text={`**ID:** ${c.id}`} type={TextType.secondaryDescription}/>
                        <Text whitespace={"nowrap"} text={`**Protocol:** ${c.protocol}`} type={TextType.secondaryDescription}/>
                        <Text whitespace={"nowrap"} text={`**Timestamp:** ${String(c.timestamp)}`} type={TextType.secondaryDescription}/>
                    </FlexBox>
                    <ObjectJSONDisplay
                        object={c.data}
                        pure={false}
                        showControls={true}
                        title={`**Payload** *(${new Blob([c.data]).size} bytes)*`}/>
                </FlexBox>
            );

            // return (
            //     <Box width={percent(100)} gapY={theme.gaps.smallGab} style={{background: theme.colors.backgroundHighlightColor200.css()}}>
            //         <Text leftAppendix={
            //             <Icon icon={<PacketIcon/>} size={px(16)}/>
            //         } enableLeftAppendix text={"**Packet**"}/>
            //         <Separator/>
            //         <FlexBox width={percent(100)} overflowXBehaviour={OverflowBehaviour.SCROLL} gap={percent()}>
            //             <Text whitespace={"nowrap"} text={`**Type:** ${c.type}`} type={TextType.secondaryDescription}/>
            //             <Text whitespace={"nowrap"} text={`**Packet-ID:** ${c.packetID}`} type={TextType.secondaryDescription}/>
            //             <Text whitespace={"nowrap"} text={`**ID:** ${c.id}`} type={TextType.secondaryDescription}/>
            //             <Text whitespace={"nowrap"} text={`**Protocol:** ${c.protocol}`} type={TextType.secondaryDescription}/>
            //             <Text whitespace={"nowrap"} text={`**Timestamp:** ${String(c.timestamp)}`} type={TextType.secondaryDescription}/>
            //         </FlexBox>
            //         <ObjectJSONDisplay
            //             object={c.data}
            //             pure={false}
            //             showControls={true}
            //             title={`**Payload** *(${new Blob([c.data]).size} bytes)*`}/>
            //     </Box>
            // );
        });

        this.assembly.assembly("any-appendix-asm", (theme, props) => {
            try {
                return (
                    <ReactJson
                        src={
                            (typeof props === 'object' && !Array.isArray(props) && props !== null) ? ({
                                ...props
                            }) : ({
                                data: props
                            })
                        }
                        displayDataTypes={false}
                        displayObjectSize={false}
                        collapsed={true}
                        onEdit={edit => {}}
                        enableClipboard={getOr(this.props.enableClipboard, false)}
                        theme={theme.libraries.reactJson.theme}
                        iconStyle={"square"}
                        style={{
                            whiteSpace: "nowrap",
                            width: "100%",
                            backgroundColor: "transparent"
                        }}
                    />
                );
            } catch (e) {
                return (
                    <InformationBox visualMeaning={ObjectVisualMeaning.ERROR}>
                        <Text text={`Cannot json-render any-object '${props}'`}/>
                    </InformationBox>
                );
            }
        });

        this.recalculateLogQuantities();
    }

    private renderLogBodyV1(history: Array<LogEntry>, t: Themeable.Theme): JSX.Element {
        return (
            <FlexBox height={percent(100)} width={percent(100)} overflowYBehaviour={OverflowBehaviour.SCROLL}>
                <Box gapY={t.gaps.smallGab} width={percent(100)}>{
                    history.map(log => {
                        let vm: ObjectVisualMeaning;
                        switch (log.level) {
                            case "ERROR": {
                                vm = ObjectVisualMeaning.ERROR;
                                break;
                            }
                            case "WARN": {
                                vm = ObjectVisualMeaning.WARNING;
                                break;
                            }
                            default: {
                                vm = ObjectVisualMeaning.UI_NO_HIGHLIGHT;
                                break;
                            }
                        }
                        return (
                            <Box width={percent(100)} overflowXBehaviour={OverflowBehaviour.SCROLL} visualMeaning={vm} gapY={t.gaps.smallGab} opaque>
                                <FlexBox flexDir={FlexDirection.COLUMN} justifyContent={Justify.SPACE_BETWEEN}>
                                    <FlexBox width={percent(100)} flexDir={FlexDirection.ROW} justifyContent={Justify.SPACE_BETWEEN}>
                                        <FlexBox gap={t.gaps.smallGab} height={percent(100)} flexDir={FlexDirection.ROW}>
                                            {this.component(() => <Text text={`**${dateFormat(log.timestamp, "h:MM:ss:l TT")}**`} visualMeaning={vm}/>, "log-related")}
                                            <Separator orientation={Orientation.VERTICAL}/>
                                            <Text text={`**${log.level}**`} visualMeaning={vm} coloredText/>
                                        </FlexBox>
                                        <Text text={`*${log.creator}*`} type={TextType.secondaryDescription}/>
                                    </FlexBox>
                                    <Text text={log.message} visualMeaning={vm}/>
                                </FlexBox>
                                <FlexBox gap={percent(0)} overflowXBehaviour={OverflowBehaviour.SCROLL} width={percent(100)}>
                                    {
                                        log.appendices.length > 0 ? (
                                            log.appendices.map(appendix => this.renderAppendix(appendix))
                                        ) : (
                                            <></>
                                        )
                                    }
                                </FlexBox>
                            </Box>
                        );
                    })
                }</Box>
            </FlexBox>
        );
    }

    private renderLogBodyV2(history: Array<LogEntry>, t: Themeable.Theme): JSX.Element {
        const gridStyle: CSSProperties = {
            minHeight: 550 ,
            borderRadius: t.radii.defaultObjectRadius.withPlus(-1).css(),
            overflow: "hidden",
        };

        const defaultFilterValue = [
            {name: 'level', operator: 'startsWith', type: 'string', value: ''},
            {name: 'timestamp', operator: 'after', type: 'date', value: ''}
        ];

        return (
            <ReactDataGrid
                onCellClick={event => event.preventDefault()}
                enableKeyboardNavigation
                pagination={"local"}
                style={gridStyle as {[p: string]: string | number}}
                theme={t.mode === "dark" ? "green-dark" : "green-light"}
                idProperty="id"
                columns={[
                    {
                        name: "level",
                        header: "level",
                        width: 80,
                        minWidth: 80,
                        render: ({value}) => {
                            let vm: ObjectVisualMeaning;
                            switch (value) {
                                case "ERROR": {
                                    vm = ObjectVisualMeaning.ERROR;
                                    break;
                                }
                                case "WARN": {
                                    vm = ObjectVisualMeaning.WARNING;
                                    break;
                                }
                                default: {
                                    vm = ObjectVisualMeaning.UI_NO_HIGHLIGHT;
                                    break;
                                }
                            }

                            return (
                                <Text text={value} uppercase visualMeaning={vm} coloredText={vm !== ObjectVisualMeaning.UI_NO_HIGHLIGHT} bold/>
                            );
                        }
                    },
                    {
                        name: "timestamp",
                        header: "timestamp",
                        dateFormat: "h:MM:ss:l TT",
                        filterEditor: DateFilter,
                        render: ({value}) => {
                            return (
                                dateFormat(value, "h:MM:ss:l TT")
                            );
                        }
                    },
                    {
                        name: "creator",
                        header: "creator",
                    },
                    {
                        name: "message",
                        header: "message",
                        defaultFlex: 2,
                        minWidth: 400,
                        render: ({value}) => {
                            return (
                                <CustomTooltip arrow noBorder noPadding title={
                                    <Box borderless>
                                        <FlexBox flexDir={FlexDirection.COLUMN}>
                                            <ElementHeader icon={<TextIcon/>} title={"Expanded message"} boldHeader appendix={
                                                <FlexBox flexDir={FlexDirection.ROW} align={Align.CENTER}>
                                                    <CopyIcon displayValueAsHover={false} copyValueProducer={() => String(value)}/>
                                                    <Text text={`${String(value).length} chars`} fontSize={px(10)} type={TextType.secondaryDescription}/>
                                                </FlexBox>
                                            }/>
                                            <Text text={value}/>
                                        </FlexBox>
                                    </Box>
                                } children={
                                    <span children={String(value)}/>
                                }/>
                            );
                        }
                    },
                    {
                        name: "appendices",
                        header: "appendices",
                        textAlign: "center",
                        width: 60,
                        minWidth: 60,
                        render: ({value}) => {
                            return (
                                <FlexBox width={percent(100)} justifyContent={Justify.CENTER} align={Align.CENTER}>
                                    <Text text={String((value as any[]).length)}/>
                                </FlexBox>
                            );
                        }
                    }
                ]}
                autoCheckboxColumn
                defaultFilterValue={defaultFilterValue}
                dataSource={[...history]}
            />
        );
    }

    private renderEmptySophisticatedLogHistory(): JSX.Element {
        return (
            <If condition={(App.app().sophisticatedLogHistory.length === 0)} ifTrue={
                <Centered fullHeight>
                    <Text text={"No logs recorded yet"}/>
                </Centered>
            } ifFalse={
                <Centered fullHeight>
                    <Text align={Align.CENTER} text={"No logs to show, change filter settings to see them.\nIf you want to see all log entries change filter setting to '**ALL**'"}/>
                </Centered>
            }/>
        );
    }

    private recalculateLogQuantities() {
        const newQuantities = new Map<"all" | "trc" | "deb" | "inf" | "wrn" | "err", number>([
            ["all", 0], ["trc", 0], ["deb", 0], ["inf", 0], ["wrn", 0], ["err", 0]
        ]);
        App.app().sophisticatedLogHistory.forEach(entry => {
            const level = LogPage.levelMapper.get(entry.level) as "trc" | "deb" | "inf" | "wrn" | "err";
            let q = newQuantities.get(level) as number;
            newQuantities.set(level, q + 1);
        });
        newQuantities.set("all", App.app().sophisticatedLogHistory.length);
        this.local.setState({
            quantities: newQuantities
        }, new Map<string, any>([
             ["channels", ["filter"]]
        ]));
    }

    private updateFilters(filters:  Map<"all" | "trc" | "deb" | "inf" | "wrn" | "err", boolean>) {
        this.local.setState({
            filters: filters
        }, new Map<string, any>([
            ["channels", ["filter-button"]]
        ]), () => {
            this.controller.rerender("filter");
        });
    }

    private onFilterActiveChange(p: FilterProps, active: boolean) {
        if (p.id === "all") {
            const filters = this.local.state.filters;
            (["all", "trc", "deb", "inf", "wrn", "err"] as ("all" | "trc" | "deb" | "inf" | "wrn" | "err")[]).forEach(mode => {
                filters.set(mode, false);
            });
            filters.set(p.id, active);


            this.updateFilters(filters);
            // this.local.setState({
            //
            //     filters: filters
            //
            // }, new Map<string, any>([
            //
            //     ["channels", ["filter", "filter-button"]]
            // ]));

        } else {
            const filters = this.local.state.filters;
            filters.set(p.id, active);
            if (active) {
                filters.set("all", false);
            }

            this.updateFilters(filters);
            // this.local.setState({
            //     filters: filters
            // }, new Map<string, any>([
            //     ["channels", ["filter", "filter-button"]]
            // ]));
        }
    }

    private renderFilterSelector(t: Themeable.Theme): JSX.Element {
        const ls = this.local.state;
        const fp: Array<FilterProps> = [
            {id: "all", visualMeaning: ObjectVisualMeaning.UI_NO_HIGHLIGHT, amount: ls.quantities.get("all") as number, active: getOr(ls.filters.get("all"), false)},
            {id: "trc", visualMeaning: ObjectVisualMeaning.UI_NO_HIGHLIGHT, amount: ls.quantities.get("trc") as number, active: getOr(ls.filters.get("trc"), false)},
            {id: "deb", visualMeaning: ObjectVisualMeaning.UI_NO_HIGHLIGHT, amount: ls.quantities.get("deb") as number, active: getOr(ls.filters.get("deb"), false)},
            {id: "inf", visualMeaning: ObjectVisualMeaning.UI_NO_HIGHLIGHT, amount: ls.quantities.get("inf") as number, active: getOr(ls.filters.get("inf"), false)},
            {id: "wrn", visualMeaning: ObjectVisualMeaning.WARNING, amount: ls.quantities.get("wrn") as number, active: getOr(ls.filters.get("wrn"), false)},
            {id: "err", visualMeaning: ObjectVisualMeaning.ERROR, amount: ls.quantities.get("err") as number, active: getOr(ls.filters.get("err"), false)},
        ];
        return (
            <LiteGrid columns={6} gap={t.gaps.smallGab}>{
                fp.map(p => (
                    <Togglable initialActiveState={p.active} onChange={active => this.onFilterActiveChange(p, active)} active={
                        (() => {
                            const vm: ObjectVisualMeaning = this.local.state.filterMultiColorMode ? getOr(p.visualMeaning, ObjectVisualMeaning.INFO) : ObjectVisualMeaning.INFO;
                            return (
                                <Box noPadding highlight cursor={Cursor.pointer} visualMeaning={vm} opaque={!this.local.state.filterMultiColorMode}>
                                    <Centered fullHeight>
                                        <Text text={`**${p.id}**`} uppercase cursor={Cursor.pointer} visualMeaning={vm} coloredText={false}/>
                                    </Centered>
                                    <Separator visualMeaning={vm}/>
                                    <Centered fullHeight>
                                        <Text text={`${p.amount}`} uppercase cursor={Cursor.pointer}/>
                                    </Centered>
                                </Box>
                            );
                        })()
                    } inactive={
                        (() => {
                            const vm: ObjectVisualMeaning = this.local.state.filterMultiColorMode ? getOr(p.visualMeaning, ObjectVisualMeaning.UI_NO_HIGHLIGHT) : ObjectVisualMeaning.UI_NO_HIGHLIGHT;
                            return (
                                <Box noPadding highlight cursor={Cursor.pointer} visualMeaning={vm} opaque={true}>
                                    <Centered fullHeight>
                                        <Text text={`**${p.id}**`} uppercase cursor={Cursor.pointer} visualMeaning={vm} coloredText/>
                                    </Centered>
                                    <Separator visualMeaning={vm}/>
                                    <Centered fullHeight>
                                        <Text text={`${p.amount}`} uppercase cursor={Cursor.pointer}/>
                                    </Centered>
                                </Box>
                            );
                        })()
                    }/>
                ))
            }</LiteGrid>
        );
    }

    private renderAppendix(data: LogEntryAppendix): JSX.Element {
        if (this.asmMap.has(data.type)) {
            return this.assembly.render({
               param: data.data,
               component: this.asmMap.get(data.type) as string
            });
        } else {
            return this.assembly.render({
                param: data.data,
                component: this.asmMap.get("any") as string
            });
        }
    }


    private getFilteredLogHistory(): Array<LogEntry> {
        let history: Array<LogEntry> = [];
        const filters = this.local.state.filters;
        if (filters.get("all")) {
            history = App.app().sophisticatedLogHistory;
        } else {
            const trc = filters.get("trc");
            const deb = filters.get("deb");
            const inf = filters.get("inf");
            const wrn = filters.get("wrn");
            const err = filters.get("err");
            App.app().sophisticatedLogHistory.forEach(entry => {
                switch (entry.level) {
                    case "TRACE": {
                        if (trc) history.push(entry);
                        break;
                    }
                    case "DEBUG": {
                        if (deb) history.push(entry);
                        break;
                    }
                    case "INFO": {
                        if (inf) history.push(entry);
                        break;
                    }
                    case "WARN": {
                        if (wrn) history.push(entry);
                        break;
                    }
                    case "ERROR": {
                        if (err) history.push(entry);
                        break;
                    }
                    case "SEVERE": {
                        if (err) history.push(entry);
                        break;
                    }
                }
            });
        }
        return history;
    }

    private renderSophisticatedLogHistory(t: Themeable.Theme): JSX.Element {
        const history: Array<LogEntry> = this.getFilteredLogHistory();

        if (history.length < 1) {
            return this.renderEmptySophisticatedLogHistory();
        }

        const historyRenderer = LogPage.versionMap.get(this.props.version);
        if (historyRenderer !== undefined) {
            return historyRenderer.render(this, history, t);
        } else {
            return (
                <InformationBox visualMeaning={ObjectVisualMeaning.ERROR} children={
                    <Text text={`No history-renderer mapped to version '${this.props.version}'`}/>
                }/>
            );
        }
    }

    private renderPageHeader(): JSX.Element {
        return (
            <AppHeader
                title={"Log"}
                left={<FlexBox flexDir={FlexDirection.ROW} align={Align.CENTER} height={percent(100)}>
                    <Icon icon={<ReloadIcon/>} onClick={() => {
                        this.forceUpdate();
                    }}/>
                    <Separator orientation={Orientation.VERTICAL}/>
                    {this.component(() => (
                        <If condition={this.local.state.live} ifTrue={
                            <Text
                                cursor={Cursor.pointer}
                                type={TextType.secondaryDescription}
                                visualMeaning={ObjectVisualMeaning.INFO}
                                coloredText
                                uppercase
                                text={`**live**`}
                                onClick={() => this.toggleLiveLogUpdateListener(!this.local.state.live)}
                            />
                        } ifFalse={
                            <Text
                                cursor={Cursor.pointer}
                                type={TextType.secondaryDescription}
                                text={`${dateFormat(new Date(), "h:MM:ss")}`}
                                onClick={() => this.toggleLiveLogUpdateListener(!this.local.state.live)}
                            />
                        }/>
                    ), "log-related", "live")}

                </FlexBox>}
                right={<FlexBox flexDir={FlexDirection.ROW} align={Align.CENTER} height={percent(100)}>
                    <Icon icon={<ColorToggleIcon/>} onClick={() => {
                        this.local.setState({
                            filterMultiColorMode: !this.local.state.filterMultiColorMode
                        }, new Map<string, any>([
                            ["channels", ["filter"]]
                        ]))
                    }}/>
                    <Icon icon={<DeleteIcon/>} onClick={() => {
                        App.app().sophisticatedLogHistory = [];
                        this.forceUpdate();
                    }}/>
                    <Separator orientation={Orientation.VERTICAL}/>
                    <Icon icon={<CloseIcon/>} onClick={() => {
                        App.app().callAction("close-main-dialog");
                    }}/>
                </FlexBox>}
            />
        );
    }

    forceUpdate(callback?: () => void) {
        this.recalculateLogQuantities();
        super.forceUpdate(callback);
    }

    toggleLiveLogUpdateListener(enable: boolean) {
        if (enable) {
            App.app().logEntryAddListeners.set(this.local.state.logInterceptorID, () => this.controller.rerender("log-related"));
        } else {
            App.app().logEntryAddListeners.delete(this.local.state.logInterceptorID);
        }
        this.local.setState({
            live: enable
        }, new Map<string, any>([[
            "channels", ["live"]
        ]]));
    }

    componentDidMount() {
        if (this.local.state.live) {
            this.toggleLiveLogUpdateListener(true);
        }
    }

    componentWillUnmount() {
        this.toggleLiveLogUpdateListener(false);
    }

    componentRender(p: any, s: any, l: any, t: Themeable.Theme, a: Assembly): JSX.Element | undefined {
        return (
            <Screen>
                {this.renderPageHeader()}
                {this.component(() => (this.renderFilterSelector(t)), "filter", "log-related", "filter-button")}
                {this.component(() => (this.renderSophisticatedLogHistory(t)), "filter", "log-related")}
            </Screen>
        );
    }
}
