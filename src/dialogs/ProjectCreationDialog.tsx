import React from "react";
import {Text} from "../components/Text";
import {PageV2} from "../components/Page";
import {AppHeader} from "../components/AppHeader";
import {FlexBox} from "../components/FlexBox";
import {percent} from "../logic/DimensionalMeasured";
import {Button} from "../components/Button";
import {ObjectVisualMeaning} from "../logic/ObjectVisualMeaning";
import {ReactComponent as CloseIcon} from "../assets/icons/ic-20/ic20-close.svg";
import {Input} from "../components/Input";
import {cs} from "../logic/state/State";
import {RenderController} from "../tests/regex/RenderController";
import {getOr} from "../logic/Utils";
import {Icon} from "../components/Icon";
import {App} from "../logic/App";

export type ProjectCreationDialogLocalState = {
    title: string,
    description: string
}

export class ProjectCreationDialog extends React.Component<any, any> {

    private readonly local = cs<ProjectCreationDialogLocalState>({
        title: "",
        description: ""
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
            packetID: "~~",
            data: {
                // data
            },
            callback: {
                handle: (connector, packet) => {
                    // handle
                }
            }
        });
    }

    render() {
        return (
            <PageV2>
                <FlexBox height={percent(100)}>
                    <AppHeader
                        title={"Create Project"}
                        right={(
                            <Icon icon={<CloseIcon/>} onClick={() => App.app().callAction("close-main-dialog")}/>
                        )}
                    />
                    <Text text={"Choose a title"}/>
                    <Input label={"Title"} onChange={ev => this.local.setState({
                        title: ev.target.value
                    })}/>

                    <Text text={"Add a description *(Optional)*"}/>
                    <Input label={"Description"} onChange={ev => this.local.setState({
                        description: ev.target.value
                    })}/>

                    <Button width={percent(100)} visualMeaning={ObjectVisualMeaning.INFO} opaque={true} onClick={() => this.triggerSubmit()}>
                        <Text text={"Create project"}/>
                    </Button>
                </FlexBox>
            </PageV2>
        );
    }
}
