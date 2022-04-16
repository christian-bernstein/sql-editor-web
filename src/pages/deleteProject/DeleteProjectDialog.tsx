import {BernieComponent} from "../../logic/BernieComponent";
import {Themeable} from "../../logic/style/Themeable";
import {Assembly} from "../../logic/assembly/Assembly";
import {ProjectInfoData} from "../../logic/data/ProjectInfoData";
import {PageV2} from "../../components/lo/Page";
import {AppHeader} from "../../components/lo/AppHeader";
import {Icon} from "../../components/lo/Icon";
import {ReactComponent as CloseIcon} from "../../assets/icons/ic-20/ic20-close.svg";
import React from "react";
import {PosInCenter} from "../../components/lo/PosInCenter";
import {FlexBox} from "../../components/lo/FlexBox";
import {FlexDirection} from "../../logic/style/FlexDirection";
import {Justify} from "../../logic/style/Justify";
import {InformationBox} from "../../components/ho/informationBox/InformationBox";
import {ObjectVisualMeaning} from "../../logic/style/ObjectVisualMeaning";
import {Text, TextType} from "../../components/lo/Text";
import {App} from "../../logic/app/App";
import {percent} from "../../logic/style/DimensionalMeasured";
import {Button} from "../../components/lo/Button";
import {Cursor} from "../../logic/style/Cursor";
import {Input} from "../../components/lo/Input";
import {If} from "../../components/logic/If";
import {Align} from "../../logic/style/Align";
import {ProjectDeleteRequestPacketData} from "../../packets/out/ProjectDeleteRequestPacketData";

export type DeleteProjectDialogProps = {
    project: ProjectInfoData,
    // todo implement
    onProjectDeleteCompleted?: () => void
}

export type DeleteProjectDialogLocalState = {
    confirmationValue: string,
    confirmed: boolean
}

export class DeleteProjectDialog extends BernieComponent<DeleteProjectDialogProps, any, DeleteProjectDialogLocalState> {

    constructor(props: DeleteProjectDialogProps) {
        super(props, undefined, {
            confirmationValue: "",
            confirmed: false
        });
    }

    private renderHeader(): JSX.Element {
        return (
            <AppHeader title={"Delete project"} right={(
                <Icon icon={<CloseIcon/>} onClick={() => App.app().callAction("close-main-dialog")}/>
            )}/>
        );
    }

    private updateConfirmationValue(value: string) {
        this.local.setState({
            confirmationValue: value,
            confirmed: value === this.props.project.title
        }, new Map<string, any>([[
            "channels", ["confirmation"]
        ]]));
    }

    private deleteProject() {
        App.use(app => {
            app.getConnector().call({
                protocol: "main",
                packetID: "ProjectDeleteRequestPacketData",
                data: {
                    id: this.props.project.id
                } as ProjectDeleteRequestPacketData,
                callback: {
                    handle: (connector, packet) => {
                        // handleProxy()
                    }
                }
            })
        });
        App.app().callAction("close-main-dialog");

        // todo move to connector call
        this.props.onProjectDeleteCompleted?.();
    }

    private renderBody(): JSX.Element {
        return (
            <PosInCenter fullHeight>
                <FlexBox height={percent(100)} width={percent(100)} flexDir={FlexDirection.COLUMN} justifyContent={Justify.SPACE_BETWEEN}>
                    <FlexBox width={percent(100)} justifyContent={Justify.CENTER} align={Align.CENTER}>
                        <InformationBox visualMeaning={ObjectVisualMeaning.WARNING}>
                            <Text text={"**Warning:** This action cannot be undone. This will permanently delete a project and its meta data."} visualMeaning={ObjectVisualMeaning.WARNING} coloredText/>
                        </InformationBox>
                    </FlexBox>
                    <FlexBox flexDir={FlexDirection.COLUMN} width={percent(100)}>
                        <Text type={TextType.smallHeader} text={`Are you sure you want to delete project *${this.props.project.title}.*`}/>
                        <Text text={`Please type the project's name to confirm`}/>
                        <Input label={"Project title"} placeholder={this.props.project.title} onChange={ev => {
                            this.updateConfirmationValue(ev.currentTarget.value)
                        }}/>
                        {this.component(() => (
                            <If condition={this.local.state.confirmed} ifTrue={
                                <Button visualMeaning={ObjectVisualMeaning.ERROR} opaque shrinkOnClick cursor={Cursor.pointer} width={percent(100)} onClick={() => this.deleteProject()}>
                                    <Text align={Align.CENTER} cursor={Cursor.pointer} text={"**I understand the consequences, delete project**"}/>
                                </Button>
                            } ifFalse={
                                <Button visualMeaning={ObjectVisualMeaning.UI_NO_HIGHLIGHT} opaque cursor={Cursor.notAllowed} width={percent(100)}>
                                    <Text align={Align.CENTER} cursor={Cursor.notAllowed} text={"**I understand the consequences, delete project**"} visualMeaning={ObjectVisualMeaning.UI_NO_HIGHLIGHT} coloredText/>
                                </Button>
                            }/>
                        ), "confirmation")}
                    </FlexBox>
                </FlexBox>
            </PosInCenter>
        );
    }

    componentRender(p: any, s: any, l: any, t: Themeable.Theme, a: Assembly): JSX.Element | undefined {
        return (
            <PageV2>
                {this.renderHeader()}
                {this.renderBody()}
            </PageV2>
        );
    }
}
