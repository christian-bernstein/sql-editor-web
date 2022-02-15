import {BernieComponent} from "../../logic/BernieComponent";
import {Themeable} from "../../Themeable";
import {Assembly} from "../../logic/Assembly";
import {ProjectInfoData} from "../../logic/ProjectInfoData";
import {PageV2} from "../../components/Page";
import {AppHeader} from "../../components/AppHeader";
import {Icon} from "../../components/Icon";
import {ReactComponent as CloseIcon} from "../../assets/icons/ic-20/ic20-close.svg";
import React from "react";
import {PosInCenter} from "../../components/PosInCenter";
import {FlexBox} from "../../components/FlexBox";
import {FlexDirection} from "../../logic/FlexDirection";
import {Justify} from "../../logic/Justify";
import {InformationBox} from "../../components/InformationBox";
import {ObjectVisualMeaning} from "../../logic/ObjectVisualMeaning";
import {Text, TextType} from "../../components/Text";
import {App} from "../../logic/App";
import {percent} from "../../logic/DimensionalMeasured";
import {Button} from "../../components/Button";
import {Cursor} from "../../logic/style/Cursor";
import {Input} from "../../components/Input";
import {If} from "../../components/If";
import {Align} from "../../logic/Align";

export type DeleteProjectDialogProps = {
    project: ProjectInfoData
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
                <Icon icon={<CloseIcon/>} onClick={() => App.app().toggleMainDialog("closed")}/>
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

        App.app().callAction("close-main-dialog");
    }

    private renderBody(): JSX.Element {
        return (
            <PosInCenter fullHeight>
                <FlexBox height={percent(100)} flexDir={FlexDirection.COLUMN} justifyContent={Justify.SPACE_BETWEEN}>
                    <FlexBox>
                        <InformationBox visualMeaning={ObjectVisualMeaning.WARNING}>
                            <Text text={"**Warning:** This action cannot be undone. This will permanently delete a project and its meta data."} visualMeaning={ObjectVisualMeaning.WARNING} coloredText/>
                        </InformationBox>
                    </FlexBox>
                    <FlexBox flexDir={FlexDirection.COLUMN}>
                        <Text type={TextType.smallHeader} text={`Are you sure you want to delete **${this.props.project.title}.**`}/>
                        <Text text={`Please type your SQLEditor username to confirm`}/>
                        <Input label={"Project title"} placeholder={this.props.project.title} onChange={ev => {
                            this.updateConfirmationValue(ev.currentTarget.value)
                        }}/>
                        {this.component(() => (
                            <If condition={this.local.state.confirmed} ifTrue={
                                <Button visualMeaning={ObjectVisualMeaning.ERROR} opaque shrinkOnClick cursor={Cursor.pointer} onClick={() => this.deleteProject()}>
                                    <Text align={Align.CENTER} cursor={Cursor.pointer} text={"**I understand the consequences, delete project**"}/>
                                </Button>
                            } ifFalse={
                                <Button visualMeaning={ObjectVisualMeaning.UI_NO_HIGHLIGHT} opaque cursor={Cursor.notAllowed}>
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
