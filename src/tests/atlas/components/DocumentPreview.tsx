import {BC} from "../../../logic/BernieComponent";
import {AtlasDocument} from "../data/AtlasDocument";
import {Themeable} from "../../../logic/style/Themeable";
import {Assembly} from "../../../logic/assembly/Assembly";
import {Flex} from "../../../components/lo/FlexBox";
import {DrawerHeader} from "../../../components/lo/DrawerHeader";
import {VM} from "../../../logic/style/ObjectVisualMeaning";
import {percent, px} from "../../../logic/style/DimensionalMeasured";
import {Button} from "../../../components/lo/Button";
import React from "react";

export type DocumentPreviewProps = {
    data: AtlasDocument
}

export class DocumentPreview extends BC<DocumentPreviewProps, any, any> {

    componentRender(p: DocumentPreviewProps, s: any, l: any, t: Themeable.Theme, a: Assembly): JSX.Element | undefined {
        return (
            <Flex fw elements={[
                <DrawerHeader
                    header={`${p.data.title}`}
                    enableBadge
                    badgeVM={VM.UI_NO_HIGHLIGHT}
                    badgeText={"Document preview"}
                    description={p.data.description}
                />,

                <Flex fw padding paddingX={px(25)} elements={[
                    <Button width={percent(100)} text={"Actions"}/>
                ]}/>,
            ]}/>
        );
    }
}
