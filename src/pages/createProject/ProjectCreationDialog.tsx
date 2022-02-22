import React from "react";
import {Text} from "../../components/Text";
import {PageV2} from "../../components/Page";
import {AppHeader} from "../../components/AppHeader";
import {FlexBox} from "../../components/FlexBox";
import {percent, px} from "../../logic/style/DimensionalMeasured";
import {Button} from "../../components/Button";
import {ObjectVisualMeaning} from "../../logic/ObjectVisualMeaning";
import {ReactComponent as SuccessIcon} from "../../assets/icons/ic-16/ic16-check.svg";
import {ReactComponent as CloseIcon} from "../../assets/icons/ic-20/ic20-close.svg";
import {ReactComponent as ErrorIcon} from "../../assets/icons/ic-16/ic16-close.svg";
import {ReactComponent as MDIcon} from "../../assets/icons/markdown-icon.svg";
import {ReactComponent as Logo} from "../../assets/logo.svg";
import {Input} from "../../components/Input";
import {cs} from "../../logic/state/State";
import {RenderController} from "../../tests/regex/RenderController";
import {getOr} from "../../logic/Utils";
import {Icon} from "../../components/Icon";
import {App, utilizeGlobalTheme} from "../../logic/App";
import {LiteGrid} from "../../components/LiteGrid";
import {FlexDirection} from "../../logic/style/FlexDirection";
import styled from "styled-components";
import {Themeable} from "../../Themeable";
import {RenderExecutor} from "../../tests/regex/RenderExecutor";
import {v4} from "uuid";
import {ProjectCreateRequestPacketData} from "../../packets/out/ProjectCreateRequestPacketData";
import {TextArea} from "../../components/TextArea";
import {Justify} from "../../logic/style/Justify";
import {Box} from "../../components/Box";
import {Separator} from "../../components/Separator";
import _ from "lodash";
import {CheckProjectExistenceResponsePacketData} from "../../packets/in/CheckProjectExistenceResponsePacketData";
import {handleProxy} from "../../logic/net/ConditionalPacketHandlingUtils";
import {Environment} from "../../logic/Environment";
import {If} from "../../components/If";
import {Cursor} from "../../logic/style/Cursor";

export type ProjectCreationDialogLocalState = {
    title: string,
    description: string,
    stator: boolean,
    updateProjectExistenceDebouncedFunc: (title: string) => void,
    projectDoesExist: boolean,
    dbFactoryID: string,
    dbFactoryParams: Map<String, object>,
    canSend: boolean,
    isProcessing: boolean,
    canSendEvaluateDebouncedFunc: () => void,
    renderMarkdown: boolean,
    updateDescriptionDebouncedFunc: (description: string) => void
}

export class ProjectCreationDialog extends React.Component<any, any> {

    private readonly local = cs<ProjectCreationDialogLocalState>({
        title: "",
        description: "",
        stator: false,
        updateProjectExistenceDebouncedFunc: _.debounce((title: string) => {
            this.debouncedUpdateProjectExistence(title);
        }, 1000),
        projectDoesExist: false,
        dbFactoryID: "def-db-factory",
        dbFactoryParams: new Map<String, object>(),
        canSend: false,
        canSendEvaluateDebouncedFunc: _.debounce(() => {
            this.debouncedEvaluateCanSendStatus();
        }, 500),
        isProcessing: false,
        renderMarkdown: false,
        updateDescriptionDebouncedFunc: _.debounce((description: string) => {
            this.debouncedDescriptionUpdate(description);
        }, 500),
    });

    private readonly controller = new RenderController();

    constructor(params: any) {
        super(params);
        this.local.on((state, value) => {
            this.controller.rerender(...getOr(value.get("channels"), ["*"]));
        });
    }

    private debouncedEvaluateCanSendStatus() {
        const ls = this.local.state;
        let canSend = true;
        if (ls.isProcessing) {
            canSend = false;
        }
        if (ls.projectDoesExist) {
            canSend = false;
        }
        if ((/^\s*$/).test(ls.title)) {
            console.error("title is empty");
            canSend = false;
        }
        this.local.setState({
            canSend: canSend
        }, new Map<string, any>([["channels", ["can-send"]]]));
    }

    private debouncedDescriptionUpdate(description: string) {
        this.local.setState({
            description: description
        }, new Map<string, any>([["channels", ["description"]]]));
    }

    private toggleMarkdownPreview() {
        const local = this.local;
        local.setState({
            renderMarkdown: !local.state.renderMarkdown
        }, new Map<string, any>([["channels", ["description-md-preview"]]]));
    }

    private triggerSubmit() {
        const state = this.local.state;

        const handler: Environment.Handler = {
            handle: (connector, packet) => {
                handleProxy(packet, connector, {
                    id: "ProjectAlreadyExistException",
                    handle: (connector1, packet1) => {

                    }
                }, {
                    id: "ProjectCreateResponsePacketData",
                    handle: (connector1, packet1) => {
                        App.app().toggleMainDialog("closed");
                    }
                })
            }
        }

        const data: ProjectCreateRequestPacketData = {
            title: state.title,
            description: state.description,
            stator: state.stator,
            dbFactoryID: state.dbFactoryID,
            dbFactoryParams: state.dbFactoryParams
        }

        App.app().getConnector().call({
            protocol: "main",
            packetID: "ProjectCreateRequestPacketData",
            callback: handler,
            data: data
        });
    }

    private updateProjectExistence(title: string) {
        this.local.state.updateProjectExistenceDebouncedFunc(title);
    }

    private debouncedUpdateProjectExistence(title: string) {
        App.app().getConnector().call({
            protocol: "main",
            packetID: "CheckProjectExistenceRequestPacketData",
            data: {
                title: title
            },
            callback: {
                handle: (connector, packet) => {
                    const refinedPacket: CheckProjectExistenceResponsePacketData = packet.data as CheckProjectExistenceResponsePacketData;
                    this.local.setState({
                        projectDoesExist: refinedPacket.doesExist
                    }, new Map([["channels", ["title-header"]]]), () => {
                        this.debouncedEvaluateCanSendStatus();
                    });
                }
            }
        });
    }

    // noinspection JSMethodCanBeStatic
    private renderTitleAnnotation(): JSX.Element {
        return (
            <RenderExecutor id={v4()} channels={["*", "title-header"]} componentDidMountRelay={bridge => this.controller.register(bridge)} componentFactory={() => (
                <FlexBox flexDir={FlexDirection.ROW_REVERSE}>
                    {
                        this.local.state.projectDoesExist ? (
                            <Text
                                leftAppendix={(
                                    <Icon visualMeaning={ObjectVisualMeaning.ERROR} icon={<ErrorIcon/>} colored={true}/>
                                )}
                                enableLeftAppendix={true}
                                visualMeaning={ObjectVisualMeaning.ERROR}
                                coloredText={true}
                                text={"Project already exists"}
                            />
                        ) : (
                            <Text
                                leftAppendix={(
                                    <Icon visualMeaning={ObjectVisualMeaning.SUCCESS} icon={<SuccessIcon/>} colored={true}/>
                                )}
                                enableLeftAppendix={true}
                                visualMeaning={ObjectVisualMeaning.SUCCESS}
                                coloredText={true}
                                text={"Valid"}
                            />
                        )
                    }
                </FlexBox>
            )}/>
        );
    }

    render() {
        const theme: Themeable.Theme = utilizeGlobalTheme();
        const Form = styled.form`
          display: flex;
          flex-direction: column;
          gap: ${theme.gaps.smallGab.css()};
          width: 100%;
        `;

        return (
            <PageV2>
                <LiteGrid rows={4} height={percent(100)}>
                    <AppHeader
                        left={(
                            <Icon icon={<Logo/>} size={px(24)}/>
                        )}
                        title={"Create Project"}
                        right={(
                            <Icon icon={<CloseIcon/>} onClick={() => App.app().callAction("close-main-dialog")}/>
                        )}
                    />

                    <span/>
                    <span/>

                    <FlexBox flexDir={FlexDirection.COLUMN_REVERSE} height={percent(100)}>
                        <Form>
                            <FlexBox flexDir={FlexDirection.ROW} justifyContent={Justify.SPACE_BETWEEN}>
                                <Text text={"Choose a title"}/>
                                {this.renderTitleAnnotation()}
                            </FlexBox>
                            <Input fontWeight={"lighter"} label={"Title"} placeholder={"SQL-Editor"} onChange={ev => this.local.setState({
                                title: ev.target.value
                            }, new Map([["channels", ["*", "title"]]]), () => {
                                this.local.state.canSendEvaluateDebouncedFunc();
                                this.updateProjectExistence(ev.target.value);
                            })}/>

                            <FlexBox flexDir={FlexDirection.ROW} justifyContent={Justify.SPACE_BETWEEN}>
                                <Text text={"Add a description *(Optional)*"}/>
                                <RenderExecutor id={v4()} channels={["description-md-preview"]} componentDidMountRelay={bridge => this.controller.register(bridge)} componentFactory={() => (
                                    <If condition={this.local.state.renderMarkdown} ifTrue={
                                        <Icon icon={<MDIcon/>} visualMeaning={ObjectVisualMeaning.INFO} colored={true} onClick={() => this.toggleMarkdownPreview()}/>
                                    } ifFalse={
                                        <Icon icon={<MDIcon/>} visualMeaning={ObjectVisualMeaning.UI_NO_HIGHLIGHT} colored={true} onClick={() => this.toggleMarkdownPreview()}/>
                                    }/>
                                )}/>
                            </FlexBox>

                            <RenderExecutor id={v4()} channels={["description-md-preview"]} componentDidMountRelay={bridge => this.controller.register(bridge)} componentFactory={() => (
                                <If condition={this.local.state.renderMarkdown}
                                    ifTrue={
                                        <Box width={percent(100)} gapY={theme.gaps.smallGab}>
                                            <Text text={"**Description markdown preview**"}/>
                                            <Separator/>
                                            <RenderExecutor id={v4()} channels={["*", "description"]} componentDidMountRelay={bridge => this.controller.register(bridge)} componentFactory={() => (
                                                <Text text={this.local.state.description}/>
                                            )}/>
                                        </Box>
                                    }
                                    ifFalse={
                                        <></>
                                    }
                                />
                            )}/>

                            <TextArea fontWeight={"lighter"} label={"Description"} placeholder={"Add a description"} onChange={ev => this.local.state.updateDescriptionDebouncedFunc(ev.target.value)}/>

                            {/*<Text text={"Project is stator"}/>
                            <RenderExecutor id={v4()} channels={["stator"]} componentDidMountRelay={bridge => this.controller.register(bridge)} componentFactory={() => (
                                <Switch checked={this.local.state.stator} onChange={(event, checked) => this.local.setState({
                                    stator: checked
                                }, new Map([["channels", ["stator"]]]))}/>
                            )}/>*/}

                            <RenderExecutor id={v4()} channels={["*", "can-send"]} componentDidMountRelay={bridge => this.controller.register(bridge)} componentFactory={() => (
                                <If condition={this.local.state.canSend} ifTrue={
                                    <Button width={percent(100)} cursor={Cursor.pointer} visualMeaning={ObjectVisualMeaning.INFO} opaque={true} onClick={() => this.triggerSubmit()}>
                                        <Text text={"Create project"}/>
                                    </Button>
                                } ifFalse={
                                    <Button width={percent(100)} visualMeaning={ObjectVisualMeaning.UI_NO_HIGHLIGHT} opaque={true}>
                                        <Text enableLeftAppendix cursor={Cursor.notAllowed} leftAppendix={
                                            <Icon icon={<ErrorIcon/>} colored visualMeaning={ObjectVisualMeaning.ERROR}/>
                                        } text={"Cannot create project"}/>
                                    </Button>
                                }/>
                            )}/>
                        </Form>
                    </FlexBox>
                </LiteGrid>
            </PageV2>
        );
    }
}
