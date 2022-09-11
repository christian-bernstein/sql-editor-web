import {BC} from "../../../logic/BernieComponent";
import {Category} from "../data/Category";
import {Themeable} from "../../../logic/style/Themeable";
import {Assembly} from "../../../logic/assembly/Assembly";
import {Screen} from "../../../components/lo/Page";
import {Flex} from "../../../components/lo/FlexBox";
import {getOr} from "../../../logic/Utils";
import {VM} from "../../../logic/style/ObjectVisualMeaning";
import {createMargin} from "../../../logic/style/Margin";
import {DrawerHeader} from "../../../components/lo/DrawerHeader";
import {AtlasMain} from "../AtlasMain";
import {DocumentComponent} from "./DocumentComponent";
import {UnresolvedDocumentComponent} from "./UnresolvedDocumentComponent";
import {SettingsGroup} from "../../../components/lo/SettingsGroup";

export type CategoryComponentProps = {
    data: Category
}

export class CategoryComponent extends BC<CategoryComponentProps, any, any> {

    componentRender(p: CategoryComponentProps, s: any, l: any, t: Themeable.Theme, a: Assembly): JSX.Element | undefined {
        return (
            <Screen children={
                <Flex fw elements={[
                    <DrawerHeader
                        header={getOr(p.data.title, "N/A")}
                        enableBadge
                        badgeVM={VM.UI_NO_HIGHLIGHT}
                        badgeText={"Category view"}
                        description={p.data.description}
                        margin={createMargin(0, 0, 40, 0)}
                    />,

                    <SettingsGroup children={"Select document"} elements={
                        p.data.documents.map(id => {
                            try {
                                return (
                                    <DocumentComponent data={AtlasMain.atlas().api().getDocument(id)}/>
                                );
                            } catch (e) {
                                return (
                                    <UnresolvedDocumentComponent id={id} error={e}/>
                                );
                            }
                        })
                    }/>
                ]}/>
            }/>
        );
    }

}
