import React from "react";
import {PageV2} from "../../../components/Page";
import {LiteGrid} from "../../../components/LiteGrid";
import {FlexBox} from "../../../components/FlexBox";
import {Align} from "../../../logic/Align";
import {Justify} from "../../../logic/Justify";
import {Icon} from "../../../components/Icon";
import {ReactComponent as MenuIcon} from "../../../assets/icons/ic-20/ic20-menu.svg";
import {ReactComponent as ErrorIcon} from "../../../assets/icons/ic-20/ic20-alert.svg";
import {ReactComponent as RedirectIcon} from "../../../assets/icons/ic-20/ic20-arrow-right.svg";
import {ReactComponent as PushIcon} from "../../../assets/icons/ic-20/ic20-upload.svg";
import {ReactComponent as PullIcon} from "../../../assets/icons/ic-20/ic20-download.svg";
import {App, utilizeGlobalTheme} from "../../../logic/App";
import {Text, TextType} from "../../../components/Text";
import {DBSessionCacheShard} from "../../../shards/DBSessionCacheShard";
import {percent} from "../../../logic/DimensionalMeasured";
import {Box} from "../../../components/Box";
import {ObjectVisualMeaning} from "../../../logic/ObjectVisualMeaning";
import {Cursor} from "../../../logic/style/Cursor";
import {RedirectController} from "../../../components/RedirectController";
import {ProjectInfoData} from "../../../logic/ProjectInfoData";
import {PosInCenter} from "../../../components/PosInCenter";
import {FlexDirection} from "../../../logic/FlexDirection";
import {CodeEditor} from "../../../components/CodeEditor";
import {cs} from "../../../logic/state/State";
import {v4} from "uuid";
import {sql} from "@codemirror/lang-sql";
import {OverflowBehaviour} from "../../../logic/OverflowBehaviour";
import {Themeable} from "../../../Themeable";
import {SessionCommand} from "../../../logic/data/SessionCommand";
import {getOr} from "../../../logic/Utils";
import {RenderController} from "../../../tests/regex/RenderController";
import {RenderExecutor} from "../../../tests/regex/RenderExecutor";
import {Button} from "../../../components/Button";
import {LoadState} from "../../../logic/LoadState";
import {CircularProgress, Zoom} from "@mui/material";
import {Assembly} from "../../../logic/Assembly";
import {SessionCommandType} from "../../../logic/data/SessionCommandType";
import {CustomTooltip} from "../../../components/CustomTooltip";

export type DebugEditorProps = {
}

export type DebugEditorState = {
    redirect: boolean,
    to: string
}

export type DebugEditorLocalState = {
    command: string,
    processPushCommand: boolean,
    processPullCommand: boolean,
}

export class DebugEditor extends React.Component<DebugEditorProps, DebugEditorState> {

    private readonly local = cs<DebugEditorLocalState>({
        command: "show tables from information_schema",
        processPullCommand: false,
        processPushCommand: false
    });

    private readonly controller = new RenderController();

    private readonly assembly: Assembly;

    private projectStaticData?: ProjectInfoData;

    constructor(props: DebugEditorProps) {
        super(props);
        this.state = {
            redirect: false,
            to: "/"
        };
        this.local.on((state, value) => {
            console.log("rerender")
            this.controller.rerender(...getOr(value.get("channels"), ["*"]));
        });

        this.assembly = new Assembly().assembly("push-pull-button", (theme, props1) => {
            const localState = this.local.state;
            const working: boolean = localState.processPushCommand || localState.processPullCommand;
            return (
                <>
                    <CustomTooltip noBorder arrow title={(
                        <Text text={"**Update**\n Update something in the database"}/>
                    )} TransitionComponent={Zoom}>
                        <span>
                            <Button visualMeaning={working ? ObjectVisualMeaning.UI_NO_HIGHLIGHT : ObjectVisualMeaning.INFO} opaque={true} onClick={() => this.sendCommand(SessionCommandType.PUSH)}>{
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
                            <Button visualMeaning={working ? ObjectVisualMeaning.UI_NO_HIGHLIGHT : ObjectVisualMeaning.INFO} opaque={true} onClick={() => this.sendCommand(SessionCommandType.PULL)}>{
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

    /**
     * todo convert from singleton to call -> and display a badge in the editors menu displaying the current
     *  streaming state (DB streaming online | DB streaming offline)
     *
     * Ask the server to add this client to its database-client lookup table.
     * This results in the server broadcasting database actions to this client
     */
    private requestServerDBActionStream() {
        if (this.projectStaticData !== undefined) {
            App.app().connector(connector => connector.singleton({
                protocol: "main",
                packetID: "SqlCommandStreamRequestPacketData",
                data: {
                    projectID: this.projectStaticData?.id
                }
            }));
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

        App.app().connector(connector => {
            connector.call({
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
            <PageV2>
                <PosInCenter fullHeight={true}>
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
                </PosInCenter>
            </PageV2>
        );
    }

    private renderEditor(session: ProjectInfoData) {
        const theme: Themeable.Theme = utilizeGlobalTheme();
        return (
            <PageV2>
                <FlexBox height={percent(100)} flexDir={FlexDirection.COLUMN} overflowXBehaviour={OverflowBehaviour.VISIBLE} overflowYBehaviour={OverflowBehaviour.VISIBLE} justifyContent={Justify.SPACE_BETWEEN}>
                    <FlexBox width={percent(100)}>
                        <LiteGrid columns={3}>
                            <FlexBox align={Align.START} justifyContent={Justify.CENTER}>
                                <Icon icon={<MenuIcon/>} onClick={() => App.app().openMenu()}/>
                            </FlexBox>
                            <FlexBox align={Align.CENTER} justifyContent={Justify.CENTER}>
                                <Text uppercase align={Align.CENTER} type={TextType.smallHeader} text={"Debug Editor"} />
                            </FlexBox>
                            <FlexBox align={Align.CENTER} justifyContent={Justify.FLEX_END} flexDir={FlexDirection.ROW}>
                                <Text
                                    highlight={true}
                                    text={"Close editor"}
                                    uppercase={true}
                                    visualMeaning={ObjectVisualMeaning.INFO}
                                    coloredText={true}
                                    cursor={Cursor.pointer}
                                    onClick={() => this.closeSession()}
                                />
                                <Text
                                    highlight={true}
                                    visualMeaning={ObjectVisualMeaning.WARNING}
                                    text={"**[debug]** Boarding"}
                                    uppercase={true}
                                    cursor={Cursor.pointer}
                                    onClick={() => this.redirect("/")}
                                />
                            </FlexBox>
                        </LiteGrid>
                        <Text text={session.title} type={TextType.smallHeader}/>
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
                                theme={"dark"}
                                classnames={["cm"]}
                                debounce={true}
                                debounceMS={300}
                                value={this.local.state.command}
                                placeholder={"select * from Users"}
                                extensions={[
                                    sql()
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
            </PageV2>
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
