import {BC} from "../../sql/logic/BernieComponent";
import {Folder} from "../data/Folder";
import {FormDataHub} from "../../epicure/components/FormDataHub";
import {AtlasDocument} from "../data/AtlasDocument";
import {FolderEditDialogProps} from "./FolderEditDialog";
import {Assembly} from "../../sql/logic/assembly/Assembly";
import {Themeable} from "../../sql/logic/style/Themeable";
import {StaticDrawerMenu} from "../../sql/components/lo/StaticDrawerMenu";
import {DimensionalMeasured, percent, px} from "../../sql/logic/style/DimensionalMeasured";
import {Dimension} from "../../sql/logic/style/Dimension";
import {OverflowWithHeader} from "../../sql/components/lo/OverflowWithHeader";
import {FlexDirection} from "../../sql/logic/style/FlexDirection";
import {DrawerHeader} from "../../sql/components/lo/DrawerHeader";
import {VM} from "../../sql/logic/style/ObjectVisualMeaning";
import {Flex} from "../../sql/components/lo/FlexBox";
import {LiteGrid} from "../../sql/components/lo/LiteGrid";
import {AF} from "../../sql/components/logic/ArrayFragment";
import {Button} from "../../sql/components/lo/Button";
import {BaseEntitySetupComponent} from "./BaseEntitySetupComponent";
import React from "react";

export interface DocumentEditDialogActions {
    onSubmit(document: AtlasDocument): void,
    onCancel(): void,
}

export type DocumentEditDialogProps = {
    document: AtlasDocument,
    actions: DocumentEditDialogActions
}

export type DocumentEditDialogLocalState = {
    fdh: FormDataHub
}

export class DocumentEditDialog extends BC<DocumentEditDialogProps, any, DocumentEditDialogLocalState> {

    constructor(props: DocumentEditDialogProps) {
        super(props, undefined, {
            fdh: new FormDataHub("DocumentEditDialog", {
                initialData: Array.from(Object.entries(props.document).map(pair => ({
                    key: pair[0] as string,
                    value: pair[1]
                })))
            })
        });
    }

    componentRender(p: DocumentEditDialogProps, s: any, l: DocumentEditDialogLocalState, t: Themeable.Theme, a: Assembly): JSX.Element | undefined {
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
                                    header={`Edit document *${p.document.title}*`}
                                    enableBadge
                                    badgeVM={VM.UI_NO_HIGHLIGHT}
                                    badgeText={"Edit document"}
                                    description={`Edit document called '*${p.document.title}*'.\nPress on **cancel** to cancel the editing, no changes will be done to the document. Press on **Save** to save the edits.`}
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
                                                        ...p.document,
                                                        note: this.local.state.fdh.get("note"),
                                                        tags: this.local.state.fdh.get("tags"),
                                                        title: this.local.state.fdh.get("title"),
                                                        creator: this.local.state.fdh.get("creator"),
                                                        description: this.local.state.fdh.get("description"),
                                                        iconColorHEX: this.local.state.fdh.get("iconColorHEX"),
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
