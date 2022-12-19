import {BC} from "../../../logic/BernieComponent";
import {FormDataHub} from "../../../tests/epicure/components/FormDataHub";
import {Category} from "../data/Category";
import {Folder} from "../data/Folder";
import {Themeable} from "../../../logic/style/Themeable";
import {Assembly} from "../../../logic/assembly/Assembly";
import {Flex, FlexRow} from "../../../components/lo/FlexBox";
import {DrawerHeader} from "../../../components/lo/DrawerHeader";
import {VM} from "../../../logic/style/ObjectVisualMeaning";
import {percent, px} from "../../../logic/style/DimensionalMeasured";
import {Button} from "../../../components/lo/Button";
import {FormElement} from "../../../tests/epicure/components/FormElement";
import {Input} from "../../../components/lo/Input";
import {Group} from "../../../components/lo/Group";
import {Orientation} from "../../../logic/style/Orientation";
import {Align} from "../../../logic/style/Align";
import {Justify} from "../../../logic/style/Justify";
import {Tooltip} from "../../../components/ho/tooltip/Tooltip";
import {Icon} from "../../../components/lo/Icon";
import {ReactComponent as EditIcon} from "../../../assets/icons/ic-20/ic20-edit.svg";
import {StaticDrawerMenu} from "../../../components/lo/StaticDrawerMenu";
import {SettingsGroup} from "../../../components/lo/SettingsGroup";
import {SettingsElement} from "../../../components/ho/settingsElement/SettingsElement";
import {Text, TextType} from "../../../components/lo/Text";
import {Screen} from "../../../components/lo/Page";
import React from "react";
import {v4} from "uuid";
import {AtlasDocument} from "../data/AtlasDocument";
import {DocumentType} from "../data/DocumentType";
import {EnumSelector} from "../../../components/logic/EnumSelector";

export interface DocumentSetupDialogActions {
    onSubmit(document: AtlasDocument): boolean;
}

export type DocumentSetupDialogProps = {
    category: Category,
    actions: DocumentSetupDialogActions
}

export type DocumentSetupDialogLocalState = {
    fdh: FormDataHub
}

export class DocumentSetupDialog extends BC<DocumentSetupDialogProps, any, DocumentSetupDialogLocalState> {

    constructor(props: DocumentSetupDialogProps) {
        super(props, undefined, {
            fdh: new FormDataHub("DocumentSetupDialog").loadFromLocalStore()
        });
    }

    private createDocument() {
        // TODO: Only call action, if valid entries (unique title)

        this.props.actions.onSubmit({
            id: v4(),
            creationDate: new Date().toString(),
            note: this.local.state.fdh.get("note"),
            tags: this.local.state.fdh.get("tags"),
            title: this.local.state.fdh.get("title"),
            creator: this.local.state.fdh.get("creator"),
            description: this.local.state.fdh.get("description"),
            documentType: this.local.state.fdh.get("type", DocumentType.UNSPECIFIED),

            // TODO: Make changeable
            issuer: ""
        });
    }

    componentRender(p: DocumentSetupDialogProps, s: any, l: DocumentSetupDialogLocalState, t: Themeable.Theme, a: Assembly): JSX.Element | undefined {
        return (
            <Screen children={
                <Flex fw elements={[
                    <DrawerHeader
                        header={"Create document"}
                        enableBadge
                        badgeVM={VM.UI_NO_HIGHLIGHT}
                        badgeText={"Virtual folder system"}
                        description={"Create a new folder"}
                    />,

                    <Flex fw padding paddingX={px(25)} elements={[
                        <Button width={percent(100)} text={"Create document"} opaque visualMeaning={VM.INFO} onClick={() => {
                            this.createDocument();
                        }}/>
                    ]}/>,

                    <FormElement
                        id={"title"}
                        title={"Title"}
                        description={"The title / name of the document"}
                        fdh={this.local.state.fdh}
                        inputGenerator={(onChange, value, valid) => (
                            <Input placeholder={"Title"} defaultValue={value} onChange={ev => onChange(ev.target.value)}/>
                        )}
                    />,

                    <FormElement
                        id={"description"}
                        title={"Description"}
                        description={"A short description of the document's meaning"}
                        fdh={this.local.state.fdh}
                        inputGenerator={(onChange, value, valid) => (
                            <Input placeholder={"Description"} defaultValue={value} onChange={ev => onChange(ev.target.value)}/>
                        )}
                    />,

                    this.component((local) => (
                        <FormElement
                            id={"type"}
                            title={"Document-type"}
                            description={"The type of the document"}
                            fdh={local.state.fdh}
                            inputGenerator={(onChange, value, valid) => (
                                <Flex fw elements={[
                                    // TODO: make better design -> Group
                                    <Text text={`${value}`}/>,
                                    <Button width={percent(100)} text={"Choose type"} onClick={() => {
                                        // TODO: Create less 'dev-y' document type selector
                                        this.dialog(
                                            <EnumSelector from={DocumentType} onSubmit={element => {
                                                onChange(element);
                                                this.closeLocalDialog();
                                                this.rerender("type-input");
                                            }}/>
                                        );
                                    }}/>
                                ]}/>
                            )}
                        />
                    ), "type-input"),



                    <FormElement
                        id={"creator"}
                        title={"Creator"}
                        description={"Who created this document"}
                        fdh={this.local.state.fdh}
                        inputGenerator={(onChange, value, valid) => (
                            <Group removeChildBorders width={percent(100)} orientation={Orientation.HORIZONTAL} elements={[
                                <Input placeholder={"Creator"} defaultValue={value} onChange={ev => onChange(ev.target.value)}/>,

                                <Button height={percent(100)} width={px(50)} border={false} highlight={false} children={
                                    <Flex fh fw align={Align.CENTER} justifyContent={Justify.CENTER} elements={[
                                        <Tooltip sx={{ height: "100%", width: "100%"}} title={"Open editor"} arrow children={
                                            <Icon icon={<EditIcon/>}/>
                                        }/>
                                    ]}/>
                                } onClick={() => {
                                    this.dialog(
                                        <StaticDrawerMenu body={props => (
                                            <Flex fw elements={[
                                                <DrawerHeader
                                                    header={"Choose a creator"}
                                                    enableBadge
                                                    badgeVM={VM.UI_NO_HIGHLIGHT}
                                                    badgeText={"Folder setup"}
                                                    description={"Choose from an existing creator.\n*A creator is automatically registered, if a new folder, category or document is added, with a creator, that isn't yet registered.*"}
                                                />,

                                                <Flex fw padding paddingX={px(25)} elements={[
                                                    <Button width={percent(100)} text={"Cancel"} opaque onClick={() => {
                                                        this.closeLocalDialog();
                                                    }}/>
                                                ]}/>,

                                                <SettingsGroup elements={[
                                                    <SettingsElement forceRenderSubpageIcon groupDisplayMode title={"Andrea"} onClick={() => {
                                                        onChange("Andrea");
                                                        this.closeLocalDialog();
                                                    }} appendixGenerator={element => (
                                                        <FlexRow elements={[
                                                            <Text
                                                                text={"1.203 documents"}
                                                                type={TextType.secondaryDescription}
                                                                fontSize={px(11)}
                                                            />
                                                        ]}/>
                                                    )}/>,
                                                    <SettingsElement forceRenderSubpageIcon groupDisplayMode title={"Christian"} onClick={() => {
                                                        onChange("Christian");
                                                        this.closeLocalDialog();
                                                    }} appendixGenerator={element => (
                                                        <FlexRow elements={[
                                                            <Text
                                                                text={"276 documents"}
                                                                type={TextType.secondaryDescription}
                                                                fontSize={px(11)}
                                                            />
                                                        ]}/>
                                                    )}/>,
                                                ]}/>

                                            ]}/>
                                        )}/>
                                    );
                                }}/>
                            ]}/>
                        )}
                    />,

                    <FormElement
                        id={"tags"}
                        title={"Tags"}
                        initialValue={[]}
                        fdh={this.local.state.fdh}
                        inputGenerator={(onChange, value, valid) => (
                            <Group removeChildBorders width={percent(100)} orientation={Orientation.HORIZONTAL} elements={[
                                <Input placeholder={"Tag 1, Tag 2, ..., Tag n"} defaultValue={value} onChange={ev => onChange(
                                    ev.target.value.split(",").map(tag => tag.trim())
                                )}/>,

                                <Button height={percent(100)} width={px(50)} border={false} highlight={false} children={
                                    <Flex fh fw align={Align.CENTER} justifyContent={Justify.CENTER} elements={[
                                        <Tooltip sx={{ height: "100%", width: "100%"}} title={"Open editor"} arrow children={
                                            <Icon icon={<EditIcon/>}/>
                                        }/>
                                    ]}/>
                                } onClick={() => {

                                }}/>
                            ]}/>
                        )}
                    />,

                    <FormElement
                        id={"note"}
                        title={"Note"}
                        description={"Put a note here"}
                        fdh={this.local.state.fdh}
                        inputGenerator={(onChange, value, valid) => (
                            <Input placeholder={"Note"} defaultValue={value} onChange={ev => onChange(ev.target.value)}/>
                        )}
                    />,
                ]}/>
            }/>
        );
    }
}
