import {BC} from "../../../logic/BernieComponent";
import {FormDataHub} from "../../../tests/epicure/components/FormDataHub";
import {Assembly} from "../../../logic/assembly/Assembly";
import {Themeable} from "../../../logic/style/Themeable";
import {Flex, FlexBox, FlexRow} from "../../../components/lo/FlexBox";
import {OverflowBehaviour} from "../../../logic/style/OverflowBehaviour";
import {FormElement} from "../../../tests/epicure/components/FormElement";
import {Input} from "../../../components/lo/Input";
import {Group} from "../../../components/lo/Group";
import {percent, px} from "../../../logic/style/DimensionalMeasured";
import {Orientation} from "../../../logic/style/Orientation";
import {Button} from "../../../components/lo/Button";
import {Align} from "../../../logic/style/Align";
import {Justify} from "../../../logic/style/Justify";
import {Tooltip} from "../../../components/ho/tooltip/Tooltip";
import {Icon} from "../../../components/lo/Icon";
import {ReactComponent as EditIcon} from "../../../assets/icons/ic-20/ic20-edit.svg";
import {StaticDrawerMenu} from "../../../components/lo/StaticDrawerMenu";
import {DrawerHeader} from "../../../components/lo/DrawerHeader";
import {VM} from "../../../logic/style/ObjectVisualMeaning";
import {SettingsGroup} from "../../../components/lo/SettingsGroup";
import {SettingsElement} from "../../../components/ho/settingsElement/SettingsElement";
import {Text, TextType} from "../../../components/lo/Text";
import {ColorInput} from "./ColorInput";
import React from "react";

export type BaseEntitySetupComponentProps = {
    fdh: FormDataHub
}

export class BaseEntitySetupComponent extends BC<BaseEntitySetupComponentProps, any, any> {

    componentRender(p: BaseEntitySetupComponentProps, s: any, l: any, t: Themeable.Theme, a: Assembly): JSX.Element | undefined {
        return (
            <FlexBox fw style={{flex: "1 1 auto"}} overflowYBehaviour={OverflowBehaviour.SCROLL} elements={[
                <FormElement
                    id={"title"}
                    title={"Title"}
                    description={"The title / name of the entity"}
                    fdh={p.fdh}
                    inputGenerator={(onChange, value, valid) => (
                        <Input placeholder={"Title"} defaultValue={value} onChange={ev => onChange(ev.target.value)}/>
                    )}
                />,

                <FormElement
                    id={"description"}
                    title={"Description"}
                    description={"A short description of the entity's meaning"}
                    fdh={p.fdh}
                    inputGenerator={(onChange, value, valid) => (
                        <Input placeholder={"Description"} defaultValue={value} onChange={ev => onChange(ev.target.value)}/>
                    )}
                />,

                <FormElement
                    id={"creator"}
                    title={"Creator"}
                    description={"Who created this entity"}
                    fdh={p.fdh}
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
                    fdh={p.fdh}
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
                    fdh={p.fdh}
                    inputGenerator={(onChange, value, valid) => (
                        <Input placeholder={"Note"} defaultValue={value} onChange={ev => onChange(ev.target.value)}/>
                    )}
                />,

                <ColorInput
                    id={"iconColorHEX"}
                    title={"Color"}
                    description={"Select the icons color"}
                    initialValue={undefined}
                    fdh={p.fdh}
                    controller={this}
                />,
            ]}/>

        );
    }
}
