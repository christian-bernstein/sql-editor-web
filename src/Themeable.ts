import {Color} from "./Color";
import {DimensionalMeasured} from "./logic/DimensionalMeasured";
import {Dimension} from "./logic/Dimension";
import {CSSProperties} from "react";

export namespace Themeable {

    export type ColorPallet = {
        backgroundColor: Color,
        backgroundHighlightColor: Color,
        backgroundDeactivatedColor: Color,
        iconColor: Color,
        fontPrimaryColor: Color,
        fontPrimaryInvertedColor: Color,
        fontSecondaryColor: Color,
        fontDeactivatedColor: Color,
        primaryColor: Color,
        primaryHighlightColor: Color,
        errorColor: Color,
        warnColor: Color,
        borderPrimaryColor: Color,
        borderColorSecondaryColor: Color,
        borderPrimaryShadowColor: Color
    }

    export type Theme = {
        colors: ColorPallet,
        radii: {
            defaultObjectRadius: DimensionalMeasured
        },
        margins: {
            smallTextVerticalMargin: DimensionalMeasured
        },
        paddings: {
            defaultObjectPadding: DimensionalMeasured
        },
        hovers: {
            hoverLightFilter: DimensionalMeasured
        },
        texts: {
            fontFamily: string,
            complete: {
                boldSmallHeader: CSSProperties,
                boldSmallHeaderDeactivated: CSSProperties,
                secondaryDescription: CSSProperties
            }
        }
    }

    export const defaultThemePallet: ColorPallet = {
        backgroundColor: Color.ofHex("#171717"),
        backgroundHighlightColor: Color.ofHex("#222429"),
        backgroundDeactivatedColor: Color.ofHex("#434750"),
        iconColor: Color.ofHex("#FFFFFF"),
        fontPrimaryColor: Color.ofHex("#FFFFFF"),
        fontPrimaryInvertedColor: Color.ofHex("#000000"),
        fontSecondaryColor: Color.ofHex("#C6C6C6"),
        fontDeactivatedColor: Color.ofHex("#4F4F4F"),
        primaryColor: Color.ofHex("#71D99E"),
        primaryHighlightColor: Color.ofHex("#A9E5C3"),
        errorColor: Color.ofHex("#D93240"),
        warnColor: Color.ofHex("#FBBE63"),
        borderPrimaryColor: Color.ofHex("#3E3E3E"),
        borderColorSecondaryColor: Color.ofHex("#FBBE63"),
        borderPrimaryShadowColor: Color.ofHex("#71D99E", .13)
    }

    export const defaultTheme: Theme = {
        colors: defaultThemePallet,
        radii: {
            defaultObjectRadius: DimensionalMeasured.of(6, Dimension.px)
        },
        margins: {
            smallTextVerticalMargin: DimensionalMeasured.of(3, Dimension.px)
        },
        paddings: {
            defaultObjectPadding: DimensionalMeasured.of(16, Dimension.px)
        },
        hovers: {
            hoverLightFilter: DimensionalMeasured.of(120, Dimension.percentage)
        },
        texts: {
            // todo implement global font family
            fontFamily: "Operator Mono",
            complete: {
                boldSmallHeader: {
                    margin: 0,
                    fontFamily: "OperatorMono",
                    fontStyle: "normal",
                    fontWeight: "bold",
                    fontSize: "16px",
                    lineHeight: "19px",
                    display: "flex",
                    alignItems: "center",
                    letterSpacing: "0.03em",
                    color: `${defaultThemePallet.fontPrimaryColor.css()}`
                },
                boldSmallHeaderDeactivated: {
                    margin: 0,
                    fontFamily: "OperatorMono",
                    fontStyle: "normal",
                    fontWeight: "bold",
                    fontSize: "16px",
                    lineHeight: "19px",
                    display: "flex",
                    alignItems: "center",
                    letterSpacing: "0.03em",
                    color: `${defaultThemePallet.fontDeactivatedColor.css()}`
                },
                secondaryDescription: {
                    margin: 0,
                    fontFamily: "OperatorMono",
                    fontStyle: "normal",
                    fontWeight: 350,
                    fontSize: "14px",
                    lineHeight: "17px",
                    display: "flex",
                    alignItems: "center",
                    letterSpacing: "0.03em",
                    color: `${defaultThemePallet.fontSecondaryColor.css()}`
                }
            }
        }

    }
}
