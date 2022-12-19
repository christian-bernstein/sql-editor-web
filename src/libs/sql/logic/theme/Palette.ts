import {PaletteEntry} from "./PaletteEntry";

export type Palette = {
    system: {
        red: PaletteEntry,
        orange: PaletteEntry,
        yellow: PaletteEntry,
        green: PaletteEntry,
        mint: PaletteEntry,
        teal: PaletteEntry,
        cyan: PaletteEntry,
        blue: PaletteEntry,
        indigo: PaletteEntry,
        purple: PaletteEntry,
        pink: PaletteEntry,
        brown: PaletteEntry,
        black: PaletteEntry,
        white: PaletteEntry
    },
    brand: {
        main: PaletteEntry
    },
    gray: {
        gray1: PaletteEntry,
        gray2: PaletteEntry,
        gray3: PaletteEntry,
        gray4: PaletteEntry,
        gray5: PaletteEntry,
        gray6: PaletteEntry,
    }
}
