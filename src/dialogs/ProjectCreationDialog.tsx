import React from "react";
import {Text} from "../components/Text";
import {PageV2} from "../components/Page";
import {AppHeader} from "../components/AppHeader";
import {FlexBox} from "../components/FlexBox";
import {percent} from "../logic/DimensionalMeasured";
import {Button} from "../components/Button";
import {ObjectVisualMeaning} from "../logic/ObjectVisualMeaning";
import {ReactComponent as SuccessIcon} from "../assets/icons/ic-16/ic16-check.svg";
import {ReactComponent as CloseIcon} from "../assets/icons/ic-20/ic20-close.svg";
import {ReactComponent as ErrorIcon} from "../assets/icons/ic-16/ic16-close.svg";
import {ReactComponent as MDIcon} from "../assets/icons/markdown-icon.svg";
import {Input} from "../components/Input";
import {cs} from "../logic/state/State";
import {RenderController} from "../tests/regex/RenderController";
import {getOr} from "../logic/Utils";
import {Icon} from "../components/Icon";
import {App, utilizeGlobalTheme} from "../logic/App";
import {LiteGrid} from "../components/LiteGrid";
import {FlexDirection} from "../logic/FlexDirection";
import styled from "styled-components";
import {Themeable} from "../Themeable";
import {RenderExecutor} from "../tests/regex/RenderExecutor";
import {v4} from "uuid";
import {ProjectCreateRequestPacketData} from "../packets/out/ProjectCreateRequestPacketData";
import {Switch} from "@mui/material";
import {TextArea} from "../components/TextArea";
import {Justify} from "../logic/Justify";
import {Box} from "../components/Box";
import {Separator} from "../components/Separator";
import _ from "lodash";
import {CheckProjectExistenceResponsePacketData} from "../packets/in/CheckProjectExistenceResponsePacketData";

export type ProjectCreationDialogLocalState = {
    title: string,
    description: string,
    stator: boolean,
    updateProjectExistenceDebouncedFunc: (title: string) => void,
    projectDoesExist: boolean
}

export class ProjectCreationDialog extends React.Component<any, any> {

    private readonly local = cs<ProjectCreationDialogLocalState>({
        title: "",
        description: "",
        stator: false,
        updateProjectExistenceDebouncedFunc: _.debounce((title: string) => {
            this.debouncedUpdateProjectExistence(title);
        }, 1000),
        projectDoesExist: false
    });

    private readonly controller = new RenderController();

    constructor(params: any) {
        super(params);
        this.local.on((state, value) => {
            this.controller.rerender(...getOr(value.get("channels"), ["*"]));
        });
    }

    private triggerSubmit() {
        App.app().getConnector().call({
            protocol: "main",
            packetID: "ProjectCreateRequestPacketData",
            data: {
                title: this.local.state.title,
                description: this.local.state.description,
                stator: this.local.state.stator,
            } as ProjectCreateRequestPacketData,
            callback: {
                handle: (connector, packet) => {
                    // handle
                }
            }
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
                    }, new Map([["channels", ["title-header"]]]));
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
                        title={"Create Project"}
                        right={(
                            <Icon icon={<CloseIcon/>} onClick={() => App.app().callAction("close-main-dialog")}/>
                        )}
                    />

                    <Box width={percent(100)} gapY={theme.gaps.smallGab}>
                        <Text text={"**Description markdown preview**"}/>
                        <Separator/>
                        <RenderExecutor id={v4()} channels={["*", "description"]} componentDidMountRelay={bridge => this.controller.register(bridge)} componentFactory={() => (
                            <Text text={this.local.state.description}/>
                        )}/>
                    </Box>

                    <span/>

                    <FlexBox flexDir={FlexDirection.COLUMN_REVERSE} height={percent(100)}>
                        <Form>
                            <FlexBox flexDir={FlexDirection.ROW} justifyContent={Justify.SPACE_BETWEEN}>
                                <Text text={"Choose a title"}/>
                                {this.renderTitleAnnotation()}
                            </FlexBox>
                            <Input fontWeight={"lighter"} label={"Title"} placeholder={"SQL-Editor"} onChange={ev => this.local.setState({
                                title: ev.target.value
                            }, new Map([["channels", ["*", "title"]]]), () => this.updateProjectExistence(ev.target.value))}/>

                            <FlexBox flexDir={FlexDirection.ROW} justifyContent={Justify.SPACE_BETWEEN}>
                                <Text text={"Add a description *(Optional)*"}/>
                                <Icon icon={<MDIcon/>} visualMeaning={ObjectVisualMeaning.UI_NO_HIGHLIGHT} colored={true}/>
                            </FlexBox>

                            <TextArea fontWeight={"lighter"} label={"Description"} placeholder={"Add a description"} onChange={ev => this.local.setState({
                                description: ev.target.value
                            }, new Map([["channels", ["*", "description"]]]))}/>

                            {/*<Text text={"Project is stator"}/>
                            <RenderExecutor id={v4()} channels={["stator"]} componentDidMountRelay={bridge => this.controller.register(bridge)} componentFactory={() => (
                                <Switch checked={this.local.state.stator} onChange={(event, checked) => this.local.setState({
                                    stator: checked
                                }, new Map([["channels", ["stator"]]]))}/>
                            )}/>*/}

                            <Button width={percent(100)} visualMeaning={ObjectVisualMeaning.INFO} opaque={true} onClick={() => this.triggerSubmit()}>
                                <Text text={"Create project"}/>
                            </Button>
                        </Form>
                    </FlexBox>
                </LiteGrid>
            </PageV2>
        );
    }
}
