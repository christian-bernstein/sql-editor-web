import {BernieComponent} from "../../logic/BernieComponent";
import {Assembly} from "../../logic/assembly/Assembly";
import {Themeable} from "../../logic/style/Themeable";
import React from "react";
import {ObjectCategoryCover} from "../../components/ho/objectCategoryCover/ObjectCategoryCover";
import {Screen} from "../../components/lo/Page";
import {Centered} from "../../components/lo/PosInCenter";
import {ReactComponent as FolderIcon} from "../../assets/icons/ic-20/ic20-folder.svg";
import {Icon} from "../../components/lo/Icon";
import {px} from "../../logic/style/DimensionalMeasured";
import {ObjectVisualMeaning} from "../../logic/style/ObjectVisualMeaning";
import {WFCComponent} from "../../tests/wfc/WFC";
import {BoardingPageV2} from "../boarding/BoardingPageV2";

export class UnitTestPage extends BernieComponent<any, any, any> {

    componentRender(p: any, s: any, l: any, t: Themeable.Theme, a: Assembly): JSX.Element | undefined {
        return (
            <BoardingPageV2/>
        );
    }
}
