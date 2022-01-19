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
import {Task} from "../../../components/Task";
import {Themeable} from "../../../Themeable";
import {SessionCommand} from "../../../logic/data/SessionCommand";
import {getOr} from "../../../logic/Utils";
import {RenderController} from "../../../tests/regex/RenderController";
import {RenderExecutor} from "../../../tests/regex/RenderExecutor";

export type DebugEditorProps = {
}

export type DebugEditorState = {
    redirect: boolean,
    to: string
}

export type DebugEditorLocalState = {
    command: string,
    processingCommand: boolean
}

export class DebugEditor extends React.Component<DebugEditorProps, DebugEditorState> {

    private readonly local = cs<DebugEditorLocalState>({
        command: "",
        processingCommand: false
    });

    private readonly controller = new RenderController();

    constructor(props: DebugEditorProps) {
        super(props);
        this.state = {
            redirect: false,
            to: "/"
        };
        this.local.on((state, value) => {
            this.controller.rerender(...getOr(value.get("channels"), ["*"]));
        });
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

    private sendCommand(type: string) {
        // todo set working state to true
        this.local.setState({
            processingCommand: true
        }, new Map([["channels", ["processing-command"]]]));

        App.app().connector(connector => {

            connector.call({
                // todo check protocol name
                protocol: "main",
                // todo create java counterpart & check packet id name
                packetID: "SessionCommandPacket",
                data: {
                    type: type,
                    raw: this.local.state.command,
                    attributes: new Map<string, string>()
                } as SessionCommand,
                callback: {
                    handle: (connector1, packet) => {
                        // todo cast packet to useful d-type

                        // todo set local working state to false
                        this.local.setState({
                            processingCommand: false
                        }, new Map([["channels", ["processing-command"]]]));
                    }
                }
            });
        });
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
                <FlexBox height={percent(100)} flexDir={FlexDirection.COLUMN} justifyContent={Justify.SPACE_BETWEEN}>
                    <FlexBox width={percent(100)}>
                        <LiteGrid columns={3}>
                            <FlexBox align={Align.START} justifyContent={Justify.CENTER}>
                                <Icon icon={<MenuIcon/>} onClick={() => App.app().openMenu()}/>
                            </FlexBox>
                            <FlexBox align={Align.CENTER} justifyContent={Justify.CENTER}>
                                <Text uppercase align={Align.CENTER} type={TextType.smallHeader} text={"Debug Editor"} />
                            </FlexBox>
                            <FlexBox align={Align.END} justifyContent={Justify.CENTER}>
                                <Text
                                    highlight={true}
                                    text={"Close editor"}
                                    uppercase={true}
                                    visualMeaning={ObjectVisualMeaning.INFO}
                                    coloredText={true}
                                    cursor={Cursor.pointer}
                                    onClick={() => this.closeSession()}
                                />
                            </FlexBox>
                        </LiteGrid>
                        <Text text={session.title} type={TextType.smallHeader}/>
                    </FlexBox>

                    <FlexBox width={percent(100)} height={percent(90)} overflowYBehaviour={OverflowBehaviour.SCROLL} justifyContent={Justify.FLEX_END}>

                        <Box width={percent(100)} gapY={theme.gaps.defaultGab}>
                            <Text text={"Edits"}/>

                            <Task task={{
                            }}/>
                        </Box>

                        <RenderExecutor
                            id={v4()}
                            channels={["*", "command"]}
                            componentDidMountRelay={bridge => this.controller.register(bridge)}
                            componentFactory={() => (
                                <Text text={this.local.state.command}/>
                            )}
                        />

                        <CodeEditor
                            theme={"dark"}
                            classnames={["cm"]}
                            debounce={true}
                            value={this.local.state.command} placeholder={"select * from Users"}
                            extensions={[
                                sql()
                            ]}
                            upstreamHook={value => this.local.setState({
                                command: value
                            })}
                        />

                    </FlexBox>
                </FlexBox>
            </PageV2>
        );
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
