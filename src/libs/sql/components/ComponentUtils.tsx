import {PropsWithChildren} from "react";
import {Slider} from "@mui/material";

export namespace ComponentUtils {

    export type MuiWrapConfig = PropsWithChildren<{
        // sx: SxProps
    }>

    /**
     * todo implement
     */
    export function mui(config: MuiWrapConfig): JSX.Element {
        return (
            <>not implemented yet, see 'ComponentUtils.mui()' code</>
        );
    }

}