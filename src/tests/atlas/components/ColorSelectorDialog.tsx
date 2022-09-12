import {BC} from "../../../logic/BernieComponent";
import {Themeable} from "../../../logic/style/Themeable";
import {Assembly} from "../../../logic/assembly/Assembly";
import {Flex} from "../../../components/lo/FlexBox";
import {DrawerHeader} from "../../../components/lo/DrawerHeader";
import {ObjectVisualMeaning, VM} from "../../../logic/style/ObjectVisualMeaning";
import {createMargin} from "../../../logic/style/Margin";
import React from "react";
import {Color} from "../../../logic/style/Color";
import {ColorSelector} from "../../../components/ho/colorSelector/ColorSelector";
import {percent, px} from "../../../logic/style/DimensionalMeasured";
import {Button} from "../../../components/lo/Button";
import {Align} from "../../../logic/style/Align";
import {Badge} from "../../../components/lo/Badge";
import {Text, TextType} from "../../../components/lo/Text";

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

    componentRender(p: any, s: any, l: any, t: Themeable.Theme, a: Assembly): JSX.Element | undefined {
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
                <ColorSelector width={percent(100)} showThemePalette showHistoryPalette actions={{
                    onChange: (hex: string) => {
                        this.local.setStateWithChannels({
                            hex: hex
                        }, ["master-color"])
                    }
                }}/>,
                this.component((local) => (
                    <Flex fw padding={false} paddingX={px(25)} gap={t.gaps.smallGab} elements={[
                        <Button
                            width={percent(100)}
                            onClick={() => this.props.onSubmit(this.local.state.hex as string)}
                            children={
                                <Flex gap={px(0)} align={Align.CENTER} fw elements={[
                                    <Text
                                        bold
                                        text={"Select color"}
                                    />,
                                    <Text
                                        text={`${local.state.hex}`}
                                        type={TextType.secondaryDescription}
                                        fontSize={px(11)}
                                        align={Align.CENTER}
                                    />
                                ]}/>
                            }
                        />
                    ]}/>
                ), "master-color")
            ]}/>
        );
    }
}
