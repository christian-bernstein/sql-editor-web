import {BernieComponent} from "../../logic/BernieComponent";
import {Assembly} from "../../logic/assembly/Assembly";
import {Themeable} from "../../logic/style/Themeable";
import {Centered} from "../../components/lo/PosInCenter";
import {Screen} from "../../components/lo/Page";
import React from "react";
import {Text} from "../../components/lo/Text";
import {FlexBox} from "../../components/lo/FlexBox";
import {percent, px} from "../../logic/style/DimensionalMeasured";
import {OverflowBehaviour} from "../../logic/style/OverflowBehaviour";
import {Default, Desktop, Mobile, Tablet} from "../../components/logic/Media";
import {CodeEditor} from "../../components/lo/CodeEditor";
import {CodeDisplay} from "../../components/lo/CodeDisplay";
import {Image} from "../../components/lo/Image";
import {Group} from "../../components/lo/Group";
import {LiteGrid} from "../../components/lo/LiteGrid";
import {DocumentationPage} from "../documentation/DocumentationPage";
import {EpicureHubPage} from "../../tests/epicure/pages/hub/EpicureHubPage";

export class UnitTestPage extends BernieComponent<any, any, any> {

    componentRender(p: any, s: any, l: any, t: Themeable.Theme, a: Assembly): JSX.Element | undefined {
        return (
            // <DocumentationPage/>
            <EpicureHubPage/>
        );
    }
}
