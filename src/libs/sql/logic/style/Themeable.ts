import {Color} from "./Color";
import {DimensionalMeasured, px} from "./DimensionalMeasured";
import {Dimension} from "./Dimension";
import {CSSProperties} from "react";
import {ObjectVisualMeaning} from "./ObjectVisualMeaning";
import {time, TimeMeasured} from "../misc/TimeMeasured";
import {TimeUnit} from "../misc/TimeUnit";
import {ThemeKeys, ThemeObject} from "react-json-view";
import {createTheme, Theme as MUITheme} from "@mui/material";
import {ThemeMultiplexRenderers} from "./ThemeMultiplexRenderers";

export function getMeaningfulColors(meaning: ObjectVisualMeaning, theme: Themeable.Theme): MeaningfulColors {
    switch (meaning) {
        case ObjectVisualMeaning.SUCCESS:
            return {
                main: theme.colors.primaryColor,
                lighter: theme.colors.primaryHighlightColor,
                iconColored: theme.colors.primaryHighlightColor,
                icon: theme.colors.iconColor,
                shadowColor: theme.colors.primaryHighlightColor.withAlpha(0.1)
            };
        case ObjectVisualMeaning.INFO:
            return {
                main: theme.colors.primaryColor,
                lighter: theme.colors.primaryHighlightColor,
                iconColored: theme.colors.primaryHighlightColor,
                icon: theme.colors.iconColor,
                shadowColor: theme.colors.primaryHighlightColor.withAlpha(0.1)
            };
        case ObjectVisualMeaning.WARNING:
            return {
                main: theme.colors.warnColor,
                lighter: theme.colors.warnHighlightColor,
                iconColored: theme.colors.warnHighlightColor,
                icon: theme.colors.iconColor,
                shadowColor: theme.colors.warnHighlightColor.withAlpha(0.1)
            };
        case ObjectVisualMeaning.ERROR:
            return {
                main: theme.colors.errorColor,
                lighter: theme.colors.errorHighlightColor,
                iconColored: theme.colors.errorHighlightColor,
                icon: theme.colors.iconColor,
                shadowColor: theme.colors.errorHighlightColor.withAlpha(0.1)
            };
        case ObjectVisualMeaning.UI_NO_HIGHLIGHT:
            return {
                main: theme.colors.backgroundHighlightColor,
                // todo choose more consistent way
                lighter: theme.colors.borderPrimaryColor,
                iconColored: theme.colors.borderPrimaryColor,
                icon: theme.colors.iconColor,
                shadowColor: theme.colors.borderPrimaryColor.withAlpha(0.1)
            };
        case ObjectVisualMeaning.BETA:
            return {
                main: theme.colors.betaColor,
                lighter: theme.colors.betaHighlightColor,
                iconColored: theme.colors.betaHighlightColor,
                icon: theme.colors.iconColor,
                shadowColor: theme.colors.betaHighlightColor.withAlpha(0.1)
            }
        case ObjectVisualMeaning.SUCCESS_DEFAULT:
            return {
                main: theme.colors.green,
                lighter: theme.colors.greenHighlight,
                iconColored: theme.colors.greenHighlight,
                icon: theme.colors.greenHighlight,
                shadowColor: theme.colors.greenHighlight.withAlpha(0.1)
            };
    }
}

export type MeaningfulColors = {
    main: Color,
    lighter: Color,
    icon: Color,
    iconColored: Color,
    shadowColor: Color
}

export namespace Themeable {

    export function getAllThemes(): Map<string, Theme> {
        return new Map<string, Themeable.Theme>([
            ["dark-green", Themeable.defaultTheme],
            ["light-green", Themeable.lightTheme],
            ["dark-tritanopia", Themeable.darkTritanopiaTheme],
            ["black", Themeable.blackTheme],
            ["mala", Themeable.malaTheme],
        ])
    }

    export function createColorPallet(partial: Partial<ColorPallet>, parent?: ColorPallet): ColorPallet {
        return {...(parent === undefined ? defaultThemePallet : parent), ...partial};
    }

    export function theme(partial: Partial<Theme> ): Theme {
        return {...defaultTheme, ...partial};
    }

    export type ColorPallet = {
        backgroundColor: Color,
        backgroundColorOuter: Color,
        backgroundHighlightColor: Color,
        backgroundHighlightColor200: Color,
        backgroundHighlightInputColor: Color,
        backgroundDeactivatedColor: Color,
        tooltipBackgroundColor: Color,
        tooltipPrimaryFontColor: Color,
        iconColor: Color,
        fontPrimaryColor: Color,
        fontPrimaryInvertedColor: Color,
        fontSecondaryColor: Color,
        fontDeactivatedColor: Color,
        primaryColor: Color,
        primaryHighlightColor: Color,
        errorColor: Color,
        errorHighlightColor: Color,
        warnColor: Color,
        warnHighlightColor: Color,
        borderPrimaryColor: Color,
        borderColorSecondaryColor: Color,
        borderPrimaryShadowColor: Color,
        backdropColor: Color,
        betaColor: Color,
        betaHighlightColor: Color,
        green: Color,
        greenHighlight: Color
    }

    export type Theme = {
        displayName: string,
        colors: ColorPallet,
        mode: "dark" | "light",
        muiTheme: MUITheme,
        alpha: {
            opaqueUI: number
        },
        radii: {
            defaultObjectRadius: DimensionalMeasured
        },
        margins: {
            smallTextVerticalMargin: DimensionalMeasured
        },
        paddings: {
            defaultBadgePadding: DimensionalMeasured,
            defaultObjectPadding: DimensionalMeasured,
            defaultButtonPadding: DimensionalMeasured,
            defaultTextIconPadding: DimensionalMeasured,
        },
        gaps: {
            defaultGab: DimensionalMeasured,
            smallGab: DimensionalMeasured,
        },
        hovers: {
            hoverLightFilter: DimensionalMeasured,
            clickLightFilter: DimensionalMeasured,
        },
        transitions: {
            mainTime: TimeMeasured,
            fastTime: TimeMeasured,
        },
        texts: {
            fontFamily: string,
            displayFontFamily: string,
            complete: {
                // Monospaced style category
                boldLargeHeader: CSSProperties,
                boldSmallHeader: CSSProperties,
                defaultText: CSSProperties,
                boldSmallHeaderDeactivated: CSSProperties,
                secondaryDescription: CSSProperties,

                // Display is a style category with non-monospaced fonts
                displayText: CSSProperties,
                displayDescription: CSSProperties,
            }
        },
        libraries: {
            reactJson: {
                theme: ThemeKeys | ThemeObject
            }
        }
    }

    export const defaultThemePallet: ColorPallet = {
        backgroundColor: Color.ofHex("#171717"),
        backgroundColorOuter: Color.ofHex("#080808"),
        backgroundHighlightColor: Color.ofHex("#222429"),
        backgroundHighlightColor200: Color.ofHex("#282c34"),
        backgroundHighlightInputColor: Color.ofHex("#282c34"),
        backgroundDeactivatedColor: Color.ofHex("#434750"),
        tooltipBackgroundColor: Color.ofHex("#171717"),
        tooltipPrimaryFontColor: Color.ofHex("#DEDFE0"),
        iconColor: Color.ofHex("#FFFFFF"),
        fontPrimaryColor: Color.ofHex("#FFFFFF"),
        fontPrimaryInvertedColor: Color.ofHex("#000000"),
        fontSecondaryColor: Color.ofHex("#C6C6C6"),
        fontDeactivatedColor: Color.ofHex("#4F4F4F"),
        primaryColor: Color.ofHex("#71D99E"),
        primaryHighlightColor: Color.ofHex("#A9E5C3"),
        errorColor: Color.ofHex("#D93240"),
        errorHighlightColor: Color.ofHex("#e55561"),
        warnColor: Color.ofHex("#FBBE63"),
        warnHighlightColor: Color.ofHex("#ffd387"),
        borderPrimaryColor: Color.ofHex("#30363D"),
        borderColorSecondaryColor: Color.ofHex("#FBBE63"),
        borderPrimaryShadowColor: Color.ofHex("#71D99E", .13),
        backdropColor: Color.ofHex("#171717", .8),
        betaColor: Color.ofHex("#8957e5"),
        betaHighlightColor: Color.ofHex("#a371f7"),
        green: Color.ofHex("#71D99E"),
        greenHighlight: Color.ofHex("#A9E5C3"),
    }

    export const darkTritanopiaThemePallet: ColorPallet = {
        backgroundColor: Color.ofHex("#0d1117"),
        backgroundColorOuter: Color.ofHex("#161b22"),
        backgroundHighlightColor: Color.ofHex("#161b22"),
        backgroundHighlightColor200: Color.ofHex("#282c34"),
        backgroundHighlightInputColor: Color.ofHex("#282c34"),
        backgroundDeactivatedColor: Color.ofHex("#434750"),
        // tooltipBackgroundColor: Color.ofHex("#2b2c2e"),
        tooltipBackgroundColor: Color.ofHex("#171717"),
        tooltipPrimaryFontColor: Color.ofHex("#DEDFE0"),
        iconColor: Color.ofHex("#FFFFFF"),
        fontPrimaryColor: Color.ofHex("#FFFFFF"),
        fontPrimaryInvertedColor: Color.ofHex("#000000"),
        fontSecondaryColor: Color.ofHex("#C6C6C6"),
        fontDeactivatedColor: Color.ofHex("#4F4F4F"),
        primaryColor: Color.ofHex("#58a6ff"),
        primaryHighlightColor: Color.ofHex("#58a6ff"),
        errorColor: Color.ofHex("#D93240"),
        errorHighlightColor: Color.ofHex("#e55561"),
        warnColor: Color.ofHex("#FBBE63"),
        warnHighlightColor: Color.ofHex("#ffd387"),
        borderPrimaryColor: Color.ofHex("#30363D"),
        borderColorSecondaryColor: Color.ofHex("#FBBE63"),
        borderPrimaryShadowColor: Color.ofHex("#388bfd", .13),
        backdropColor: Color.ofHex("#171717", .8),
        betaColor: Color.ofHex("#8957e5"),
        betaHighlightColor: Color.ofHex("#a371f7"),
        green: Color.ofHex("#71D99E"),
        greenHighlight: Color.ofHex("#A9E5C3"),
    }

    export const lightThemePallet: ColorPallet = createColorPallet({
        backgroundColor: Color.ofHex("#ffffff"),
        backgroundColorOuter: Color.ofHex("#ffffff"),
        // backgroundColorOuter: Color.ofHex("#EDF2F8"),
        backgroundHighlightColor: Color.ofHex("#ffffff"),
        // backgroundHighlightColor: Color.ofHex("#f0f2f5"),
        backgroundHighlightColor200: Color.ofHex("#ffffff"),
        backgroundHighlightInputColor: Color.ofHex("#ffffff"),
        backgroundDeactivatedColor: Color.ofHex("#ffffff"),
        // tooltipBackgroundColor: Color.ofHex("#323335"),
        tooltipBackgroundColor: Color.ofHex("#171717"),
        tooltipPrimaryFontColor: Color.ofHex("#DEDFE0"),
        iconColor: Color.ofHex("#000000"),
        fontPrimaryColor: Color.ofHex("#000000"),
        fontPrimaryInvertedColor: Color.ofHex("#ffffff"),
        fontSecondaryColor: Color.ofHex("#484848"),
        fontDeactivatedColor: Color.ofHex("#4F4F4F"),
        // primaryColor: Color.ofHex("#71D99E"),
        primaryColor: Color.ofHex("#58a6ff"),
        // primaryHighlightColor: Color.ofHex("#A9E5C3"),
        primaryHighlightColor: Color.ofHex("#58a6ff"),
        errorColor: Color.ofHex("#D93240"),
        errorHighlightColor: Color.ofHex("#e55561"),
        warnColor: Color.ofHex("#FBBE63"),
        warnHighlightColor: Color.ofHex("#ffd387"),
        borderPrimaryColor: Color.ofHex("#c4c4c4"),
        borderColorSecondaryColor: Color.ofHex("#FBBE63"),
        // borderPrimaryShadowColor: Color.ofHex("#71D99E", .13),
        borderPrimaryShadowColor: Color.ofHex("#388bfd", .13),
        backdropColor: Color.ofHex("#171717", .8)
    })

    export const darkTritanopiaTheme: Theme = {
        displayName: "Dark tritanoptia",
        colors: darkTritanopiaThemePallet,
        mode: "dark",
        muiTheme: createTheme({
            palette: {
                mode: 'dark',
                primary: {
                    main: darkTritanopiaThemePallet.primaryColor.css(),
                    light: darkTritanopiaThemePallet.primaryHighlightColor.css(),
                }
            },
            typography: {
                fontFamily: "OperatorMono"
            }
        }),
        alpha: {
            opaqueUI: .1
        },
        radii: {
            // defaultObjectRadius: px(6)
            defaultObjectRadius: px(8)
        },
        margins: {
            smallTextVerticalMargin: px(3)
        },
        paddings: {
            defaultBadgePadding: px(2),
            defaultObjectPadding: px(16),
            defaultButtonPadding: px(8),
            defaultTextIconPadding: px(4)
        },
        gaps: {
            defaultGab: px(16),
            smallGab: px(8)
        },
        hovers: {
            hoverLightFilter: DimensionalMeasured.of(120, Dimension.percentage),
            clickLightFilter: DimensionalMeasured.of(130, Dimension.percentage),
        },
        transitions: {
            mainTime: time(100, TimeUnit.ms),
            fastTime: time(50, TimeUnit.ms)
        },
        texts: {
            // todo implement global font family
            fontFamily: "Operator Mono",
            displayFontFamily: "Whitney",
            complete: {
                boldLargeHeader: {
                    fontFamily: "OperatorMono",
                    fontStyle: "normal",
                    fontWeight: "bold",
                    fontSize: px(40).css(),
                    lineHeight: px(50).css(),
                    display: "flex"
                },
                boldSmallHeader: {
                    margin: 0,
                    fontFamily: "OperatorMono",
                    fontStyle: "normal",
                    fontWeight: "bold",
                    fontSize: "16px",
                    lineHeight: "19px",
                    display: "flex",
                    alignItems: "center",
                    // letterSpacing: "0.03em",
                    color: `${defaultThemePallet.fontPrimaryColor.css()}`
                },
                defaultText: {
                    margin: 0,
                    fontFamily: "OperatorMono",
                    fontStyle: "normal",
                    fontWeight: 350,
                    fontSize: "14px",
                    lineHeight: "19px",
                    display: "flex",
                    alignItems: "center",
                    // letterSpacing: "0.03em",
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
                    // letterSpacing: "0.03em",
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
                    //letterSpacing: "0.03em",
                    color: `${defaultThemePallet.fontSecondaryColor.css()}`
                },
                displayText: {
                    margin: 0,
                    fontFamily: "Whitney",
                    fontStyle: "normal",
                    fontWeight: 350,
                    fontSize: "14px",
                    // lineHeight: "19px",
                    display: "flex",
                    alignItems: "center",
                    color: `${defaultThemePallet.fontPrimaryColor.css()}`
                },
                displayDescription: {
                    margin: 0,
                    fontFamily: "Whitney",
                    fontStyle: "normal",
                    fontWeight: 350,
                    fontSize: "14px",
                    lineHeight: "17px",
                    display: "flex",
                    alignItems: "center",
                    //letterSpacing: "0.03em",
                    color: `${defaultThemePallet.fontSecondaryColor.css()}`
                },
            }
        },
        libraries: {
            reactJson: {
                theme: "grayscale"
            }
        }
    }

    export const defaultTheme: Theme = {
        displayName: "Default theme",
        colors: defaultThemePallet,
        mode: "dark",
        muiTheme: createTheme({
            palette: {
                mode: 'dark',
                primary: {
                    main: defaultThemePallet.primaryColor.css(),
                    light: defaultThemePallet.primaryHighlightColor.css(),
                }
            },
            typography: {
                fontFamily: "OperatorMono"
            }
        }),
        alpha: {
            opaqueUI: .1
        },
        radii: {
            defaultObjectRadius: px(6)
        },
        margins: {
            smallTextVerticalMargin: px(3)
        },
        paddings: {
            defaultBadgePadding: px(2),
            defaultObjectPadding: px(16),
            defaultButtonPadding: px(8),
            defaultTextIconPadding: px(4)
        },
        gaps: {
            defaultGab: px(16),
            smallGab: px(8)
        },
        hovers: {
            hoverLightFilter: DimensionalMeasured.of(120, Dimension.percentage),
            clickLightFilter: DimensionalMeasured.of(130, Dimension.percentage),
        },
        transitions: {
            mainTime: time(100, TimeUnit.ms),
            fastTime: time(50, TimeUnit.ms)
        },
        texts: {
            // todo implement global font family
            fontFamily: "Operator Mono",
            displayFontFamily: "Whitney",
            complete: {
                boldLargeHeader: {
                    fontFamily: "OperatorMono",
                    fontStyle: "normal",
                    fontWeight: "bold",
                    fontSize: px(40).css(),
                    lineHeight: px(50).css(),
                    display: "flex"
                },
                boldSmallHeader: {
                    margin: 0,
                    fontFamily: "OperatorMono",
                    fontStyle: "normal",
                    fontWeight: "bold",
                    fontSize: "16px",
                    lineHeight: "19px",
                    display: "flex",
                    alignItems: "center",
                    // letterSpacing: "0.03em",
                    color: `${defaultThemePallet.fontPrimaryColor.css()}`
                },
                defaultText: {
                    margin: 0,
                    fontFamily: "OperatorMono",
                    fontStyle: "normal",
                    fontWeight: 350,
                    fontSize: "14px",
                    lineHeight: "19px",
                    display: "flex",
                    alignItems: "center",
                    // letterSpacing: "0.03em",
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
                    // letterSpacing: "0.03em",
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
                    //letterSpacing: "0.03em",
                    color: `${defaultThemePallet.fontSecondaryColor.css()}`
                },
                displayText: {
                    margin: 0,
                    fontFamily: "Whitney",
                    fontStyle: "normal",
                    fontWeight: 350,
                    fontSize: "14px",
                    // lineHeight: "19px",
                    display: "flex",
                    alignItems: "center",
                    color: `${defaultThemePallet.fontPrimaryColor.css()}`
                },
                displayDescription: {
                    margin: 0,
                    fontFamily: "Whitney",
                    fontStyle: "normal",
                    fontWeight: 350,
                    fontSize: "14px",
                    lineHeight: "17px",
                    display: "flex",
                    alignItems: "center",
                    //letterSpacing: "0.03em",
                    color: `${defaultThemePallet.fontSecondaryColor.css()}`
                },
            }
        },
        libraries: {
            reactJson: {
                theme: "grayscale"
            }
        }
    }

    export const lightTheme: Theme = {
        displayName: "Light theme",
        colors: lightThemePallet,
        mode: "light",
        muiTheme: createTheme({
            palette: {
                mode: 'light',
                primary: {
                    main: lightThemePallet.primaryColor.css(),
                    light: lightThemePallet.primaryHighlightColor.css(),
                }
            },
            typography: {
                fontFamily: "OperatorMono"
            }
        }),
        alpha: {
            opaqueUI: .3
        },
        radii: {
            defaultObjectRadius: px(6)
        },
        margins: {
            smallTextVerticalMargin: px(3)
        },
        paddings: {
            defaultBadgePadding: px(2),
            defaultObjectPadding: px(16),
            defaultButtonPadding: px(8),
            defaultTextIconPadding: px(4)
        },
        gaps: {
            defaultGab: px(16),
            smallGab: px(8)
        },
        hovers: {
            hoverLightFilter: DimensionalMeasured.of(90, Dimension.percentage),
            clickLightFilter: DimensionalMeasured.of(80, Dimension.percentage),
        },
        transitions: {
            mainTime: time(100, TimeUnit.ms),
            fastTime: time(50, TimeUnit.ms)
        },
        texts: {
            // todo implement global font family
            fontFamily: "Operator Mono",
            displayFontFamily: "Whitney",
            complete: {
                boldLargeHeader: {
                    fontFamily: "OperatorMono",
                    fontStyle: "normal",
                    fontWeight: "bold",
                    fontSize: px(40).css(),
                    lineHeight: px(50).css(),
                    display: "flex"
                },
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
                    color: `${lightThemePallet.fontPrimaryColor.css()}`
                },
                defaultText: {
                    margin: 0,
                    fontFamily: "OperatorMono",
                    fontStyle: "normal",
                    fontWeight: 350,
                    // fontSize: "14px",
                    fontSize: "12px",
                    lineHeight: "19px",
                    display: "flex",
                    alignItems: "center",
                    letterSpacing: "0.03em",
                    color: `${lightThemePallet.fontPrimaryColor.css()}`
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
                    color: `${lightThemePallet.fontDeactivatedColor.css()}`
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
                    color: `${lightThemePallet.fontSecondaryColor.css()}`
                },
                displayText: {
                    margin: 0,
                    fontFamily: "Whitney",
                    fontStyle: "normal",
                    fontWeight: 350,
                    fontSize: "14px",
                    // lineHeight: "19px",
                    display: "flex",
                    alignItems: "center",
                    color: `${defaultThemePallet.fontPrimaryColor.css()}`
                },
                displayDescription: {
                    margin: 0,
                    fontFamily: "Whitney",
                    fontStyle: "normal",
                    fontWeight: 350,
                    fontSize: "14px",
                    lineHeight: "17px",
                    display: "flex",
                    alignItems: "center",
                    // letterSpacing: "0.03em",
                    color: `${defaultThemePallet.fontSecondaryColor.css()}`
                },
            }
        },
        libraries: {
            reactJson: {
                theme: "grayscale:inverted"
            }
        }
    }

    export const blackTheme = theme({
        colors: createColorPallet({
            backgroundColor: Color.ofHex("#121212"),
            backgroundHighlightColor200: Color.ofHex("#191919"),
            backgroundHighlightColor: Color.ofHex("#171717"),
            backgroundColorOuter: Color.ofHex("#171717"),
            primaryColor: Color.ofHex("#FFCE61"),
            borderPrimaryColor: Color.ofHex("#313131")
        }, darkTritanopiaThemePallet)
    });

    export const malaPallet = createColorPallet({
        backgroundColor: Color.ofHex("#000000"),
        backgroundHighlightColor200: Color.ofHex("#222222"),
        backgroundHighlightColor: Color.ofHex("#ffffff"),
        backgroundColorOuter: Color.ofHex("#171717"),

        primaryColor: Color.ofHex("#FFF387"),
        primaryHighlightColor: Color.ofHex("#FFF387"),
        fontPrimaryColor: Color.ofHex("#000000"),
        fontSecondaryColor: Color.ofHex("#000000"),
    }, darkTritanopiaThemePallet);

    export const malaTheme = theme({
        colors: malaPallet,
        alpha: {
            opaqueUI: .7
        },
        texts: {
            fontFamily: "Whitney",
            displayFontFamily: "Whitney",
            complete: {
                boldLargeHeader: {
                    fontFamily: "Whitney",
                    fontStyle: "normal",
                    fontWeight: "bold",
                    fontSize: px(40).css(),
                    lineHeight: px(50).css(),
                    display: "flex"
                },
                boldSmallHeader: {
                    margin: 0,
                    fontFamily: "Whitney",
                    fontStyle: "normal",
                    fontWeight: "bold",
                    fontSize: "16px",
                    lineHeight: "19px",
                    display: "flex",
                    alignItems: "center",
                    letterSpacing: "0.03em",
                    color: `${malaPallet.fontPrimaryColor.css()}`
                },
                defaultText: {
                    margin: 0,
                    fontFamily: "Whitney",
                    fontStyle: "normal",
                    fontWeight: 350,
                    // fontSize: "14px",
                    fontSize: "12px",
                    lineHeight: "19px",
                    display: "flex",
                    alignItems: "center",
                    letterSpacing: "0.03em",
                    color: `${malaPallet.fontPrimaryColor.css()}`
                },
                boldSmallHeaderDeactivated: {
                    margin: 0,
                    fontFamily: "Whitney",
                    fontStyle: "normal",
                    fontWeight: "bold",
                    fontSize: "16px",
                    lineHeight: "19px",
                    display: "flex",
                    alignItems: "center",
                    letterSpacing: "0.03em",
                    color: `${malaPallet.fontDeactivatedColor.css()}`
                },
                secondaryDescription: {
                    margin: 0,
                    fontFamily: "Whitney",
                    fontStyle: "normal",
                    fontWeight: 350,
                    fontSize: "14px",
                    lineHeight: "17px",
                    display: "flex",
                    alignItems: "center",
                    letterSpacing: "0.03em",
                    color: `${malaPallet.fontSecondaryColor.css()}`
                },
                displayText: {
                    margin: 0,
                    fontFamily: "Whitney",
                    fontStyle: "normal",
                    fontWeight: 350,
                    fontSize: "14px",
                    // lineHeight: "19px",
                    display: "flex",
                    alignItems: "center",
                    color: `${malaPallet.fontPrimaryColor.css()}`
                },
                displayDescription: {
                    margin: 0,
                    fontFamily: "Whitney",
                    fontStyle: "normal",
                    fontWeight: 350,
                    fontSize: "14px",
                    lineHeight: "17px",
                    display: "flex",
                    alignItems: "center",
                    // letterSpacing: "0.03em",
                    color: `${malaPallet.fontSecondaryColor.css()}`
                },
            }
        }
    });
}
