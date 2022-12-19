import {BC} from "../../sql/logic/BernieComponent";
import {Themeable} from "../../sql/logic/style/Themeable";
import {Assembly} from "../../sql/logic/assembly/Assembly";
import {Flex} from "../../sql/components/lo/FlexBox";
import {DrawerHeader} from "../../sql/components/lo/DrawerHeader";
import {ObjectVisualMeaning, VM} from "../../sql/logic/style/ObjectVisualMeaning";
import {createMargin} from "../../sql/logic/style/Margin";
import React from "react";
import {Color} from "../../sql/logic/style/Color";
import {ColorSelector} from "../../sql/components/ho/colorSelector/ColorSelector";
import {percent, px} from "../../sql/logic/style/DimensionalMeasured";
import {Button} from "../../sql/components/lo/Button";
import {Align} from "../../sql/logic/style/Align";
import {Badge} from "../../sql/components/lo/Badge";
import {Text, TextType} from "../../sql/components/lo/Text";
import {ColorSelectorWidgetID} from "../../sql/components/ho/colorSelector/ColorSelectorWidgetID";
import {appleSystem} from "../../sql/components/ho/colorSelector/ColorSelectorDefaultPalettes";

export type ColorSelectorDialogProps = {
    onSubmit: (hex: string) => void,
    hex: string
}

export type ColorSelectorDialogLocalState = {
    hex?: string
}

export class ColorSelectorDialog extends BC<ColorSelectorDialogProps, any, ColorSelectorDialogLocalState> {

    constructor(props: ColorSelectorDialogProps) {
        super(props, undefined, {
            hex: props.hex
        });
    }

    componentRender(p: ColorSelectorDialogProps, s: any, l: ColorSelectorDialogLocalState, t: Themeable.Theme, a: Assembly): JSX.Element | undefined {
        return (
            <Flex fw elements={[
                <DrawerHeader
                    header={"Select a color"}
                    enableBadge
                    badgeVM={VM.UI_NO_HIGHLIGHT}
                    badgeText={"Color"}
                    description={"Choose a color with the color-picker. If you are satisfied with the color, press '**Select color**' to confirm."}
                    margin={createMargin(0, 0, 40, 0)}
                />,

                <ColorSelector initialColor={Color.ofHex(p.hex)} submittable width={percent(100)} actions={{
                    onSubmit: (hex: string) => {
                        this.props.onSubmit(hex);
                    }
                }} toplevelWidgetsConfig={{
                    hex: {
                        enable: false
                    },
                    rgb: {
                        enable: false
                    }
                }} palettes={new Map<string, Array<Color>>([
                    ["main", appleSystem]
                ])}/>
            ]}/>
        );
    }
}
