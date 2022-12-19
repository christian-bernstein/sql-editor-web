import {BC} from "../../../sql/logic/BernieComponent";
import {Assembly} from "../../../sql/logic/assembly/Assembly";
import {Themeable} from "../../../sql/logic/style/Themeable";
import full from "../../assets/images/logos/atlas-logo-full.png";
import {auto, DimensionalMeasured} from "../../../sql/logic/style/DimensionalMeasured";

export enum AtlasLogoVariation {
    ICON, TEXT, FULL
}

export type AtlasLogoProps = {
    variant?: AtlasLogoVariation
    width?: DimensionalMeasured
}

export class AtlasLogo extends BC<AtlasLogoProps, any, any> {

    constructor(props: AtlasLogoProps) {
        super({...props, ...{
            variant: AtlasLogoVariation.FULL, width: auto()
        }}, undefined, undefined);
    }

    componentRender(p: AtlasLogoProps, s: any, l: any, t: Themeable.Theme, a: Assembly): JSX.Element | undefined {
        return (
            <img src={full} alt={"Full atlas logo"} style={{
                width: p.width!.css()
            }}/>
        );
    }
}
