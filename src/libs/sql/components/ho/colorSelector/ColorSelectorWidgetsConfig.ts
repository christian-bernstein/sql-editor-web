import {ColorSelectorWidgetID} from "./ColorSelectorWidgetID";

export type ColorSelectorWidgetsConfig = {
    [ColorSelectorWidgetID.PALETTES]?: {
        enable?: boolean
    },
    [ColorSelectorWidgetID.HEX]?: {
        enable?: boolean
    },
    [ColorSelectorWidgetID.RGB]?: {
        enable?: boolean
    }
}
