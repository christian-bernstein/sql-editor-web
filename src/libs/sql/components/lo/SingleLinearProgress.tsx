import {BernieComponent} from "../../logic/BernieComponent";
import {LinearProgress} from "@mui/material";
import React from "react";
import {Assembly} from "../../logic/assembly/Assembly";
import {getMeaningfulColors, Themeable} from "../../logic/style/Themeable";
import {LinearProgressProps} from "@mui/material/LinearProgress/LinearProgress";
import {WithVisualMeaning} from "../../logic/style/WithVisualMeaning";
import {getOr} from "../../logic/Utils";
import {ObjectVisualMeaning} from "../../logic/style/ObjectVisualMeaning";

export type SingleLinearProgressProps = WithVisualMeaning & {
    mui?: LinearProgressProps,
    value: number,
    max?: number,
    valueVMMap?: Map<{min: number, max: number}, ObjectVisualMeaning>
}

export class SingleLinearProgress extends BernieComponent<SingleLinearProgressProps, any, any> {

    private isFull(): boolean {
        return this.valueInPercent() === 100;
    }

    private valueInPercent(): number {
        return (this.props.value / getOr(this.props.max, 100)) * 100
    }

    private getVM(): ObjectVisualMeaning {
        const percent = this.valueInPercent();
        if (this.props.valueVMMap === undefined) {
            return getOr(this.props.visualMeaning, ObjectVisualMeaning.UI_NO_HIGHLIGHT);
        } else {
            let vm: ObjectVisualMeaning = getOr(this.props.visualMeaning, ObjectVisualMeaning.UI_NO_HIGHLIGHT);
            this.props.valueVMMap.forEach((ovm, range) => {
                if (range.min <= percent && range.max >= percent) {
                    vm = ovm;
                }
            });
            return vm;
        }
    }


    componentRender(p: SingleLinearProgressProps, s: any, l: any, t: Themeable.Theme, a: Assembly): JSX.Element | undefined {
        const mc = getMeaningfulColors(this.getVM(), t);
        return (
            <LinearProgress sx={{
                width: "100%",
                height: "8px",
                borderRadius: "9999px",
                border: "1px solid " + t.colors.borderPrimaryColor.css(),
                backgroundColor: mc.lighter.withAlpha(.1).css(),
                ['& .MuiLinearProgress-bar']: {
                    backgroundColor: mc.lighter.css(),
                    borderRight: (this.isFull() ? "0" : "1px") + " solid " + t.colors.borderPrimaryColor.css(),
                }
            }} variant="determinate" value={this.valueInPercent()} {...p.mui}/>
        );
    }
}
