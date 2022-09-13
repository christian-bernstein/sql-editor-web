import {BC} from "../../../logic/BernieComponent";
import {Folder} from "../data/Folder";
import {Flex, FlexBox, FlexRow} from "../../../components/lo/FlexBox";
import {Assembly} from "../../../logic/assembly/Assembly";
import {Themeable} from "../../../logic/style/Themeable";
import {Screen} from "../../../components/lo/Page";
import {DrawerHeader} from "../../../components/lo/DrawerHeader";
import {VM} from "../../../logic/style/ObjectVisualMeaning";
import {FormDataHub} from "../../epicure/components/FormDataHub";
import {Input} from "../../../components/lo/Input";
import {FormElement} from "../../epicure/components/FormElement";
import React from "react";
import {DimensionalMeasured, percent, px} from "../../../logic/style/DimensionalMeasured";
import {Button} from "../../../components/lo/Button";
import {Icon} from "../../../components/lo/Icon";
import {ReactComponent as EditIcon} from "../../../assets/icons/ic-20/ic20-edit.svg";
import {ReactComponent as ResetIcon} from "../../../assets/icons/ic-20/ic20-refresh.svg";
import {Align} from "../../../logic/style/Align";
import {Group} from "../../../components/lo/Group";
import {Orientation} from "../../../logic/style/Orientation";
import {Tooltip} from "../../../components/ho/tooltip/Tooltip";
import {Justify} from "../../../logic/style/Justify";
import {StaticDrawerMenu} from "../../../components/lo/StaticDrawerMenu";
import {SettingsGroup} from "../../../components/lo/SettingsGroup";
import {SettingsElement} from "../../../components/ho/settingsElement/SettingsElement";
import {Text, TextType} from "../../../components/lo/Text";
import {v4} from "uuid";
import {Box} from "../../../components/lo/Box";
import {Color} from "../../../logic/style/Color";
import {ColorSelectorDialog} from "./ColorSelectorDialog";
import {ColorInput} from "./ColorInput";
import {Dimension} from "../../../logic/style/Dimension";
import {AF} from "../../../components/logic/ArrayFragment";
import {OverflowBehaviour} from "../../../logic/style/OverflowBehaviour";
import {Switch} from "react-router-dom";
import {App} from "../../../logic/app/App";
import {Mobile} from "../../../components/logic/Media";
import {MobileNavigation} from "../../../components/ho/bottomNavigation/MobileNavigation";

interface FolderSetupDialogActions {
    onSubmit(folder: Folder): boolean;
}

export type FolderSetupDialogProps = {
    actions: FolderSetupDialogActions
}

export type FolderSetupDialogLocalState = {
    fdh: FormDataHub
}

export class FolderSetupDialog extends BC<FolderSetupDialogProps, any, FolderSetupDialogLocalState> {

    constructor(props: FolderSetupDialogProps) {
        super(props, undefined, {
            fdh: new FormDataHub("FolderSetupDialog").loadFromLocalStore()
        });
    }

    private createFolder() {
        // TODO: Only call action, if valid entries (unique title)
        this.props.actions.onSubmit({
            id: v4(),
            creationDate: new Date().toString(),
            note: this.local.state.fdh.get("note"),
            tags: this.local.state.fdh.get("tags"),
            title: this.local.state.fdh.get("title"),
            creator: this.local.state.fdh.get("creator"),
            description: this.local.state.fdh.get("description"),
            iconColorHEX: this.local.state.fdh.get("icon-color"),
            categories: []
        });
    }

    componentRender(p: FolderSetupDialogProps, s: any, l: FolderSetupDialogLocalState, t: Themeable.Theme, a: Assembly): JSX.Element | undefined {
        return (
            <Screen deactivatePadding children={
                <FlexBox padding id={"folder-setup-dialog"} gap={t.gaps.defaultGab} height={DimensionalMeasured.of(100, Dimension.vh)} fw children={
                    <AF elements={[
                        <FlexBox id={"folder-setup-dialog-header"} padding={false} fw style={{flex: "0 1 auto"}} children={
                            <Flex fw elements={[
                                <DrawerHeader
                                    header={"Create folder"}
                                    enableBadge
                                    badgeVM={VM.UI_NO_HIGHLIGHT}
                                    badgeText={"Virtual folder system"}
                                    description={"Create a new folder"}
                                />,

                                <Flex fw padding paddingX={px(25)} elements={[
                                    <Button width={percent(100)} text={"Create folder"} opaque visualMeaning={VM.INFO} onClick={() => {
                                        this.createFolder();
                                    }}/>
                                ]}/>,
                            ]}/>
                        }/>,

                        <FlexBox id={"folder-setup-dialog-body"} fw style={{flex: "1 1 auto"}} overflowYBehaviour={OverflowBehaviour.SCROLL} elements={[
                            <FormElement
                                id={"title"}
                                title={"Title"}
                                description={"The title / name of the folder"}
                                fdh={this.local.state.fdh}
                                inputGenerator={(onChange, value, valid) => (
                                    <Input placeholder={"Title"} defaultValue={value} onChange={ev => onChange(ev.target.value)}/>
                                )}
                            />,

                            <FormElement
                                id={"description"}
                                title={"Description"}
                                description={"A short description of the folder's meaning"}
                                fdh={this.local.state.fdh}
                                inputGenerator={(onChange, value, valid) => (
                                    <Input placeholder={"Description"} defaultValue={value} onChange={ev => onChange(ev.target.value)}/>
                                )}
                            />,

                            <FormElement
                                id={"creator"}
                                title={"Creator"}
                                description={"Who created this folder"}
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

                            <ColorInput
                                id={"icon-color"}
                                title={"Color"}
                                description={"Select the icons color"}
                                initialValue={undefined}
                                fdh={this.local.state.fdh}
                                controller={this}
                            />,
                        ]}/>
                    ]}/>
                }/>
            }/>
        );
    }
}
