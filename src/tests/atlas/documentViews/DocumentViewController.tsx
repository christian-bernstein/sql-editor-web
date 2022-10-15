import {BC} from "../../../logic/BernieComponent";
import {AtlasDocument} from "../data/AtlasDocument";
import {Assembly} from "../../../logic/assembly/Assembly";
import {Themeable} from "../../../logic/style/Themeable";
import {inDevDocumentView} from "./views/InDevDocumentView";
import {Centered} from "../../../components/lo/PosInCenter";
import {Text, TextType} from "../../../components/lo/Text";
import {Flex} from "../../../components/lo/FlexBox";
import {px} from "../../../logic/style/DimensionalMeasured";
import {Align} from "../../../logic/style/Align";
import {Justify} from "../../../logic/style/Justify";

export type DocumentViewControllerProps = {
    document?: AtlasDocument,
    updateBody: (body: string) => void
}

export class DocumentViewController extends BC<DocumentViewControllerProps, any, any> {

    componentRender(p: DocumentViewControllerProps, s: any, l: any, t: Themeable.Theme, a: Assembly): JSX.Element | undefined {
        if (p.document === undefined) {
            return (
                <Centered fullHeight children={
                    <Flex align={Align.CENTER} justifyContent={Justify.CENTER} elements={[
                        <Text text={"No document selected"} type={TextType.secondaryDescription}/>,
                        <Text text={"Select a document from the folder view"} type={TextType.secondaryDescription} fontSize={px(11)}/>
                    ]}/>
                }/>
            );
        } else {
            return inDevDocumentView.renderer(p.document, p.updateBody);
        }
    }
}
