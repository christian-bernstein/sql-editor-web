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
import {BaseEntitySetupComponent} from "./BaseEntitySetupComponent";

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
            iconColorHEX: this.local.state.fdh.get("iconColorHEX"),
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
                                ]}/>
                            ]}/>
                        }/>,

                        <BaseEntitySetupComponent fdh={this.local.state.fdh}/>
                    ]}/>
                }/>
            }/>
        );
    }
}
