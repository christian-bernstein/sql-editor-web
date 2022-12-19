import {BC} from "../../sql/logic/BernieComponent";
import {Folder} from "../data/Folder";
import {FormDataHub} from "../../epicure/components/FormDataHub";
import {Assembly} from "../../sql/logic/assembly/Assembly";
import {Themeable} from "../../sql/logic/style/Themeable";
import {Category} from "../data/Category";
import {Flex} from "../../sql/components/lo/FlexBox";
import {DrawerHeader} from "../../sql/components/lo/DrawerHeader";
import {VM} from "../../sql/logic/style/ObjectVisualMeaning";
import {percent, px} from "../../sql/logic/style/DimensionalMeasured";
import {Button} from "../../sql/components/lo/Button";
import {Screen} from "../../sql/components/lo/Page";
import React from "react";
import {v4} from "uuid";
import {BaseEntitySetupComponent} from "./BaseEntitySetupComponent";
import {OverflowWithHeader} from "../../sql/components/lo/OverflowWithHeader";
import {FlexDirection} from "../../sql/logic/style/FlexDirection";
import {LiteGrid} from "../../sql/components/lo/LiteGrid";
import {AF} from "../../sql/components/logic/ArrayFragment";

interface CategorySetupDialogActions {
    onSubmit(category: Category): boolean;
    onCancel(): void;
}

export type CategorySetupDialogProps = {
    folder: Folder,
    actions: CategorySetupDialogActions
}

export type CategorySetupDialogLocalState = {
    fdh: FormDataHub
}

export class CategorySetupDialog extends BC<CategorySetupDialogProps, any, CategorySetupDialogLocalState> {

    constructor(props: CategorySetupDialogProps) {
        super(props, undefined, {
            fdh: new FormDataHub("CategorySetupDialog").loadFromLocalStore()
        });
    }

    private createCategory() {
        // TODO: Only call action, if valid entries (unique title)

        this.props.actions.onSubmit({
            documents: [],
            id: v4(),
            creationDate: new Date().toString(),
            note: this.local.state.fdh.get("note"),
            tags: this.local.state.fdh.get("tags"),
            title: this.local.state.fdh.get("title"),
            creator: this.local.state.fdh.get("creator"),
            description: this.local.state.fdh.get("description"),
            iconColorHEX: this.local.state.fdh.get("iconColorHEX"),
        });
    }

    componentRender(p: CategorySetupDialogProps, s: any, l: CategorySetupDialogLocalState, t: Themeable.Theme, a: Assembly): JSX.Element | undefined {
        return (
            <Screen children={
                <OverflowWithHeader dir={FlexDirection.COLUMN_REVERSE} gap={t.gaps.defaultGab} overflowContainer={{
                    elements: [
                        <BaseEntitySetupComponent fdh={this.local.state.fdh}/>
                    ]
                }} staticContainer={{
                    elements: [
                        <Flex fw elements={[
                            <DrawerHeader
                                header={`Create category in *${p.folder.title}*`}
                                enableBadge
                                badgeVM={VM.UI_NO_HIGHLIGHT}
                                badgeText={"Virtual folder system"}
                                description={`Create a new category in folder **${p.folder.title}**.`}
                            />,

                            <Flex fw padding paddingX={px(25)} elements={[
                                <LiteGrid columns={2} gap={t.gaps.smallGab} children={
                                    <AF elements={[
                                        <Button width={percent(100)} text={"Cancel"} onClick={() => {
                                            p.actions.onCancel();
                                        }}/>,
                                        <Button width={percent(100)} text={"Create category"} opaque visualMeaning={VM.INFO} onClick={() => {
                                            this.createCategory();
                                        }}/>
                                    ]}/>
                                }/>
                            ]}/>
                        ]}/>
                    ]
                }}/>
            }/>
        );
    }
}
