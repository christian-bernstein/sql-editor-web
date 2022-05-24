import React, {ForwardedRef} from "react";
import {Screen} from "../../components/lo/Page";
import {LiteGrid} from "../../components/lo/LiteGrid";
import {FlexBox} from "../../components/lo/FlexBox";
import {Align} from "../../logic/style/Align";
import {Justify} from "../../logic/style/Justify";
import {Icon} from "../../components/lo/Icon";
import {ReactComponent as MenuIcon} from "../../assets/icons/ic-20/ic20-menu.svg";
import {ReactComponent as ErrorIcon} from "../../assets/icons/ic-20/ic20-alert.svg";
import {ReactComponent as RedirectIcon} from "../../assets/icons/ic-20/ic20-arrow-right.svg";
import {ReactComponent as PushIcon, ReactComponent as UploadIcon} from "../../assets/icons/ic-16/ic16-upload.svg";
import {ReactComponent as PullIcon, ReactComponent as DownloadIcon} from "../../assets/icons/ic-16/ic16-download.svg";
import {ReactComponent as CloseIcon} from "../../assets/icons/ic-20/ic20-close.svg";
import {ReactComponent as DeleteIcon} from "../../assets/icons/ic-20/ic20-delete.svg";
import {ReactComponent as HistoryIcon} from "../../assets/icons/ic-20/ic20-book.svg";
import {ReactComponent as ContextIcon} from "../../assets/icons/ic-20/ic20-more-ver.svg";
import {ReactComponent as TableIcon} from "../../assets/icons/ic-20/ic20-view-table.svg";
import {ReactComponent as CreateIcon} from "../../assets/icons/ic-16/ic16-plus.svg";
import {ReactComponent as SettingsIcon} from "../../assets/icons/ic-20/ic20-settings.svg";
import {ReactComponent as OptionsIcon} from "../../assets/icons/ic-20/ic20-play.svg";
import {ReactComponent as SaveIcon} from "../../assets/icons/ic-20/ic20-bookmark-add.svg";
import {App, utilizeGlobalTheme} from "../../logic/app/App";
import {Text, TextType} from "../../components/lo/Text";
import {DBSessionCacheShard} from "../../shards/dbSessionCache/DBSessionCacheShard";
import {percent, px} from "../../logic/style/DimensionalMeasured";
import {Box} from "../../components/lo/Box";
import {ObjectVisualMeaning} from "../../logic/style/ObjectVisualMeaning";
import {Cursor} from "../../logic/style/Cursor";
import {RedirectController} from "../../components/logic/RedirectController";
import {ProjectInfoData} from "../../logic/data/ProjectInfoData";
import {Centered} from "../../components/lo/PosInCenter";
import {FlexDirection} from "../../logic/style/FlexDirection";
import {CodeEditor} from "../../components/lo/CodeEditor";
import {v4} from "uuid";
import {sql} from "@codemirror/lang-sql";
import {OverflowBehaviour} from "../../logic/style/OverflowBehaviour";
import {Themeable} from "../../logic/style/Themeable";
import {SessionCommand} from "../../logic/data/SessionCommand";
import {arrayFactory} from "../../logic/Utils";
import {Button} from "../../components/lo/Button";
import {LoadState} from "../../logic/misc/LoadState";
import {CircularProgress, Dialog, Slide, Zoom} from "@mui/material";
import {SessionCommandType} from "../../logic/data/SessionCommandType";
import {CustomTooltip} from "../../components/lo/CustomTooltip";
import {TransitionProps} from '@mui/material/transitions';
import {SQLCommandQueryResponsePacketData} from "../../packets/in/SQLCommandQueryResponsePacketData";
import {DebugTableDataDisplayPage} from "../../components/ho/tableDataDisplay/TableDataDisplay";
import {ServerConnectionIcon} from "../../components/ho/serverConnectionIcon/ServerConnectionIcon";
import {Separator} from "../../components/lo/Separator";
import {Orientation} from "../../logic/style/Orientation";
import {oneDark} from '@codemirror/theme-one-dark';
import {HighlightStyle, tags} from "@codemirror/highlight"
import {ElementHeader} from "../../components/lo/ElementHeader";
import {InformationBox} from "../../components/ho/informationBox/InformationBox";
import {SQLQueryResultDialog} from "../sqlQueryResult/SQLQueryResultDialog";
import {RoadmapEntry} from "../../components/ho/roadmapEntry/RoadmapEntry";
import {If} from "../../components/logic/If";
import {HistoryEntry} from "./HistoryEntry";
import {EditorCommandError} from "./EditorCommandError";
import {Group} from "../../components/lo/Group";
import {BernieComponent} from "../../logic/BernieComponent";
import {DBErrorDisplay} from "../../components/ho/dbErrorDisplay/DBErrorDisplay";
import {Assembly} from "../../logic/assembly/Assembly";
import {Switch} from "../../components/lo/Switch";
import {SQLCommandUpdateResponsePacketData} from "../../packets/in/SQLCommandUpdateResponsePacketData";
import {DBTaskCard} from "../../components/indev/DBTaskCard";
import {CopyIcon} from "../../components/ho/copyIcon/CopyIcon";
import {ContextCompound} from "../../components/ho/contextCompound/ContextCompound";
import {ContextMenuElement} from "../../components/lo/ContextMenuElement";
import {Badge} from "../../components/lo/Badge";
import {SavedCommand} from "./SavedCommand";
import {CommandHistoryElement} from "../../components/ho/commandHistoryElement/CommandHistoryElement";
import {SavedCommandType} from "./SavedCommandType";
import {Default, Mobile} from "../../components/logic/Media";
import {SQLCommandBookmarksDialog} from "../sqlCommandBookmarks/SQLCommandBookmarksDialog";

export type DebugEditorProps = {
}

export type DebugEditorState = {
    redirect: boolean,
    to: string,
    openMainDialog: boolean,
    dialogComponent?: string
}

export type DebugEditorLocalState = {
    command: string,
    processPushCommand: boolean,
    processPullCommand: boolean,
    processSQLResultOpening: boolean,
    // todo SQLCommandQueryResponsePacketData | SQLCommandUpdateResponsePacketData
    sqlCommandResultCache: (SQLCommandQueryResponsePacketData)[],
    projectHistoryLocalCache: HistoryEntry[],
    error?: EditorCommandError,
    masterOpenDialogOnCommandResponse: boolean,
    savedCommands: SavedCommand[]
}

/**
 * todo create 'acknowledge'-feature
 */
export class Editor extends BernieComponent<DebugEditorProps, DebugEditorState, DebugEditorLocalState> {

    private readonly DialogTransition = React.forwardRef((props: TransitionProps & {children?: React.ReactElement<any, any>}, ref: ForwardedRef<unknown>) => {
        return <Slide direction="up" ref={ref} {...props} />;
    });

    // noinspection TypeScriptFieldCanBeMadeReadonly
    private projectStaticData?: ProjectInfoData;

    constructor(props: DebugEditorProps) {
        super(props, {
            redirect: false,
            to: "/",
            openMainDialog: false
        }, {
            command: "show tables from information_schema",
            processPullCommand: false,
            processPushCommand: false,
            processSQLResultOpening: false,
            sqlCommandResultCache: [],
            projectHistoryLocalCache: [],
            error: undefined,
            masterOpenDialogOnCommandResponse: true,
            savedCommands: []
        });
        this.initAssembly();
        this.initProtocolHandlers();
        const data = App.app().shard<DBSessionCacheShard>("db-session-cache").currentInfoData;
        if (data === undefined) {
            if (App.app().config.debugMode) {
                App.app().shard<DBSessionCacheShard>("db-session-cache").currentInfoData = {
                    id: v4(),
                    creatorUserID: v4(),
                    title: "Debug session",
                    edits: 256,
                    stator: false,
                    lastEdited: new Date(),
                    state: LoadState.ONLINE,
                    description: "For debugging purposes",
                    internalTags: []
                };
            } else {
                console.error("currentInfoData is undefined & app not in debugging mode -> This is an error");
            }
        } else {
            this.projectStaticData = data;
        }
        this.requestServerDBActionStream();
    }

    private initAssembly() {
        this.createBookmarksAssembly();
        this.createPullPushAssembly();
        this.createSqlCommandResultAssembly();
        this.createSqlCommandResultAssemblyV2();
        this.createErrorAssembly();
        this.createInputControlsAssembly();
        this.createHeaderAssembly();
        this.createEditorMainAssembly();
        this.createInputAssembly();
    }

    private createBookmarksAssembly() {
        this.assembly.assembly("sql-bookmarks", (theme, props) => {
            return (
                <SQLCommandBookmarksDialog bookmarks={() => this.local.state.savedCommands} onClose={() => {
                    this.setState({
                        openMainDialog: false
                    });
                }} onSelect={command => {
                    this.setSQLInput(command.command);
                    this.setState({
                        openMainDialog: false
                    });
                }} onDelete={command => this.deleteSavedCommand(command)}/>
            );
        });
    }

    private deleteSavedCommand(command: SavedCommand): void {
        const commands = this.local.state.savedCommands;
        const index = commands.indexOf(command);
        if (index > -1) {
            commands.splice(index, 1);
            this.local.setStateWithChannels({
                savedCommands: commands
            }, ["bookmarks"]);

            // todo remove this
            this.setState({
                openMainDialog: false
            });
        }
    }

    private createInputAssembly() {
        this.assembly.assembly("input", (theme, props) => {
            return (
                <FlexBox width={percent(100)} overflowYBehaviour={OverflowBehaviour.VISIBLE} gap={theme.gaps.smallGab} justifyContent={Justify.FLEX_END}>
                    {/*<Box width={percent(100)} gapY={theme.gaps.defaultGab}>
                            <Text text={"Edits"}/>
                            <Task task={{}}/>
                        </Box>*/}
                    {/*<RenderExecutor
                            id={v4()}
                            channels={["*", "command"]}
                            componentDidMountRelay={bridge => this.controller.register(bridge)}
                            componentFactory={() => (
                                <Text text={this.local.state.command}/>
                            )}
                        />*/}
                    <Text text={"SQL input"} bold uppercase type={TextType.secondaryDescription}/>
                    {this.component(local => {
                        return this.assembly.render({
                            component: "error"
                        })
                    }, "*", "error")}

                    <FlexBox align={Align.CENTER} justifyContent={Justify.SPACE_BETWEEN} gap={theme.gaps.smallGab} flexDir={FlexDirection.ROW} width={percent(100)} height={percent(100)}>
                        {this.component(local => {
                            return this.assembly.render({
                                component: "input-controls"
                            })
                        }, "*", "input-controls")}
                        {this.component(local => {
                            return this.assembly.render({
                                component: "push-pull-button",
                                param: ""
                            })
                        }, "*", "push-pull")}
                    </FlexBox>

                    <FlexBox flexDir={FlexDirection.ROW} width={percent(100)} gap={theme.gaps.smallGab}>
                        <CodeEditor
                            width={percent(100)}
                            theme={oneDark}
                            classnames={["cm"]}
                            debounce={true}
                            debounceMS={300}
                            value={this.local.state.command}
                            placeholder={"select * from Users"}
                            extensions={[
                                sql(),
                                HighlightStyle.define([
                                    {tag: tags.keyword, class: "keyword"},
                                    {tag: tags.local, class: "local"},
                                    {tag: tags.color, class: "color"},
                                    {tag: tags.comment, class: "comment"},
                                    {tag: tags.function, class: "function"},
                                    {tag: tags.string, class: "string"},
                                    {tag: tags.content, class: "content"},
                                    {tag: tags.arithmeticOperator, class: "arithmeticOperator"},

                                ])
                            ]}
                            upstreamHook={value => this.local.setState({
                                command: value
                            })}
                        />

                        {/*this.component(local => {
                                return this.assembly.render({
                                    component: "push-pull-button",
                                    param: ""
                                })
                            }, "*", "push-pull")*/}
                    </FlexBox>
                </FlexBox>
            );
        })
    }

    private createEditorMainAssembly() {
        this.assembly.assembly("main", (theme, props) => {
            return (
                <FlexBox height={percent(100)} width={percent(100)} gap={theme.gaps.smallGab} flexDir={FlexDirection.COLUMN}>
                    <Text text={"Database output"} bold uppercase type={TextType.secondaryDescription}/>
                    <FlexBox flexDir={FlexDirection.ROW} gap={theme.gaps.smallGab} width={percent(100)} justifyContent={Justify.SPACE_BETWEEN} align={Align.CENTER}>
                        {this.renderHistoryButton()}

                        <Switch checked={this.local.state.masterOpenDialogOnCommandResponse} text={<Text text={"Auto dialog opening"} bold uppercase type={TextType.secondaryDescription} fontSize={px(12)}/>} onChange={(event, checked) => {
                            this.local.setState({
                                masterOpenDialogOnCommandResponse: checked
                            });
                        }}/>
                    </FlexBox>

                    <If condition={App.app().config.debugMode} ifTrue={this.renderDBHistory()} ifFalse={
                        <FlexBox height={percent(100)}>
                        </FlexBox>
                    }/>
                </FlexBox>
            );
        })
    }

    private createHeaderAssembly() {
        this.assembly.assembly("header", (theme, props) => {
            const session: ProjectInfoData = props;

            return (
                <FlexBox width={percent(100)} flexDir={FlexDirection.COLUMN} gap={theme.gaps.smallGab}>
                    <FlexBox width={percent(100)}>
                        <LiteGrid columns={3}>
                            <FlexBox align={Align.START} justifyContent={Justify.CENTER}>
                                <Icon icon={<MenuIcon/>} onClick={() => App.app().openMenu()}/>
                            </FlexBox>
                            <FlexBox align={Align.CENTER} justifyContent={Justify.CENTER}>
                                <Text uppercase align={Align.CENTER} type={TextType.smallHeader} text={"DB Editor"} />
                            </FlexBox>
                            <FlexBox align={Align.CENTER} justifyContent={Justify.FLEX_END} flexDir={FlexDirection.ROW} gap={theme.gaps.smallGab}>
                                <Icon icon={<SettingsIcon/>}/>
                                <Icon icon={<CloseIcon/>} onClick={() => this.closeSession()}/>
                                <Separator orientation={Orientation.VERTICAL}/>
                                <ServerConnectionIcon openConnectionMetricsDialog/>
                            </FlexBox>
                        </LiteGrid>
                    </FlexBox>

                    <FlexBox flexDir={FlexDirection.ROW} align={Align.CENTER} gap={px(1)} width={percent(100)}>
                        <Text text={`${App.app().config.connectorConfig.address}/`}/>
                        <Box paddingY={px(2)} paddingX={px(4)} overflowXBehaviour={OverflowBehaviour.SCROLL} visualMeaning={ObjectVisualMeaning.UI_NO_HIGHLIGHT}>
                            <Text text={`**${session.title}**`} whitespace={"nowrap"}/>
                        </Box>
                    </FlexBox>
                </FlexBox>
            );
        });
    }

    private createErrorAssembly() {
        this.assembly.assembly("error", (theme, props) => {
            const error: EditorCommandError | undefined = this.local.state.error;
            if (error !== undefined) {
                return (
                    <DBErrorDisplay error={error} deleteHook={() => {
                        this.local.setStateWithChannels({
                            error: undefined
                        }, ["error"])
                    }}/>
                );
            } else {
                return (
                    <></>
                );
            }
        });
    }

    private createPullPushAssembly() {
        this.assembly.assembly("push-pull-button", (theme, props1) => {
            const localState = this.local.state;
            const working: boolean = localState.processPushCommand || localState.processPullCommand;
            return (
                <Group height={px(37)} opaque visualMeaning={working ? ObjectVisualMeaning.UI_NO_HIGHLIGHT : ObjectVisualMeaning.INFO} orientation={Orientation.HORIZONTAL} elements={[
                    <Button visualMeaning={working ? ObjectVisualMeaning.UI_NO_HIGHLIGHT : ObjectVisualMeaning.INFO} opaque={true} onClick={() => {
                        if (!working) {
                            this.sendCommand(SessionCommandType.PUSH);
                        }
                    }}>{
                        localState.processPushCommand ? (
                                <Text text={"upd"} visualMeaning={ObjectVisualMeaning.INFO} coloredText bold uppercase fontSize={px(12)} type={TextType.secondaryDescription} enableLeftAppendix leftAppendix={
                                    <FlexBox align={Align.CENTER} justifyContent={Justify.CENTER} width={px(20)} height={px(20)}>
                                        <CircularProgress variant={"indeterminate"} size={16} sx={{
                                            color: theme.colors.primaryHighlightColor.css()
                                        }}/>
                                    </FlexBox>
                                }/>
                        ) : (
                            <CustomTooltip noBorder arrow title={(
                                <Text text={"**Update**\n Update something in the database"}/>
                            )} TransitionComponent={Zoom} children={
                                <span>
                                    <Text text={"upd"} visualMeaning={working ? ObjectVisualMeaning.UI_NO_HIGHLIGHT : ObjectVisualMeaning.INFO} coloredText bold uppercase fontSize={px(12)} type={TextType.secondaryDescription} enableLeftAppendix leftAppendix={
                                        <Icon visualMeaning={working ? ObjectVisualMeaning.UI_NO_HIGHLIGHT : ObjectVisualMeaning.INFO} colored={true} icon={<PushIcon/>}/>
                                    }/>
                                </span>
                            }/>
                        )
                    }</Button>,
                    <Button visualMeaning={working ? ObjectVisualMeaning.UI_NO_HIGHLIGHT : ObjectVisualMeaning.INFO} opaque={true} onClick={() => {
                        if (!working) {
                            this.sendCommand(SessionCommandType.PULL);
                        }
                    }}>{
                        localState.processPullCommand ? (
                            <Text text={"qry"} visualMeaning={ObjectVisualMeaning.INFO} coloredText bold uppercase fontSize={px(12)} type={TextType.secondaryDescription} enableLeftAppendix leftAppendix={
                                <FlexBox align={Align.CENTER} justifyContent={Justify.CENTER} width={px(20)} height={px(20)}>
                                    <CircularProgress variant={"indeterminate"} size={16} sx={{
                                        color: theme.colors.primaryHighlightColor.css()
                                    }}/>
                                </FlexBox>
                            }/>
                        ) : (
                            <CustomTooltip noBorder arrow title={(
                                <Text text={"**Query**\n Query data from the database"}/>
                            )} TransitionComponent={Zoom} children={
                                <span>
                                    <Text text={"qry"} visualMeaning={working ? ObjectVisualMeaning.UI_NO_HIGHLIGHT : ObjectVisualMeaning.INFO} coloredText bold uppercase fontSize={px(12)} type={TextType.secondaryDescription} enableLeftAppendix leftAppendix={
                                        <Icon visualMeaning={working ? ObjectVisualMeaning.UI_NO_HIGHLIGHT : ObjectVisualMeaning.INFO} colored={true} icon={<PullIcon/>}/>
                                    }/>
                                </span>
                            }/>
                        )
                    }</Button>
                ]}/>
            )
        });
    }

    private setSQLInput(value: string): void {
        this.local.setStateWithChannels({
            command: value
        }, ["input"]);
    }

    private createInputControlsAssembly() {
        this.assembly.assembly("input-controls", (theme, props) => {
            return (
                <FlexBox flexDir={FlexDirection.ROW} overflowXBehaviour={OverflowBehaviour.SCROLL} gap={theme.gaps.smallGab} align={Align.CENTER} height={percent(100)}>
                    <Group orientation={Orientation.HORIZONTAL} height={percent(100)} elements={[
                        <Button
                            cursor={Cursor.notAllowed}
                            visualMeaning={ObjectVisualMeaning.UI_NO_HIGHLIGHT}
                            shrinkOnClick={true}
                            children={
                                <CustomTooltip arrow noPadding noBorder title={
                                    <Box gapY={theme.gaps.smallGab}>
                                        <ElementHeader
                                            icon={<CreateIcon/>}
                                            appendix={
                                                <Button visualMeaning={ObjectVisualMeaning.BETA} shrinkOnClick opaque padding={px(4)}>
                                                    <Text text={"View roadmap"}/>
                                                </Button>
                                            }
                                            wrapIcon
                                            title={"Create"}
                                            beta
                                        />
                                        <Separator/>
                                        <Text text={"Create a new entry in your project. \nAn entry can be a: **internal database**, **table**, **row** etc."}/>
                                        <InformationBox visualMeaning={ObjectVisualMeaning.BETA}>
                                            <Text type={TextType.secondaryDescription} text={"As of subversion **v2.29-alpha.0** *(01. Mar 2022)*, the website is in it's development phase."}/>
                                        </InformationBox>
                                    </Box>
                                } children={
                                    <span children={<Icon icon={<CreateIcon/>}/>}/>
                                }/>
                            }
                        />,
                        <span>
                            <Mobile children={
                                <Button
                                    border={false}
                                    style={{borderRadius: "0 !important"}}
                                    children={<span children={<Icon icon={<HistoryIcon/>}/>}/>}
                                    onClick={() => this.openMainDialog("sql-bookmarks")}
                                />
                            }/>
                            <Default children={
                                <ContextCompound width={percent(100)} menu={
                                    <FlexBox width={percent(100)} padding paddingX={theme.gaps.smallGab} paddingY={theme.gaps.smallGab}>
                                        <ElementHeader icon={<HistoryIcon/>} wrapIcon title={"Saved commands"} boldHeader/>
                                        <Separator/>
                                        <LiteGrid responsive minResponsiveWidth={percent(30)} gap={theme.gaps.smallGab}>
                                            {this.local.state.savedCommands.map(saved => {
                                                return (
                                                    <CommandHistoryElement command={saved} onSelect={(command, element) => {
                                                        this.setSQLInput(command.command);
                                                    }} onDelete={command => this.deleteSavedCommand(command)}/>
                                                );
                                            })}
                                        </LiteGrid>
                                    </FlexBox>
                                } children={
                                    <Button
                                        shrinkOnClick
                                        border={false}
                                        visualMeaning={ObjectVisualMeaning.UI_NO_HIGHLIGHT}
                                        children={<span children={<Icon icon={<HistoryIcon/>}/>}/>}
                                    />
                                }/>
                            }/>
                        </span>,
                        <ContextCompound width={percent(100)} menu={
                            <FlexBox width={percent(100)} padding paddingY={theme.gaps.smallGab} paddingX={theme.gaps.smallGab}>
                                <ElementHeader
                                    title={"Input options"}
                                    icon={<OptionsIcon/>}
                                    wrapIcon
                                    appendix={
                                        <Button visualMeaning={ObjectVisualMeaning.BETA} shrinkOnClick opaque padding={px(4)}>
                                            <Text text={"View roadmap"}/>
                                        </Button>
                                    }
                                />
                                <Separator/>
                                <FlexBox gap={px(1)} width={percent(100)}>
                                    <ContextMenuElement onClick={() => this.createCommandSnapshot(SavedCommandType.BOOKMARK)} title={"Save input"} icon={() => (
                                        <FlexBox flexDir={FlexDirection.ROW} gap={theme.gaps.defaultGab} align={Align.CENTER}>
                                            {Badge.beta(theme)}
                                            <Icon icon={<SaveIcon/>}/>
                                        </FlexBox>
                                    )}/>
                                    <ContextMenuElement title={"Upload data"} icon={() => <Icon icon={<UploadIcon/>}/>}/>
                                    <ContextMenuElement title={"Download data"} icon={() => (
                                        <FlexBox flexDir={FlexDirection.ROW} gap={theme.gaps.defaultGab} align={Align.CENTER}>
                                            <Icon icon={<DownloadIcon/>}/>
                                        </FlexBox>
                                    )}/>
                                </FlexBox>
                                {/*<Text text={"Import data from your device. \nAllowed file formats: **.dat**, **.csv**, **.xls** *(Excel spreadsheet)*."}/>
                                <InformationBox visualMeaning={ObjectVisualMeaning.BETA}>
                                    <Text type={TextType.secondaryDescription} text={"As of subversion **v2.29-alpha.0** *(01. Mar 2022)*, the website is in it's development phase."}/>
                                </InformationBox>*/}
                            </FlexBox>
                        } children={
                            <Button
                                shrinkOnClick
                                border={false}
                                visualMeaning={ObjectVisualMeaning.UI_NO_HIGHLIGHT}
                                children={<span children={<Icon icon={<ContextIcon/>}/>}/>}
                            />
                        }/>,
                        // <Button
                        //     cursor={Cursor.notAllowed}
                        //     visualMeaning={ObjectVisualMeaning.UI_NO_HIGHLIGHT}
                        //     shrinkOnClick={true}
                        //     children={
                        //         <CustomTooltip arrow noPadding noBorder title={
                        //             <Box gapY={theme.gaps.smallGab}>
                        //                 <ElementHeader
                        //                     icon={<UploadIcon/>}
                        //                     appendix={
                        //                         <Button visualMeaning={ObjectVisualMeaning.BETA} shrinkOnClick opaque padding={px(4)}>
                        //                             <Text text={"View roadmap"}/>
                        //                         </Button>
                        //                     }
                        //                     wrapIcon
                        //                     title={"Upload data"}
                        //                     beta
                        //                 />
                        //                 <Separator/>
                        //                 <Text text={"Import data from your device. \nAllowed file formats: **.dat**, **.csv**, **.xls** *(Excel spreadsheet)*."}/>
                        //                 <InformationBox visualMeaning={ObjectVisualMeaning.BETA}>
                        //                     <Text type={TextType.secondaryDescription} text={"As of subversion **v2.29-alpha.0** *(01. Mar 2022)*, the website is in it's development phase."}/>
                        //                 </InformationBox>
                        //             </Box>
                        //         } children={<span children={<Icon icon={<UploadIcon/>}/>}/>}/>
                        //     }
                        // />,
                        // <Button
                        //     cursor={Cursor.notAllowed}
                        //     visualMeaning={ObjectVisualMeaning.UI_NO_HIGHLIGHT}
                        //     shrinkOnClick={true}
                        //     children={
                        //         <CustomTooltip arrow noPadding noBorder title={
                        //             <Box gapY={theme.gaps.smallGab}>
                        //                 <ElementHeader
                        //                     icon={<DownloadIcon/>}
                        //                     appendix={
                        //                         <Button visualMeaning={ObjectVisualMeaning.BETA} shrinkOnClick opaque padding={px(4)}>
                        //                             <Text text={"View roadmap"}/>
                        //                         </Button>
                        //                     }
                        //                     wrapIcon
                        //                     title={"Download data"}
                        //                     beta
                        //                 />
                        //                 <Separator/>
                        //                 <Text text={"Export data to a downloadable file. \nAllowed file formats: **.dat**, **.csv**, **.xls** *(Excel spreadsheet)*."}/>
                        //                 <InformationBox visualMeaning={ObjectVisualMeaning.BETA}>
                        //                     <Text type={TextType.secondaryDescription} text={"As of subversion **v2.29-alpha.0** *(01. Mar 2022)*, the website is in it's development phase."}/>
                        //                 </InformationBox>
                        //             </Box>
                        //         } children={
                        //             <span children={<Icon icon={<DownloadIcon/>}/>}/>
                        //         }/>
                        //     }
                        // />
                    ]}/>

                    <Group orientation={Orientation.HORIZONTAL} opaque height={percent(100)} elements={[
                        // Clear the sql input
                        <Button
                            cursor={Cursor.pointer}
                            visualMeaning={ObjectVisualMeaning.UI_NO_HIGHLIGHT}
                            opaque={false}
                            shrinkOnClick={true} children={<Icon icon={<DeleteIcon/>}/>}
                            onClick={() => {
                                this.setSQLInput("");
                            }}
                        />,
                        // Copy command input's value into clipboard
                        <Button
                            cursor={Cursor.pointer}
                            visualMeaning={ObjectVisualMeaning.UI_NO_HIGHLIGHT}
                            opaque={false}
                            shrinkOnClick={true} children={
                                <CopyIcon copyValueProducer={() => this.local.state.command} displayValueAsHover={false}/>
                            }
                        />,
                    ]}/>
                </FlexBox>
            );
        })
    }

    private createSqlCommandResultAssemblyV2() {
        this.assembly.assembly("sql-command-result-v2", (theme, props1) => {
            const cache = this.local.state.sqlCommandResultCache;
            if (cache !== undefined && cache.length > 0) {
                // todo remove cache duplication
                return (
                    <SQLQueryResultDialog deleteCurrentSelectionBridge={data => {
                        data.forEach(elem => {
                            const cache = this.local.state.sqlCommandResultCache;
                            const index = cache.indexOf(elem, 0);
                            if (index > -1) {
                                cache.splice(index, 1);
                            }
                        });
                    }} data={cache} startingIndex={cache.length - 1} onClose={() => this.setState({
                        openMainDialog: false
                    })}/>
                );
            } else return <>Date is undefined or no data accessible</>;
        });
    }

    private createSqlCommandResultAssembly() {
        this.assembly.assembly("sql-command-result", (theme, props1) => {
            const cache = this.local.state.sqlCommandResultCache;
            const data = cache[cache.length - 1];
            if (data !== undefined) {
                return (
                    <>
                        <DebugTableDataDisplayPage data={data} onClose={() => this.setState({
                            openMainDialog: false
                        })}/>
                    </>
                );
            } else return <>Data is undefined</>;
        });
    }

    private initProtocolHandlers() {
        App.app().getConnector().registerProtocolPacketHandler("main", "SQLCommandQueryResponsePacketData", {
            handle: (connector1, packet) => {
                const data: SQLCommandQueryResponsePacketData = packet.data as SQLCommandQueryResponsePacketData;
                // todo check if response matches the currently mapped project
                const cache = this.local.state.sqlCommandResultCache;
                cache.push(data);
                this.local.setState({
                    sqlCommandResultCache: cache
                });

                // this.openMainDialog("sql-command-result");
                // todo maybe show this page, even if error is there?
                if (data.success && this.local.state.masterOpenDialogOnCommandResponse) {
                    this.openMainDialog("sql-command-result-v2");
                }

                let error = this.local.state.error;
                if (data.error !== null && data.error !== undefined) {
                    error = data.error;
                }

                this.local.setState({
                    processPullCommand: false,
                    error: error
                }, new Map([["channels", ["push-pull", "error"]]]));
            }
        });

        App.app().getConnector().registerProtocolPacketHandler("main", "SQLCommandUpdateResponsePacketData", {
            handle: (connector1, packet) => {
                const data: SQLCommandUpdateResponsePacketData = packet.data as SQLCommandUpdateResponsePacketData;
                let error = this.local.state.error;
                if (data.error !== null && data.error !== undefined) {
                    error = data.error;
                }
                this.local.setState({
                    processPushCommand: false,
                    error: error
                }, new Map([["channels", ["push-pull", "error"]]]));
            }
        });
    }

    /**
     * todo convert from singleton to call -> and display a badge in the editors menu displaying the current
     *  streaming state (DB streaming online | DB streaming offline)
     *
     * Ask the server to add this client to its database-client lookup table.
     * This results in the server broadcasting database actions to this client
     */
    private requestServerDBActionStream() {
        if (this.projectStaticData !== undefined) {
            App.app().getConnector().singleton({
                protocol: "main",
                packetID: "SqlCommandStreamRequestPacketData",
                data: {
                    projectID: this.projectStaticData?.id
                }
            });
        } else {
            console.error("Cannot request server db streaming because editor holds no project data (Editor is wrongly mapped)")
        }
    }

    private openMainDialog(dialogComponent: string) {
        this.setState({
            openMainDialog: true,
            dialogComponent: dialogComponent
        });
    }

    private closeSession() {
        this.goto("dashboard/");
    }

    private async sendCommand(type: SessionCommandType) {
        // todo set working state to true

        const apiRequest = async () => {
            const dbID = App.app().shard<DBSessionCacheShard>("db-session-cache").currentInfoData?.id;
            App.app().getConnector().call({
                protocol: "main",
                packetID: "SessionCommandPacketData",
                data: {
                    type: type,
                    raw: this.local.state.command,
                    attributes: new Map<string, string>(),
                    dbID: dbID
                } as SessionCommand,
                callback: {
                    handle: (connector1, packet) => {
                        this.local.setStateWithChannels({
                            processPushCommand: false,
                        }, ["*", "push-pull"]);
                    }
                }
            });
        };

        switch (type) {
            case SessionCommandType.PULL:
                this.local.setState({
                    processPullCommand: true,
                    error: undefined
                }, new Map([["channels", ["*", "push-pull", "error"]]]), () => apiRequest());
                break;
            case SessionCommandType.PUSH:
                this.local.setState({
                    processPushCommand: true,
                    error: undefined
                }, new Map([["channels", ["*", "push-pull", "error"]]]), () => apiRequest());
                break;
        }

        // setTimeout(() => {
        //     switch (type) {
        //         case SessionCommandType.PULL:
        //             this.local.setState({
        //                 processPullCommand: false
        //             }, new Map([["channels", ["*", "push-pull"]]]));
        //             break;
        //         case SessionCommandType.PUSH:
        //             this.local.setState({
        //                 processPushCommand: false
        //             }, new Map([["channels", ["*", "push-pull"]]]));
        //             break;
        //     }
        // }, 10000);
    }

    // noinspection JSMethodCanBeStatic
    private renderSessionUndefinedErrorPage() {
        return (
            <Screen>
                <Centered fullHeight={true}>
                    <Box visualMeaning={ObjectVisualMeaning.ERROR} opaque={true}>
                        <FlexBox flexDir={FlexDirection.ROW} align={Align.CENTER} justifyContent={Justify.CENTER}>
                            <Icon icon={<ErrorIcon/>} visualMeaning={ObjectVisualMeaning.ERROR} colored={true}/>
                            <FlexBox>
                                <Text text={"Error while rendering dashboard"} type={TextType.smallHeader}/>
                                {/* todo change link */}
                                <Text text={"Session data is undefined, but shouldn't be undefined\nThis error can be caused by reloading the editor page. Its not a bug, but a yet un-implemented feature.\nIf you still think, this might be an error, contact the project administrator [here](mailto:name@email.com)"}/>
                                <Text text={"**Goto dashboard**"}
                                      type={TextType.secondaryDescription} visualMeaning={ObjectVisualMeaning.ERROR}
                                      uppercase={true}
                                      cursor={Cursor.pointer}
                                      coloredText={true}
                                      highlight={true}
                                      enableLeftAppendix={true}
                                      onClick={() => this.goto("/dashboard")}
                                      leftAppendix={<Icon icon={<RedirectIcon/>} visualMeaning={ObjectVisualMeaning.ERROR} colored={true}/>}
                                />
                            </FlexBox>
                        </FlexBox>
                    </Box>
                </Centered>
            </Screen>
        );
    }

    private renderDialog(): JSX.Element {
        const theme: Themeable.Theme = utilizeGlobalTheme();

        if (this.state.openMainDialog) {
            return (
                <Dialog open={this.state.openMainDialog} onClose={() => this.setState({
                    openMainDialog: false
                })} TransitionComponent={this.DialogTransition} fullScreen sx={{
                    '& .MuiDialog-paper': {
                        backgroundColor: theme.colors.backgroundColor.css()
                    }
                }}>{
                    this.assembly.render({
                        component: this.state.dialogComponent as string,
                    }
                )}</Dialog>
            );
        } else return <></>
    }

    private renderDBHistory(): JSX.Element {
        const theme: Themeable.Theme = utilizeGlobalTheme();

        /*
        <DBTask data={{
            timestamp: new Date(),
            client: {
                type: ClientType.USER,
                id: v4(),
                username: "root"
            }
        }}/>
         */
        // height={percent(100)}
        return (
            <Box height={percent(100)} gapY={theme.gaps.smallGab} overflowYBehaviour={OverflowBehaviour.SCROLL} width={percent(100)}>
                <DBTaskCard/>
                <DBTaskCard/>
                <DBTaskCard/>
                <FlexBox gap={theme.gaps.smallGab} overflowYBehaviour={OverflowBehaviour.SCROLL} children={arrayFactory(() => (
                    <RoadmapEntry status={"completed"} children={
                        <Text text={"Hallo world! this is a message."}/>
                    }/>
                ), 0)}/>
            </Box>
        );
    }

    private renderHistoryButton(): JSX.Element {
        const theme = utilizeGlobalTheme();

        return this.component(local => {
            return (
                <CustomTooltip arrow title={<Text text={"Show SQL result history **[v2]**"}/>}>
                <span>
                    {
                        this.local.state.sqlCommandResultCache.length > 0 ? (
                            <Button
                                cursor={Cursor.pointer}
                                visualMeaning={ObjectVisualMeaning.UI_NO_HIGHLIGHT}
                                opaque
                                shrinkOnClick={true}
                                onClick={() => {

                                    this.local.setStateWithChannels({
                                        processSQLResultOpening: true
                                    }, ["history-button"], () => {
                                        setTimeout(() => {
                                            this.setState({
                                                openMainDialog: true,
                                                dialogComponent: "sql-command-result-v2"
                                            }, () => {
                                                this.local.setStateWithChannels({
                                                    processSQLResultOpening: false
                                                }, ["history-button"]);
                                            });
                                        }, 1);
                                    })

                                    // this.setState({
                                    //     openMainDialog: true,
                                    //     dialogComponent: "sql-command-result-v2"
                                    // })
                                }}>
                                <FlexBox flexDir={FlexDirection.ROW} gap={theme.gaps.smallGab}>
                                    <If condition={this.local.state.processSQLResultOpening} ifTrue={
                                        <FlexBox align={Align.CENTER} justifyContent={Justify.CENTER} width={px(20)} height={px(20)}>
                                            <CircularProgress variant={"indeterminate"} size={16} sx={{
                                                color: theme.colors.primaryHighlightColor.css()
                                            }}/>
                                        </FlexBox>
                                    } ifFalse={
                                        <Icon visualMeaning={ObjectVisualMeaning.INFO} colored icon={<TableIcon/>}/>
                                    }/>
                                    <Text text={`${this.local.state.sqlCommandResultCache.length}`} bold visualMeaning={ObjectVisualMeaning.INFO} coloredText/>
                                </FlexBox>
                            </Button>
                        ) : (
                            <Button
                                cursor={Cursor.notAllowed}
                                opaque
                                visualMeaning={ObjectVisualMeaning.UI_NO_HIGHLIGHT}>
                                <FlexBox flexDir={FlexDirection.ROW} gap={theme.gaps.smallGab}>
                                    <Icon visualMeaning={ObjectVisualMeaning.UI_NO_HIGHLIGHT} colored icon={<TableIcon/>}/>
                                    <Text text={"v2"} bold visualMeaning={ObjectVisualMeaning.UI_NO_HIGHLIGHT} coloredText/>
                                </FlexBox>
                            </Button>
                        )
                    }
                </span>
                </CustomTooltip>
            );
        }, "error", "history-button")
    }

    private renderEditor(session: ProjectInfoData) {
        const theme: Themeable.Theme = utilizeGlobalTheme();

        return (
            <Screen>
                {this.renderDialog()}
                <FlexBox height={percent(100)} flexDir={FlexDirection.COLUMN} gap={theme.gaps.defaultGab} overflowXBehaviour={OverflowBehaviour.VISIBLE} overflowYBehaviour={OverflowBehaviour.VISIBLE} justifyContent={Justify.SPACE_BETWEEN}>
                    {this.component(local => this.assembly.render({
                        component: "header",
                        param: session
                    }), "header")}
                    <Separator/>
                    {this.component(local => this.assembly.liteRender("main"), "main")}
                    <Separator orientation={Orientation.HORIZONTAL}/>
                    {this.component(local => this.assembly.liteRender("input"), "input")}
                </FlexBox>
            </Screen>
        );
    }

    private createCommandSnapshot(type: SavedCommandType): void {
        const cmd = this.local.state.command;
        if (cmd.trim().length > 0) {
            this.local.state.savedCommands.push({
                command: cmd,
                type: type
            });
        }
    }

    componentDidMount() {
        App.app().triggerLoginIfNotLoggedIn({});
    }

    componentRender(p: DebugEditorProps, s: DebugEditorState, l: DebugEditorLocalState, t: Themeable.Theme, a: Assembly): JSX.Element | undefined {
        const session: ProjectInfoData | undefined = App.app().shard<DBSessionCacheShard>("db-session-cache").currentInfoData;
        return (
            <RedirectController redirect={this.state.redirect} data={{
                to: this.state.to
            }}>
                {session === undefined ? this.renderSessionUndefinedErrorPage() : this.renderEditor(session)}
            </RedirectController>
        );
    }
}
