import {BC} from "../../../logic/BernieComponent";
import {Folder} from "../data/Folder";
import {Themeable} from "../../../logic/style/Themeable";
import {Assembly} from "../../../logic/assembly/Assembly";
import {StaticDrawerMenu} from "../../../components/lo/StaticDrawerMenu";
import {Text, TextType} from "../../../components/lo/Text";
import {getOr} from "../../../logic/Utils";
import {Flex} from "../../../components/lo/FlexBox";
import {DrawerHeader} from "../../../components/lo/DrawerHeader";
import {VM} from "../../../logic/style/ObjectVisualMeaning";
import {SettingsGroup} from "../../../components/lo/SettingsGroup";
import {createMargin} from "../../../logic/style/Margin";
import {SettingsElement} from "../../../components/ho/settingsElement/SettingsElement";
import {ReactComponent as CategoryIcon} from "../../../assets/icons/ic-20/ic20-list-bullet.svg";
import {ReactComponent as FileIcon} from "../../../assets/icons/ic-16/ic16-file.svg";
import {Category} from "../data/Category";
import {Icon} from "../../../components/lo/Icon";
import {px} from "../../../logic/style/DimensionalMeasured";
import {Screen} from "../../../components/lo/Page";
import {CategoryComponent} from "./CategoryComponent";

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
        return (
            <StaticDrawerMenu body={props => (
                <Flex fw elements={[
                    <DrawerHeader
                        header={getOr(p.data.title, "N/A")}
                        enableBadge
                        badgeVM={VM.UI_NO_HIGHLIGHT}
                        badgeText={"Preview"}
                        description={p.data.description}
                        margin={createMargin(0, 0, 40, 0)}
                    />,

                    <SettingsGroup
                        title={"Select a category"}
                        elements={
                            p.data.categories.map(category => (
                                <SettingsElement
                                    title={getOr(category.title, "N/A")}
                                    groupDisplayMode
                                    forceRenderSubpageIcon
                                    promiseBasedOnClick={element => this.onCategorySelect(element, category)}
                                    iconConfig={{
                                        enable: true,
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
                                                visualMeaning={empty ? VM.WARNING : VM.UI_NO_HIGHLIGHT}
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
                            ))
                        }
                    />
                ]}/>
            )}/>
        );
    }

}
