import React, {ForwardedRef} from "react";
import {Screen} from "../../../components/lo/Page";
import {LiteGrid} from "../../../components/lo/LiteGrid";
import {FlexBox} from "../../../components/lo/FlexBox";
import {Align} from "../../../logic/style/Align";
import {Justify} from "../../../logic/style/Justify";
import {Icon} from "../../../components/lo/Icon";
import {ReactComponent as MenuIcon} from "../../../assets/icons/ic-20/ic20-menu.svg";
import {ReactComponent as ErrorIcon} from "../../../assets/icons/ic-20/ic20-alert.svg";
import {ReactComponent as RedirectIcon} from "../../../assets/icons/ic-20/ic20-arrow-right.svg";
import {ReactComponent as PushIcon} from "../../../assets/icons/ic-20/ic20-upload.svg";
import {ReactComponent as PullIcon} from "../../../assets/icons/ic-20/ic20-download.svg";
import {ReactComponent as CloseIcon} from "../../../assets/icons/ic-20/ic20-close.svg";
import {ReactComponent as TableIcon} from "../../../assets/icons/ic-20/ic20-view-table.svg";
import {App, utilizeGlobalTheme} from "../../../logic/app/App";
import {Text, TextType} from "../../../components/lo/Text";
import {DBSessionCacheShard} from "../../../shards/dbSessionCache/DBSessionCacheShard";
import {percent, px} from "../../../logic/style/DimensionalMeasured";
import {Box} from "../../../components/lo/Box";
import {ObjectVisualMeaning} from "../../../logic/style/ObjectVisualMeaning";
import {Cursor} from "../../../logic/style/Cursor";
import {RedirectController} from "../../../components/logic/RedirectController";
import {ProjectInfoData} from "../../../logic/data/ProjectInfoData";
import {Centered} from "../../../components/lo/PosInCenter";
import {FlexDirection} from "../../../logic/style/FlexDirection";
import {CodeEditor} from "../../../components/lo/CodeEditor";
import {cs} from "../../../logic/state/State";
import {v4} from "uuid";
import {sql} from "@codemirror/lang-sql";
import {OverflowBehaviour} from "../../../logic/style/OverflowBehaviour";
import {Themeable} from "../../../logic/style/Themeable";
import {SessionCommand} from "../../../logic/data/SessionCommand";
import {getOr} from "../../../logic/Utils";
import {RenderController} from "../../../tests/regex/RenderController";
import {RenderExecutor} from "../../../tests/regex/RenderExecutor";
import {Button} from "../../../components/lo/Button";
import {LoadState} from "../../../logic/misc/LoadState";
import {CircularProgress, Dialog, Slide, Zoom} from "@mui/material";
import {Assembly} from "../../../logic/assembly/Assembly";
import {SessionCommandType} from "../../../logic/data/SessionCommandType";
import {CustomTooltip} from "../../../components/lo/CustomTooltip";
import {TransitionProps} from '@mui/material/transitions';
import {SQLCommandQueryResponsePacketData} from "../../../packets/in/SQLCommandQueryResponsePacketData";
import {DebugTableDataDisplayPage} from "../../../components/ho/tableDataDisplay/TableDataDisplay";
import {ServerConnectionIcon} from "../../../components/ho/serverConnectionIcon/ServerConnectionIcon";
import {Separator} from "../../../components/lo/Separator";
import {Orientation} from "../../../logic/style/Orientation";

import {oneDark} from '@codemirror/theme-one-dark';
import {HighlightStyle, tags} from "@codemirror/highlight"


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
    // todo SQLCommandQueryResponsePacketData | SQLCommandUpdateResponsePacketData
    sqlCommandResultCache: (SQLCommandQueryResponsePacketData)[]
}

/**
 * todo create 'acknowledge'-feature
 */
export class DebugEditor extends React.Component<DebugEditorProps, DebugEditorState> {

    private readonly DialogTransition = React.forwardRef((props: TransitionProps & {children?: React.ReactElement<any, any>}, ref: ForwardedRef<unknown>) => {
        return <Slide direction="up" ref={ref} {...props} />;
    });

    private readonly local = cs<DebugEditorLocalState>({
        command: "show tables from information_schema",
        processPullCommand: false,
        processPushCommand: false,
        sqlCommandResultCache: []
    });

    private readonly controller = new RenderController();

    private readonly assembly: Assembly;
    // noinspection TypeScriptFieldCanBeMadeReadonly

    private projectStaticData?: ProjectInfoData;

    constructor(props: DebugEditorProps) {
        super(props);
        this.state = {
            redirect: false,
            to: "/",
            openMainDialog: false
        };
        this.local.on((state, value) => {
            console.log("rerender")
            this.controller.rerender(...getOr(value.get("channels"), ["*"]));
        });
        this.assembly = new Assembly();
        this.initAssembly();
        this.initProtocolHandlers();
        const data = App.app().shard<DBSessionCacheShard>("db-session-cache").currentInfoData;
        if (data === undefined) {
            if (App.app().config.debugMode) {
                App.app().shard<DBSessionCacheShard>("db-session-cache").currentInfoData = {
                    internalTags: new Array("simulation"),
                    id: v4(),
                    creatorUserID: v4(),
                    title: "Debug session",
                    edits: 256,
                    stator: false,
                    lastEdited: new Date(),
                    state: LoadState.ONLINE,
                    description: "For debugging purposes"
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
        this.createPullPushAssembly();
        this.createSqlCommandResultAssembly();
    }

    private createPullPushAssembly() {
        this.assembly.assembly("push-pull-button", (theme, props1) => {
            const localState = this.local.state;
            const working: boolean = localState.processPushCommand || localState.processPullCommand;
            return (
                <>
                    <CustomTooltip noBorder arrow title={(
                        <Text text={"**Update**\n Update something in the database"}/>
                    )} TransitionComponent={Zoom}>
                        <span>
                            <Button visualMeaning={working ? ObjectVisualMeaning.UI_NO_HIGHLIGHT : ObjectVisualMeaning.INFO} opaque={true} onClick={() => {
                                if (!working) {
                                    this.sendCommand(SessionCommandType.PUSH);
                                }
                            }}>{
                                localState.processPushCommand ? (
                                    <CircularProgress variant={"indeterminate"} size={20} sx={{
                                        color: theme.colors.primaryHighlightColor.css()
                                    }}/>
                                ) : (
                                    <Icon visualMeaning={working ? ObjectVisualMeaning.UI_NO_HIGHLIGHT : ObjectVisualMeaning.INFO} colored={true} icon={<PushIcon/>}/>
                                )
                            }</Button>
                        </span>
                    </CustomTooltip>
                    <CustomTooltip noBorder arrow title={(
                        <Text text={"**Query**\n Query data from the database"}/>
                    )} TransitionComponent={Zoom}>
                        <span>
                            <Button visualMeaning={working ? ObjectVisualMeaning.UI_NO_HIGHLIGHT : ObjectVisualMeaning.INFO} opaque={true} onClick={() => {
                                if (!working) {
                                    this.sendCommand(SessionCommandType.PULL);
                                }
                            }}>{
                                localState.processPullCommand ? (
                                    <CircularProgress variant={"indeterminate"} size={20} sx={{
                                        color: theme.colors.primaryHighlightColor.css()
                                    }}/>
                                ) : (
                                    <Icon visualMeaning={working ? ObjectVisualMeaning.UI_NO_HIGHLIGHT : ObjectVisualMeaning.INFO} colored={true} icon={<PullIcon/>}/>
                                )
                            }</Button>
                        </span>
                    </CustomTooltip>
                </>
            )
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
            } else return <>Date is undefined</>;
        });
    }

    private initProtocolHandlers() {
        // todo check if component has unmounted -> don't execute the code then
        App.app().getConnector().registerProtocolPacketHandler("main", "SQLCommandQueryResponsePacketData", {
            handle: (connector1, packet) => {
                const data: SQLCommandQueryResponsePacketData = packet.data as SQLCommandQueryResponsePacketData;
                // todo check if response matches the currently mapped project
                const cache = this.local.state.sqlCommandResultCache;
                cache.push(data);
                this.local.setState({
                    sqlCommandResultCache: cache
                });
                this.openMainDialog("sql-command-result");

                this.local.setState({
                    processPullCommand: false,
                }, new Map([["channels", ["push-pull"]]]));
            }
        })
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

    private redirect(to: string) {
        this.setState({
            to: to,
            redirect: true
        });
    }

    private openMainDialog(dialogComponent: string) {
        this.setState({
            openMainDialog: true,
            dialogComponent: dialogComponent
        });
    }

    private closeSession() {
        this.redirect("/dashboard")
    }

    private sendCommand(type: SessionCommandType) {
        // todo set working state to true

        switch (type) {
            case SessionCommandType.PULL:
                this.local.setState({
                    processPullCommand: true
                }, new Map([["channels", ["push-pull"]]]));
                break;
            case SessionCommandType.PUSH:
                this.local.setState({
                    processPushCommand: true
                }, new Map([["channels", ["*", "push-pull"]]]));
                break;
        }

        App.app().getConnector().call({
            // todo check protocol name
            protocol: "main",
            // todo create java counterpart & check packet id name
            packetID: "SessionCommandPacketData",
            data: {
                type: type,
                raw: this.local.state.command,
                attributes: new Map<string, string>(),
                dbID: App.app().shard<DBSessionCacheShard>("db-session-cache").currentInfoData?.id

            } as SessionCommand,
            callback: {
                handle: (connector1, packet) => {
                    // todo cast packet to useful d-type

                    // todo set local working state to false
                    this.local.setState({
                        processPushCommand: false
                    }, new Map([["channels", ["*", "push-pull"]]]));
                }
            }
        });

        setTimeout(() => {
            switch (type) {
                case SessionCommandType.PULL:
                    this.local.setState({
                        processPullCommand: false
                    }, new Map([["channels", ["*", "push-pull"]]]));
                    break;
                case SessionCommandType.PUSH:
                    this.local.setState({
                        processPushCommand: false
                    }, new Map([["channels", ["*", "push-pull"]]]));
                    break;
            }
        }, 5000);
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
                                      onClick={() => this.redirect("/dashboard")}
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
                }}>
                    {
                        this.assembly.render({
                            // todo create fallback
                            component: this.state.dialogComponent as string,
                        })
                    }
                </Dialog>
            );
        } else return <></>
    }

    private renderEditor(session: ProjectInfoData) {
        const theme: Themeable.Theme = utilizeGlobalTheme();

        return (
            <Screen>
                {this.renderDialog()}

                <FlexBox height={percent(100)} flexDir={FlexDirection.COLUMN} overflowXBehaviour={OverflowBehaviour.VISIBLE} overflowYBehaviour={OverflowBehaviour.VISIBLE} justifyContent={Justify.SPACE_BETWEEN}>
                    <FlexBox width={percent(100)}>
                        <LiteGrid columns={3}>
                            <FlexBox align={Align.START} justifyContent={Justify.CENTER}>
                                <Icon icon={<MenuIcon/>} onClick={() => App.app().openMenu()}/>
                            </FlexBox>
                            <FlexBox align={Align.CENTER} justifyContent={Justify.CENTER}>
                                <Text uppercase align={Align.CENTER} type={TextType.smallHeader} text={"DB Editor"} />
                            </FlexBox>
                            <FlexBox align={Align.CENTER} justifyContent={Justify.FLEX_END} flexDir={FlexDirection.ROW} gap={theme.gaps.smallGab}>
                                <Icon icon={<CloseIcon/>} onClick={() => this.closeSession()}/>
                                <Separator orientation={Orientation.VERTICAL}/>
                                <ServerConnectionIcon/>
                            </FlexBox>
                        </LiteGrid>
                    </FlexBox>

                    <FlexBox flexDir={FlexDirection.ROW} align={Align.CENTER} gap={px(1)}>
                        <Text text={`${App.app().config.connectorConfig.address}/`}/>
                        <Box paddingY={px(2)} paddingX={px(4)} visualMeaning={ObjectVisualMeaning.UI_NO_HIGHLIGHT}>
                            <Text text={`**${session.title}**`}/>
                        </Box>
                    </FlexBox>

                    <Separator/>

                    <FlexBox flexDir={FlexDirection.ROW}>
                        <CustomTooltip arrow title={"Show SQL result history"}>
                            <span>
                                {
                                    this.local.state.sqlCommandResultCache.length > 0 ? (
                                        <Button
                                            cursor={Cursor.pointer}
                                            visualMeaning={ObjectVisualMeaning.UI_NO_HIGHLIGHT}
                                            shrinkOnClick={true}
                                            onClick={() => {
                                                this.setState({
                                                    openMainDialog: true
                                                })
                                            }}>
                                            <Icon visualMeaning={ObjectVisualMeaning.UI_NO_HIGHLIGHT} icon={<TableIcon/>}/>
                                        </Button>
                                    ) : (
                                        <Button
                                            cursor={Cursor.notAllowed}
                                            visualMeaning={ObjectVisualMeaning.UI_NO_HIGHLIGHT}>
                                            <Icon colored visualMeaning={ObjectVisualMeaning.UI_NO_HIGHLIGHT} icon={<TableIcon/>}/>
                                        </Button>
                                    )
                                }
                            </span>
                        </CustomTooltip>
                    </FlexBox>

                    <FlexBox width={percent(100)} height={percent(90)} overflowYBehaviour={OverflowBehaviour.VISIBLE} justifyContent={Justify.FLEX_END}>
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

                        <FlexBox flexDir={FlexDirection.ROW} width={percent(100)}>
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

                            <RenderExecutor
                                id={v4()}
                                componentDidMountRelay={bridge => this.controller.register(bridge)}
                                channels={["*", "push-pull"]}
                                componentFactory={() => this.assembly.render({
                                    component: "push-pull-button",
                                    param: ""
                                })}
                            />
                        </FlexBox>
                    </FlexBox>
                </FlexBox>
            </Screen>
        );
    }

    componentDidMount() {
        App.app().triggerLoginIfNotLoggedIn({});
    }

    render() {
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
