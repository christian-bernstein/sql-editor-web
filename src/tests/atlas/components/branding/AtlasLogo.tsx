import {BC} from "../../../../logic/BernieComponent";
import {Assembly} from "../../../../logic/assembly/Assembly";
import {Themeable} from "../../../../logic/style/Themeable";
import full from "../../assets/images/logos/atlas-logo-full.png";
import {auto, DimensionalMeasured} from "../../../../logic/style/DimensionalMeasured";

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
