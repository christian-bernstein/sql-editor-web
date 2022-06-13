import {Color} from "./Color";
import {DimensionalMeasured, px} from "./DimensionalMeasured";
import {Dimension} from "./Dimension";
import {CSSProperties} from "react";
import {ObjectVisualMeaning} from "./ObjectVisualMeaning";
import {time, TimeMeasured} from "../misc/TimeMeasured";
import {TimeUnit} from "../misc/TimeUnit";
import {ThemeKeys, ThemeObject} from "react-json-view";
import {createTheme, Theme as MUITheme} from "@mui/material";

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

    export function createColorPallet(partial: Partial<ColorPallet> ): ColorPallet {
        return {...defaultThemePallet, ...partial};
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
        betaHighlightColor: Color
    }

    export type Theme = {
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
            complete: {
                boldLargeHeader: CSSProperties,
                boldSmallHeader: CSSProperties,
                defaultText: CSSProperties,
                boldSmallHeaderDeactivated: CSSProperties,
                secondaryDescription: CSSProperties
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
        // tooltipBackgroundColor: Color.ofHex("#171717"),
        tooltipBackgroundColor: Color.ofHex("#2b2c2e"),
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
        betaHighlightColor: Color.ofHex("#a371f7")
    }

    export const lightThemePallet: ColorPallet = createColorPallet({
        backgroundColor: Color.ofHex("#ffffff"),
        backgroundHighlightColor: Color.ofHex("#eaeaea"),
        backgroundHighlightColor200: Color.ofHex("#e1e1e1"),
        backgroundHighlightInputColor: Color.ofHex("#ffffff"),
        backgroundDeactivatedColor: Color.ofHex("#e8e8e8"),
        // tooltipBackgroundColor: Color.ofHex("#323335"),
        tooltipBackgroundColor: Color.ofHex("#171717"),
        tooltipPrimaryFontColor: Color.ofHex("#DEDFE0"),
        iconColor: Color.ofHex("#000000"),
        fontPrimaryColor: Color.ofHex("#000000"),
        fontPrimaryInvertedColor: Color.ofHex("#ffffff"),
        fontSecondaryColor: Color.ofHex("#C6C6C6"),
        fontDeactivatedColor: Color.ofHex("#4F4F4F"),
        primaryColor: Color.ofHex("#71D99E"),
        primaryHighlightColor: Color.ofHex("#A9E5C3"),
        errorColor: Color.ofHex("#D93240"),
        errorHighlightColor: Color.ofHex("#e55561"),
        warnColor: Color.ofHex("#FBBE63"),
        warnHighlightColor: Color.ofHex("#ffd387"),
        borderPrimaryColor: Color.ofHex("#c4c4c4"),
        borderColorSecondaryColor: Color.ofHex("#FBBE63"),
        borderPrimaryShadowColor: Color.ofHex("#71D99E", .13),
        backdropColor: Color.ofHex("#171717", .8)
    })

    export const defaultTheme: Theme = {
        colors: defaultThemePallet,
        mode: "dark",
        muiTheme: createTheme({
            palette: {
                mode: 'dark',
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
        },
        libraries: {
            reactJson: {
                theme: "grayscale"
            }
        }
    }

    export const lightTheme: Theme = {
        colors: lightThemePallet,
        mode: "light",
        muiTheme: createTheme({
            palette: {
                mode: 'light',
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
                    fontSize: "14px",
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
                }
            }
        },
        libraries: {
            reactJson: {
                theme: "grayscale:inverted"
            }
        }
    }
}
