import {BC} from "../../sql/logic/BernieComponent";
import {Folder} from "../data/Folder";
import {Themeable} from "../../sql/logic/style/Themeable";
import {Assembly} from "../../sql/logic/assembly/Assembly";
import {StaticDrawerMenu} from "../../sql/components/lo/StaticDrawerMenu";
import {Text, TextType} from "../../sql/components/lo/Text";
import {getOr} from "../../sql/logic/Utils";
import {Flex} from "../../sql/components/lo/FlexBox";
import {DrawerHeader} from "../../sql/components/lo/DrawerHeader";
import {VM} from "../../sql/logic/style/ObjectVisualMeaning";
import {SettingsGroup} from "../../sql/components/lo/SettingsGroup";
import {SettingsElement} from "../../sql/components/ho/settingsElement/SettingsElement";
import {ReactComponent as CategoryIcon} from "../../../assets/icons/ic-20/ic20-list-bullet.svg";
import {ReactComponent as FileIcon} from "../../../assets/icons/ic-16/ic16-file.svg";
import {Category} from "../data/Category";
import {Icon} from "../../sql/components/lo/Icon";
import {DimensionalMeasured, percent, px} from "../../sql/logic/style/DimensionalMeasured";
import {CategoryComponent} from "./CategoryComponent";
import {AtlasMain} from "../AtlasMain";
import {Button} from "../../sql/components/lo/Button";
import React from "react";
import {FolderActionsComponent} from "./FolderActionsComponent";
import {Dimension} from "../../sql/logic/style/Dimension";
import {OverflowWithHeader} from "../../sql/components/lo/OverflowWithHeader";
import {FlexDirection} from "../../sql/logic/style/FlexDirection";
import {Align} from "../../sql/logic/style/Align";
import {If} from "../../sql/components/logic/If";
import {Justify} from "../../sql/logic/style/Justify";
import {Box} from "../../sql/components/lo/Box";
import {Cursor} from "../../sql/logic/style/Cursor";
import {FlexWrap} from "../../sql/logic/style/FlexWrap";
import {Color} from "../../sql/logic/style/Color";
import {ReactComponent as CreateIcon} from "../../../assets/icons/ic-20/ic20-plus.svg";
import {ReactComponent as EditIcon} from "../../../assets/icons/ic-20/ic20-edit.svg";
import {CategorySetupDialog} from "./CategorySetupDialog";
import {FolderEditDialog} from "./FolderEditDialog";

export type FolderPreviewComponentProps = {
    data: Folder
}

export class FolderPreviewComponent extends BC<FolderPreviewComponentProps, any, any> {

    private onCategorySelect(element: SettingsElement, category: Category): Promise<void> {
        return new Promise<void>((resolve, reject) => {
            try {
                this.dialog(
                    <CategoryComponent data={category}/>
                );
                resolve();
            } catch (e) {
                reject(e);
            }
        });
    }

    componentRender(p: FolderPreviewComponentProps, s: any, l: any, t: Themeable.Theme, a: Assembly): JSX.Element | undefined {
        return this.component(local => (
            <StaticDrawerMenu maxHeight={DimensionalMeasured.of(85, Dimension.vh)} body={props => (

                <OverflowWithHeader
                    gap={t.gaps.defaultGab}
                    dir={FlexDirection.COLUMN_REVERSE}
                    height={percent(100)}
                    // height={DimensionalMeasured.of(70, Dimension.vh)}
                    staticContainer={{
                        gap: t.gaps.smallGab,
                        elements: [
                            <DrawerHeader
                                header={getOr(p.data.title, "N/A")}
                                enableBadge
                                badgeVM={VM.UI_NO_HIGHLIGHT}
                                badgeText={"Folder Preview"}
                                description={p.data.description}
                            />,

                            <Flex wrap={FlexWrap.WRAP} flexDir={FlexDirection.ROW} fw gap={t.gaps.smallGab} align={Align.CENTER} justifyContent={Justify.CENTER} elements={
                                (p.data.tags as Array<string>).map(s => (
                                    <Box highlightShadow={false} cursor={Cursor.pointer} highlight opaque paddingY={px(4)} paddingX={px(7)} visualMeaning={VM.SUCCESS} borderRadiiConfig={{ enableCustomBorderRadii: true, fallbackCustomBorderRadii: px(500)}} borderless children={
                                        <Text text={s} whitespace={"nowrap"} cursor={Cursor.pointer} visualMeaning={VM.SUCCESS} fontSize={px(12)} coloredText type={TextType.secondaryDescription}/>
                                    }/>
                                ))
                            }/>,

                            <Flex fw padding paddingX={px(25)} flexDir={FlexDirection.ROW} gap={t.gaps.smallGab} elements={[
                                <Button children={
                                    <Icon icon={<EditIcon/>}/>
                                } onClick={() => {
                                    // TODO: Add logic
                                }}/>,

                                <Button width={percent(100)} text={"Actions"} shrinkOnClick onClick={() => {
                                    this.dialog(
                                        <FolderActionsComponent data={this.props.data} caller={this}/>
                                    );
                                }}/>,

                                <Button children={
                                    <Icon icon={<CreateIcon/>}/>
                                } onClick={() => {
                                    this.dialog(
                                        <CategorySetupDialog folder={p.data} actions={{
                                            onCancel: () => {
                                                this.closeLocalDialog();
                                            },
                                            onSubmit: category => {
                                                const success = AtlasMain.atlas().api().createCategory(category);
                                                if (success) {
                                                    AtlasMain.atlas().api().linkCategoryToFolder(category.id, p.data.id);
                                                }
                                                setTimeout(() => {
                                                    this.closeLocalDialog();
                                                    this.rerender("categories");
                                                }, 1);
                                                return success;
                                            }
                                        }}/>
                                    );
                                }}/>,
                            ]}/>
                        ]
                    }}
                    overflowContainer={{
                        elements: [
                            this.component(local => {
                                const id = p.data.id;
                                const freshFolderData = AtlasMain.atlas().api().getFolder(id);

                                if (freshFolderData.categories.length === 0) {
                                    return (
                                        <Flex fw height={px(100)} gap={px(5)} align={Align.CENTER} justifyContent={Justify.CENTER} elements={[
                                            <Text
                                                text={"*Empty folder*\nNo categories found"}
                                                align={Align.CENTER}
                                                uppercase
                                                bold
                                                type={TextType.secondaryDescription}
                                                fontSize={px(12)}
                                                // coloredText
                                                visualMeaning={VM.WARNING}
                                            />,
                                            <Text
                                                text={"*Create a category by clicking the button\n'**Create category**'*"}
                                                type={TextType.secondaryDescription}
                                                align={Align.CENTER}
                                                fontSize={px(11)}
                                            />
                                        ]}/>
                                    );
                                }

                                return (
                                    <SettingsGroup
                                        title={"Select a category"}
                                        elements={
                                            freshFolderData.categories.map(categoryID => {
                                                const category = AtlasMain.atlas().api().getCategory(categoryID);
                                                return (
                                                    <SettingsElement
                                                        title={getOr(category.title, "N/A")}
                                                        groupDisplayMode
                                                        forceRenderSubpageIcon
                                                        promiseBasedOnClick={element => this.onCategorySelect(element, category)}
                                                        iconConfig={{
                                                            enable: true,
                                                            color: category.iconColorHEX === undefined ? undefined : Color.ofHex(category.iconColorHEX),
                                                            iconGenerator: element => (
                                                                <CategoryIcon/>
                                                            )
                                                        }}
                                                        appendixGenerator={element => {
                                                            const documentCount = category.documents.length;
                                                            const empty = documentCount === 0;

                                                            return (
                                                                <Text
                                                                    text={String(category.documents.length)}
                                                                    fontSize={px(11)}
                                                                    coloredText={empty}
                                                                    bold={empty}
                                                                    visualMeaning={VM.UI_NO_HIGHLIGHT}
                                                                    type={TextType.secondaryDescription}
                                                                    enableLeftAppendix
                                                                    leftAppendix={
                                                                        <Icon
                                                                            icon={<FileIcon/>}
                                                                            colored
                                                                            color={t.colors.fontSecondaryColor}
                                                                        />
                                                                    }
                                                                />
                                                            );
                                                        }}
                                                    />
                                                );
                                            })
                                        }
                                    />
                                );
                            }, "categories"),

                            <If condition={p.data.note !== undefined && p.data.note.trim().length > 0} ifTrue={
                                <Flex gap={t.gaps.smallGab} fw>
                                    <Text text={"Note"} uppercase bold type={TextType.secondaryDescription} fontSize={px(12)} align={Align.START}/>
                                    <Text text={getOr(p.data.note, "")} type={TextType.secondaryDescription} fontSize={px(11)} align={Align.START}/>
                                </Flex>
                            }/>,
                        ]
                    }}
                />
            )}/>
        ), "body");


    }

}
