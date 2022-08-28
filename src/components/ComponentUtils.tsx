import {PropsWithChildren} from "react";
import {Slider} from "@mui/material";

export namespace ComponentUtils {

    export type MuiWrapConfig = PropsWithChildren<{

    }>

    export function mui(config: MuiWrapConfig): JSX.Element {
        return (
            <Slider
                getAriaLabel={() => 'Temperature'}
                orientation="vertical"
                defaultValue={[20, 37]}
                valueLabelDisplay="auto"
                marks={[{
                    value: 100,
                    label: (
                        <>asd</>
                    )
                }]}
            />
        );
    }

}