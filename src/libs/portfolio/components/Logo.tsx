import {BC} from "../../sql/logic/BernieComponent";
import {Themeable} from "../../sql/logic/style/Themeable";
import {Assembly} from "../../sql/logic/assembly/Assembly";
import LogoSVG from "../assets/christian-bernstein-logo.svg";
import {DimensionalMeasured} from "../../sql/logic/style/DimensionalMeasured";
import {Link} from "react-router-dom";

export type LogoProps = {
    width?: DimensionalMeasured
}

export class Logo extends BC<LogoProps, any, any> {

    componentRender(p: LogoProps, s: any, l: any, t: Themeable.Theme, a: Assembly): JSX.Element | undefined {
        return (
            <Link to={"/"} children={
                <img
                    draggable={false}
                    width={p.width?.css() ?? undefined}
                    src={LogoSVG}
                    alt={"Christian Bernstein"}
                />
            }/>
        );
    }
}
