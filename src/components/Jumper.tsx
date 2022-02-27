import {BernieComponent} from "../logic/BernieComponent";
import {Themeable} from "../Themeable";
import {Assembly} from "../logic/Assembly";
import {DimensionalMeasured, percent} from "../logic/style/DimensionalMeasured";
import {Input} from "./Input";
import {Button} from "./Button";
import {Icon} from "./Icon";
import {ReactComponent as RunIcon} from "../assets/icons/ic-16/ic16-play.svg";
import React from "react";
import {ObjectVisualMeaning} from "../logic/ObjectVisualMeaning";
import {Group} from "./Group";
import {Orientation} from "../logic/style/Orientation";
import {FlexBox} from "./FlexBox";
import {Align} from "../logic/Align";
import {Dimension} from "../logic/style/Dimension";
import {Justify} from "../logic/style/Justify";

export type JumperLocalState = {
    to?: string
}

export class Jumper extends BernieComponent<any, any, JumperLocalState> {

    constructor() {
        super(undefined, undefined, {
            to: undefined
        });
    }
    // height={DimensionalMeasured.of(3.5, Dimension.rem)}
    componentRender(p: any, s: any, l: JumperLocalState, t: Themeable.Theme, a: Assembly): JSX.Element | undefined {
        return (
            <Group orientation={Orientation.HORIZONTAL} height={DimensionalMeasured.of(2.5, Dimension.rem)} enableSeparators elements={[
                <Input height={percent(100)} minHeightBoundary={false} hideLabel={true} placeholder={"/"} onChange={ev => this.local.setState({
                    to: ev.target.value
                })}/>,
                <Button height={percent(100)} zIndex={2}>
                    <FlexBox height={percent(100)} align={Align.CENTER} justifyContent={Justify.CENTER}>
                        <Icon icon={<RunIcon/>} visualMeaning={ObjectVisualMeaning.INFO} colored onClick={() => this.goto(this.local.state.to as string)}/>
                    </FlexBox>
                </Button>
            ]}/>

        );
    }
}
