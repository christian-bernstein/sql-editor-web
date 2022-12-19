import {BC} from "../../../logic/BernieComponent";
import {Assembly} from "../../../logic/assembly/Assembly";
import {Themeable} from "../../../logic/style/Themeable";
import {Group} from "../../lo/Group";
import {Orientation} from "../../../logic/style/Orientation";
import {Box} from "../../lo/Box";
import {DimensionalMeasured, percent, px} from "../../../logic/style/DimensionalMeasured";
import {Color} from "../../../logic/style/Color";
import {array, getOr} from "../../../logic/Utils";
import {Flex} from "../../lo/FlexBox";
import {Text, TextType} from "../../lo/Text";
import {Input} from "../../lo/Input";
import _ from "lodash";
import {Align} from "../../../logic/style/Align";
import {Justify} from "../../../logic/style/Justify";
import {Separator} from "../../lo/Separator";
import {LiteGrid} from "../../lo/LiteGrid";
import {AF} from "../../logic/ArrayFragment";
import {Cursor} from "../../../logic/style/Cursor";
import {FormDataHub} from "../../../libs/epicure/components/FormDataHub";
import {utilizeGlobalTheme} from "../../../logic/app/App";
import {If} from "../../logic/If";
import {Button} from "../../lo/Button";
import React from "react";
import {ColorSelectorWidgetsConfig} from "./ColorSelectorWidgetsConfig";
import {ColorSelectorWidgetID} from "./ColorSelectorWidgetID";

export interface ColorSelectorActions {
    onChange?(hex: string): void,
    onSubmit?(hex: string): void
}

export type ColorSelectorProps = {
    palettes?: Map<string, Array<Color>>,
    showHistoryPalette?: boolean,
    showThemePalette?: boolean,
    initialColor?: Color,

    // TODO: Use
    showReadabilityTest?: boolean,

    actions: ColorSelectorActions,
    width?: DimensionalMeasured,

    submittable?: boolean,
    toplevelWidgetsConfig?: ColorSelectorWidgetsConfig
}

export type ColorSelectorLocalState = {
    hex?: string,
    r?: string,
    g?: string,
    b?: string,
    debouncedColorChange: (hex: string,submit: boolean) => void,
    fdh: FormDataHub,
}

/**
 * TODO: implement https://www.npmjs.com/package/complementary-colors,
 * TODO: implement context menu -> random color, complementary color view, visibility check
 */
export class ColorSelector extends BC<ColorSelectorProps, any, ColorSelectorLocalState> {

    public static maxHistoryLength: number = 10;

    constructor(props: ColorSelectorProps) {
        super(props, undefined, {
            fdh: new FormDataHub("ColorSelector").loadFromLocalStore(),
            debouncedColorChange: _.debounce((hex: string, submit: boolean) => this.setCurrentColorImmediately(hex, submit), 500)
        });
    }

    init() {
        super.init();
        this.previewAssembly();
        this.palettesAssembly();
        this.hexAssembly();
        this.rgbAssembly();
        this.submitAssembly();
    }

    private setCurrentColorImmediately(hex: string, submit: boolean) {
        this.local.setStateWithChannels({
            hex: hex
        }, ["master-color"], () => {
            this.appendColorToHistory(hex);
            this.props.actions.onChange?.(hex);

            if (submit) {
                this.props.actions.onSubmit?.(hex);
            }
        });
    }

    private appendColorToHistory(hex: string) {
        const history = this.loadHexHistory();
        if (history.filter(col => col === hex).length > 0) {
            return;
        }
        history.push(hex);

        if (history.length > ColorSelector.maxHistoryLength) {
            history.shift();
        }

        this.local.state.fdh.set("history", history, true);
        this.rerender("history");
    }

    private loadHexHistory(): Array<string> {
        return this.local.state.fdh.getOrSave("history", []);
    }

    private loadHistory(): Array<Color> {
        return this.loadHexHistory().map(hex => Color.ofHex(hex));
    }

    private getPalettes(): Map<string, Array<Color>> {
        const palettes = new Map<string, Array<Color>>(this.props.palettes);
        if (this.props.showHistoryPalette) {
            palettes.set("history", this.loadHistory());
        }
        if (this.props.showThemePalette) {
            const theme = utilizeGlobalTheme();
            palettes.set("Theme", Object.entries(theme.colors).map(pair => pair[1]));
        }
        return palettes;
    }

    private getCurrentColor(): Color {
        return Color.ofHex(getOr(this.local.state.hex, getOr(this.props.initialColor?.toHex(""), "#FFFFFF")));
    }

    private setCurrentColor(hex: string, submit: boolean = false) {
        // TODO: check validity
        this.local.state.debouncedColorChange(hex, submit);
    }

    private palettesAssembly() {
        this.assembly.assembly("palettes", theme => {
            return (
                <Flex padding fw elements={[
                    <Text text={"Palettes"}/>,

                    ...Array.from(this.getPalettes()).map(([key, value]) => ({ key, value })).map(pair => {
                        return (
                            <Flex fw gap={theme.gaps.smallGab} elements={[
                                <Text text={pair.key} uppercase type={TextType.secondaryDescription} fontSize={px(11)}/>,
                                <LiteGrid responsive minResponsiveWidth={px(24)} gap={theme.gaps.smallGab} children={
                                    <AF elements={
                                        pair.value.map(color => (
                                            <Flex fw fh align={Align.CENTER} justifyContent={Justify.CENTER} elements={[
                                                <Box
                                                    cursor={Cursor.pointer}
                                                    noPadding
                                                    width={px(24)}
                                                    height={px(24)}
                                                    bgColor={color}
                                                    onClick={() => this.setCurrentColorImmediately(color.toHex(""), false)}
                                                />
                                            ]}/>
                                        ))
                                    }/>
                                }/>
                            ]}/>
                        );
                    })

                ]}/>
            );
        })
    }

    private submitAssembly() {
        this.assembly.assembly("submit", theme => {
            return (
                <Flex fw padding gap={theme.gaps.smallGab} elements={[
                    <Button width={percent(100)} onClick={event => {
                        this.props.actions.onSubmit?.(this.getCurrentColor().toHex());
                    }} children={
                        <Flex gap={px(0)} align={Align.CENTER} fw elements={[
                            <Text
                                bold
                                text={"Select color"}
                            />,
                            <Text
                                text={`${this.getCurrentColor().toHex()}`}
                                type={TextType.secondaryDescription}
                                fontSize={px(11)}
                                align={Align.CENTER}
                            />
                        ]}/>
                    }/>
                ]}/>
            );
        })
    }

    private previewAssembly() {
        this.assembly.assembly("preview", theme => {
            return (
                <Flex fw style={{ position: "relative" }} elements={[
                    <Box width={percent(100)} height={px(100)} borderless bgColor={this.getCurrentColor()} borderRadiiConfig={{
                        enableCustomBorderRadii: true,
                        fallbackCustomBorderRadii: px()
                    }}/>,
                    <Flex fw fh style={{ position: "absolute", top: 0, left: 0}} align={Align.CENTER} gap={px(10)} justifyContent={Justify.CENTER} elements={[
                        <If condition={this.props.showReadabilityTest} ifTrue={
                            <AF elements={[
                                <Text
                                    text={this.getCurrentColor().toHex()}
                                    bold
                                    fontSize={px(30)}
                                    uppercase
                                    color={Color.ofHex("#FFFFFF")}
                                    coloredText
                                    // type={TextType.displayText}
                                />,
                                <Text
                                    text={this.getCurrentColor().toHex()}
                                    bold
                                    fontSize={px(30)}
                                    uppercase
                                    color={Color.ofHex("#000000")}
                                    coloredText
                                    // type={TextType.displayText}
                                />
                            ]}/>
                        }/>
                    ]}/>
                ]}/>
            );
        })
    }

    private hexAssembly() {
        this.assembly.assembly("hex", theme => {
            return (
                <Box width={percent(100)} children={
                    <Flex gap={theme.gaps.smallGab} fw elements={[
                        <Text text={"HEX"}/>,
                        <Input pattern={"#*[a-fA-F\\d]+"} placeholder={"#FF32A5"} fontWeight={"lighter"} onChange={ev => {
                            let value = ev.target.value.replaceAll("#", "").trim();
                            const chars = Array.from(value);
                            const len = chars.length;
                            if (len === 3) {
                                const hex = `${array(chars[0], 2).join("")}${array(chars[1], 2).join("")}${array(chars[2], 2).join("")}`;
                                this.setCurrentColor(hex);
                            } else if (len === 6) {
                                this.setCurrentColor(value);
                            } else {
                                const missing = 6 - len;
                                const hex = `${value}${array(0, missing).join("")}`.slice(0, 6);
                                this.setCurrentColor(hex);
                            }
                        }}/>
                    ]}/>
                }/>
            );
        })
    }

    private rgbAssembly() {
        this.assembly.assembly("rgb", theme => {
            return (
                <Box width={percent(100)} children={
                    <Flex gap={theme.gaps.smallGab} fw elements={[
                        <Text text={"RGB"}/>,

                        <Group width={percent(100)} removeChildBorders orientation={Orientation.HORIZONTAL} elements={[
                            <Input inputMode={"numeric"} type={"number"} min={"0"} max={"255"} defaultValue={`${this.getCurrentColor().r}`} placeholder={"Red"} fontWeight={"lighter"} onChange={ev => {
                                const value: number = Number(ev.target.value);
                                if (value >= 0 && value <= 255) {
                                    const newCol = this.getCurrentColor();
                                    newCol.r = value
                                    this.setCurrentColor(newCol.toHex(""));
                                }
                            }}/>,
                            <Separator orientation={Orientation.VERTICAL}/>,
                            <Input inputMode={"numeric"} type={"number"} min={"0"} max={"255"} defaultValue={`${this.getCurrentColor().g}`} placeholder={"Green"} fontWeight={"lighter"} onChange={ev => {
                                const value: number = Number(ev.target.value);
                                if (value >= 0 && value <= 255) {
                                    const newCol = this.getCurrentColor();
                                    newCol.g = value
                                    this.setCurrentColor(newCol.toHex(""));
                                }
                            }}/>,
                            <Separator orientation={Orientation.VERTICAL}/>,
                            <Input inputMode={"numeric"} type={"number"} min={"0"} max={"255"} defaultValue={`${this.getCurrentColor().b}`} placeholder={"Blue"} fontWeight={"lighter"} onChange={ev => {
                                const value: number = Number(ev.target.value);
                                if (value >= 0 && value <= 255) {
                                    const newCol = this.getCurrentColor();
                                    newCol.b = value
                                    this.setCurrentColor(newCol.toHex(""));
                                }
                            }}/>,
                        ]}/>,
                    ]}/>
                }/>
            );
        })
    }

    private renderWidget(id: ColorSelectorWidgetID, renderer: () => JSX.Element, additionalPredicate?: () => boolean): JSX.Element {
        if (additionalPredicate !== undefined && !additionalPredicate()) {
            return (
                <></>
            );
        }
        if (this.props.toplevelWidgetsConfig === undefined) {
            return renderer();
        }
        if (this.props.toplevelWidgetsConfig[id] === undefined || this.props.toplevelWidgetsConfig[id]?.enable) {
            return renderer();
        }
        return (
            <></>
        );
    }

    componentRender(p: ColorSelectorProps, s: any, l: ColorSelectorLocalState, t: Themeable.Theme, a: Assembly): JSX.Element | undefined {
        return (
            <Group width={p.width} orientation={Orientation.VERTICAL} elements={[
                this.component(() => this.a("preview"), "master-color"),

                this.renderWidget(
                    ColorSelectorWidgetID.PALETTES,
                    () => this.component(() => this.a("palettes"), "history"),
                ),

                this.renderWidget(
                    ColorSelectorWidgetID.HEX,
                    () => this.a("hex")
                ),

                this.renderWidget(
                    ColorSelectorWidgetID.RGB,
                    () => this.component(() => this.a("rgb"), "master-color")
                ),

                p.submittable ? this.component(() => this.a("submit"), "master-color") : <></>
            ]}/>
        );
    }
}
