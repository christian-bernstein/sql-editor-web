import {BernieComponent} from "../../../logic/BernieComponent";
import {Assembly} from "../../../logic/assembly/Assembly";
import {Themeable} from "../../../logic/style/Themeable";
import {CustomTooltip, CustomTooltipProps} from "../../lo/CustomTooltip";
import {TooltipProps as MuiTooltipProps} from "@mui/material";

export type TooltipProps = MuiTooltipProps & CustomTooltipProps;

export class Tooltip extends BernieComponent<TooltipProps, any, any> {

    componentRender(p: TooltipProps, s: any, l: any, t: Themeable.Theme, a: Assembly): JSX.Element | undefined {
        return (
            <CustomTooltip {...(p)} children={
                <span children={p.children}/>
            }/>
        );
    }
}
