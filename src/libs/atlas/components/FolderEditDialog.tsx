import {BC} from "../../sql/logic/BernieComponent";
import {Folder} from "../data/Folder";
import {Themeable} from "../../sql/logic/style/Themeable";
import {Assembly} from "../../sql/logic/assembly/Assembly";
import {StaticDrawerMenu} from "../../sql/components/lo/StaticDrawerMenu";
import {DimensionalMeasured, percent, px} from "../../sql/logic/style/DimensionalMeasured";
import {Dimension} from "../../sql/logic/style/Dimension";
import {OverflowWithHeader} from "../../sql/components/lo/OverflowWithHeader";
import {FlexDirection} from "../../sql/logic/style/FlexDirection";
import {DrawerHeader} from "../../sql/components/lo/DrawerHeader";
import {getOr} from "../../sql/logic/Utils";
import {VM} from "../../sql/logic/style/ObjectVisualMeaning";
import React from "react";
import {Button} from "../../sql/components/lo/Button";
import {Flex} from "../../sql/components/lo/FlexBox";
import {LiteGrid} from "../../sql/components/lo/LiteGrid";
import {AF} from "../../sql/components/logic/ArrayFragment";
import {BaseEntitySetupComponent} from "./BaseEntitySetupComponent";
import {FormDataHub} from "../../epicure/components/FormDataHub";

export interface FolderEditDialogActions {
    onSubmit(folder: Folder): void,
    onCancel(): void,
}

export type FolderEditDialogProps = {
    folder: Folder,
    actions: FolderEditDialogActions
}

export type FolderEditDialogLocalState = {
    fdh: FormDataHub
}

export class FolderEditDialog extends BC<FolderEditDialogProps, any, FolderEditDialogLocalState> {

    constructor(props: FolderEditDialogProps) {
        super(props, undefined, {
            fdh: new FormDataHub("FolderEditDialog", {
                initialData: Array.from(Object.entries(props.folder).map(pair => ({
                    key: pair[0] as string,
                    value: pair[1]
                })))
            })
        });
    }

    componentRender(p: FolderEditDialogProps, s: any, l: FolderEditDialogLocalState, t: Themeable.Theme, a: Assembly): JSX.Element | undefined {
        return (
            <StaticDrawerMenu maxHeight={DimensionalMeasured.of(85, Dimension.vh)} body={() => {

                return (
                    <OverflowWithHeader
                        gap={t.gaps.defaultGab}
                        dir={FlexDirection.COLUMN_REVERSE}
                        height={percent(100)}
                        staticContainer={{
                            gap: t.gaps.smallGab,
                            elements: [
                                <DrawerHeader
                                    header={`Edit folder *${p.folder.title}*`}
                                    enableBadge
                                    badgeVM={VM.UI_NO_HIGHLIGHT}
                                    badgeText={"Edit folder"}
                                    description={`Edit folder called '*${p.folder.title}*'.\nPress on **cancel** to cancel the editing, no changes will be done to the folder. Press on **Save** to save the edits.`}
                                />,

                                <Flex fw padding paddingX={px(25)} elements={[
                                    <LiteGrid columns={2} gap={t.gaps.smallGab} children={
                                        <AF elements={[
                                            <Button
                                                width={percent(100)}
                                                text={"Cancel"}
                                                onClick={() => {
                                                    p.actions.onCancel();
                                                }}
                                            />,
                                            <Button
                                                width={percent(100)}
                                                text={"Save"}
                                                opaque
                                                visualMeaning={VM.INFO}
                                                onClick={() => {
                                                    p.actions.onSubmit({
                                                        id: p.folder.id,
                                                        creationDate: p.folder.creationDate,
                                                        note: this.local.state.fdh.get("note"),
                                                        tags: this.local.state.fdh.get("tags"),
                                                        title: this.local.state.fdh.get("title"),
                                                        creator: this.local.state.fdh.get("creator"),
                                                        description: this.local.state.fdh.get("description"),
                                                        iconColorHEX: this.local.state.fdh.get("iconColorHEX"),
                                                        categories: p.folder.categories
                                                    })
                                                }}
                                            />
                                        ]}/>
                                    }/>
                                ]}/>
                            ]
                        }}
                        overflowContainer={{
                            gap: t.gaps.smallGab,
                            elements: [
                                <BaseEntitySetupComponent
                                    fdh={this.local.state.fdh}
                                />
                            ]
                        }}
                    />
                );
            }}/>
        );
    }
}
