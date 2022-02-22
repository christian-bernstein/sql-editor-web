import {BernieComponent} from "../logic/BernieComponent";
import {Themeable} from "../Themeable";
import {Assembly} from "../logic/Assembly";
import {percent} from "../logic/style/DimensionalMeasured";
import {Input} from "./Input";
import {Button} from "./Button";
import {Icon} from "./Icon";
import {ReactComponent as RunIcon} from "../assets/icons/ic-16/ic16-play.svg";
import {FlexBox} from "./FlexBox";
import React from "react";
import {FlexDirection} from "../logic/style/FlexDirection";
import {ObjectVisualMeaning} from "../logic/ObjectVisualMeaning";
import {Align} from "../logic/Align";

export type JumperLocalState = {
    to?: string
}

export class Jumper extends BernieComponent<any, any, JumperLocalState> {

    constructor() {
        super(undefined, undefined, {
            to: undefined
        });
    }

    componentRender(p: any, s: any, l: JumperLocalState, t: Themeable.Theme, a: Assembly): JSX.Element | undefined {
        return (
            <FlexBox width={percent(100)} flexDir={FlexDirection.ROW} align={Align.CENTER}>
                <Input height={percent(100)} minHeightBoundary={false} hideLabel placeholder={"/"} onChange={ev => this.local.setState({
                    to: ev.target.value
                })}/>
                <Button>
                    <Icon icon={<RunIcon/>} visualMeaning={ObjectVisualMeaning.INFO} colored onClick={() => this.goto(this.local.state.to as string)}/>
                </Button>
            </FlexBox>
        );
    }
}
