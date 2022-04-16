import {BernieComponent} from "../../../logic/BernieComponent";
import {ObjectVisualMeaning} from "../../../logic/style/ObjectVisualMeaning";
import {getOr} from "../../../logic/Utils";
import {Box} from "../../lo/Box";
import {Cursor} from "../../../logic/style/Cursor";
import {PosInCenter} from "../../lo/PosInCenter";
import {Text} from "../../lo/Text";
import {Separator} from "../../lo/Separator";
import {Togglable} from "../../logic/Togglable";
import React from "react";
import {Themeable} from "../../../logic/style/Themeable";
import {Assembly} from "../../../logic/assembly/Assembly";
import {WithVisualMeaning} from "../../../logic/style/WithVisualMeaning";
import {CockpitButtonType} from "./CockpitButtonType";
import {percent} from "../../../logic/style/DimensionalMeasured";

export type CockpitButtonProps = WithVisualMeaning & {
    initialActiveState: boolean,
    onActiveChange: (props: CockpitButtonProps, active: boolean) => void,
    title: string,
    value: string,
    valueFactory?: (instance: CockpitButton) => string,
    variant: CockpitButtonType,
    multiColorMode: boolean
}

export type CockpitButtonPropsPartial = Partial<CockpitButtonProps>;

export class CockpitButton extends BernieComponent<CockpitButtonPropsPartial, any, any> {

    private static readonly default: CockpitButtonProps = {
        visualMeaning: ObjectVisualMeaning.UI_NO_HIGHLIGHT,
        variant: CockpitButtonType.KEY_VAL,
        onActiveChange: () => {},
        initialActiveState: false,
        title: "",
        value: "",
        multiColorMode: true
    }

    constructor(props: CockpitButtonPropsPartial) {
        super({...CockpitButton.default, ...props}, undefined, undefined);
    }

    init() {
        super.init();
        this.assembly.assembly(CockpitButtonType.KEY_VAL, (theme, props) => {
            const p: CockpitButtonProps = this.props as CockpitButtonProps;
            return (
                <Togglable initialActiveState={p.initialActiveState} onChange={active => getOr(p.onActiveChange, CockpitButton.default.onActiveChange)(p, active)} active={
                    (() => {
                        const vm: ObjectVisualMeaning = p.multiColorMode ? getOr(p.visualMeaning, ObjectVisualMeaning.INFO) : ObjectVisualMeaning.INFO;
                        return (
                            <Box noPadding highlight cursor={Cursor.pointer} visualMeaning={vm} opaque={!p.multiColorMode}>
                                <PosInCenter fullHeight>
                                    <Text text={`**${p.title}**`} uppercase cursor={Cursor.pointer} visualMeaning={vm} coloredText={false}/>
                                </PosInCenter>
                                <Separator visualMeaning={vm}/>
                                <PosInCenter fullHeight>
                                    <Text text={`${p.valueFactory ? p.valueFactory(this) : p.value}`} uppercase cursor={Cursor.pointer}/>
                                </PosInCenter>
                            </Box>
                        );
                    })()
                } inactive={
                    (() => {
                        const vm: ObjectVisualMeaning = p.multiColorMode ? getOr(p.visualMeaning, ObjectVisualMeaning.UI_NO_HIGHLIGHT) : ObjectVisualMeaning.UI_NO_HIGHLIGHT;
                        return (
                            <Box noPadding highlight cursor={Cursor.pointer} visualMeaning={vm} opaque={true}>
                                <PosInCenter fullHeight>
                                    <Text text={`**${p.title}**`} uppercase cursor={Cursor.pointer} visualMeaning={vm} coloredText/>
                                </PosInCenter>
                                <Separator visualMeaning={vm}/>
                                <PosInCenter fullHeight>
                                    <Text text={`${p.valueFactory ? p.valueFactory(this) : p.value}`} uppercase cursor={Cursor.pointer}/>
                                </PosInCenter>
                            </Box>
                        );
                    })()
                }/>
            );
        });
    }

    componentRender(p: CockpitButtonProps, s: any, l: any, t: Themeable.Theme, a: Assembly): JSX.Element | undefined {
        return this.assembly.render({
            component: this.props.variant as string
        });
    }
}
