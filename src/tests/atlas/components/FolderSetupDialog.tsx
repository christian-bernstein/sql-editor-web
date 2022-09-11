import {BC} from "../../../logic/BernieComponent";
import {Folder} from "../data/Folder";
import {Flex} from "../../../components/lo/FlexBox";
import {Assembly} from "../../../logic/assembly/Assembly";
import {Themeable} from "../../../logic/style/Themeable";
import {Screen} from "../../../components/lo/Page";
import {DrawerHeader} from "../../../components/lo/DrawerHeader";
import {getOr} from "../../../logic/Utils";
import {VM} from "../../../logic/style/ObjectVisualMeaning";
import {createMargin} from "../../../logic/style/Margin";
import {FormDataHub} from "../../epicure/components/FormDataHub";
import {Input} from "../../../components/lo/Input";
import {Select} from "../../../components/lo/Select";
import {Month} from "../../epicure/Month";
import {FormElement} from "../../epicure/components/FormElement";
import React from "react";

interface FolderSetupDialogActions {
    onSubmit(folder: Folder): void;
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

    componentRender(p: FolderSetupDialogProps, s: any, l: FolderSetupDialogLocalState, t: Themeable.Theme, a: Assembly): JSX.Element | undefined {
        return (
            <Screen children={
                <Flex fw elements={[
                    <DrawerHeader
                        header={"Create folder"}
                        enableBadge
                        badgeVM={VM.UI_NO_HIGHLIGHT}
                        badgeText={"Virtual folder system"}
                        description={"Create a new folder"}
                        margin={createMargin(0, 0, 40, 0)}
                    />,


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
                            <Input placeholder={"Creator"} defaultValue={value} onChange={ev => onChange(ev.target.value)}/>
                        )}
                    />,

                    <FormElement
                        id={"tags"}
                        title={"Tags"}
                        fdh={this.local.state.fdh}
                        inputGenerator={(onChange, value, valid) => (
                            <Input placeholder={"Tag 1, Tag 2, ..., Tag n"} defaultValue={value} onChange={ev => onChange(ev.target.value)}/>
                        )}
                    />,
                ]}/>
            }/>
        );
    }
}
