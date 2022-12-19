import {BernieComponent} from "../../logic/BernieComponent";
import {Assembly} from "../../logic/assembly/Assembly";
import {Themeable} from "../../logic/style/Themeable";
import {percent} from "../../logic/style/DimensionalMeasured";
import {Orientation} from "../../logic/style/Orientation";
import {Button} from "./Button";
import {Icon} from "./Icon";
import {ReactComponent as LessIcon} from "../../../../assets/icons/ic-20/ic20-chevron-left.svg";
import {FlexBox} from "./FlexBox";
import {Justify} from "../../logic/style/Justify";
import {Align} from "../../logic/style/Align";
import {Text} from "./Text";
import {ReactComponent as MoreIcon} from "../../../../assets/icons/ic-20/ic20-chevron-right.svg";
import {Group} from "./Group";
import {ObjectVisualMeaning} from "../../logic/style/ObjectVisualMeaning";
import {If} from "../logic/If";
import {Cursor} from "../../logic/style/Cursor";

export type NumberSelectorProps = {
    minValue: number,
    maxValue: number,
    initialValue: number,
    deltaCalculator: (current: number, op: 'up' | 'down') => number,
    format?: string,
    specialNumberDisplayRenderers: Map<{min: number, max: number}, (current: number) => JSX.Element>,
    onChange: (newValue: number) => void
}

export class NumberSelector extends BernieComponent<NumberSelectorProps, any, any> {

    constructor(props: NumberSelectorProps) {
        super({
            ...props,
            format: "{min}/{current}/{max}"
        }, undefined, undefined);
    }

    private loadSpecialDisplayRenderer(renderValue: number, renderers: Map<{min: number; max: number}, (current: number) => JSX.Element>): undefined | ((current: number) => JSX.Element) {
        let final: undefined | ((current: number) => JSX.Element) = undefined;
        renderers.forEach((renderer, range) => {
            if (range.min <= renderValue && range.max >= renderValue) {
                final = renderer;
            }
        });
        return final;
    }

    private canGoLower(): boolean {
        if (this.props.minValue === undefined) {
            return true;
        } else {
            const val = this.props.initialValue || 0;
            return val - (this.props.deltaCalculator?.(val, "down") as number) >= this.props.minValue;
        }
    }

    private canGoHigher(): boolean {
        if (this.props.maxValue === undefined) {
            return true;
        } else {
            const val = this.props.initialValue || 0;
            return val + (this.props.deltaCalculator?.(val, "up") as number) <= this.props.maxValue;
        }
    }

    componentRender(p: NumberSelectorProps, s: any, l: any, t: Themeable.Theme, a: Assembly): JSX.Element | undefined {
        const numberDisplayRenderer = this.loadSpecialDisplayRenderer(p.initialValue, p.specialNumberDisplayRenderers);
        let displayText = (p.format || "{min}/{current}/{max}")
            .replaceAll("{min}", String(p.minValue))
            .replaceAll("{current}", String(p.initialValue))
            .replaceAll("{max}", String(p.maxValue));

        return (
            <Group width={percent(100)} orientation={Orientation.HORIZONTAL} elements={[
                <If condition={this.canGoLower()} ifTrue={
                    <Button highlight={false} onClick={() => p.onChange(p.initialValue - p.deltaCalculator(p.initialValue, "down"))}>
                        <Icon colored visualMeaning={ObjectVisualMeaning.INFO} icon={
                            <LessIcon/>
                        }/>
                    </Button>
                } ifFalse={
                    <Button highlight={false} cursor={Cursor.notAllowed}>
                        <Icon colored visualMeaning={ObjectVisualMeaning.UI_NO_HIGHLIGHT} icon={
                            <LessIcon/>
                        }/>
                    </Button>
                }/>,
                <FlexBox width={percent(100)} justifyContent={Justify.CENTER} align={Align.CENTER} children={
                    numberDisplayRenderer ? numberDisplayRenderer(p.initialValue) : (
                        <Text text={displayText}/>
                    )
                }/>,
                <If condition={this.canGoHigher()} ifTrue={
                    <Button highlight={false} onClick={() => p.onChange(p.initialValue + p.deltaCalculator(p.initialValue, "up"))}>
                        <Icon colored visualMeaning={ObjectVisualMeaning.INFO} icon={
                            <MoreIcon/>
                        }/>
                    </Button>
                } ifFalse={
                    <Button highlight={false} cursor={Cursor.notAllowed}>
                        <Icon colored visualMeaning={ObjectVisualMeaning.UI_NO_HIGHLIGHT} icon={
                            <MoreIcon/>
                        }/>
                    </Button>
                }/>,
            ]}/>
        );
    }
}
