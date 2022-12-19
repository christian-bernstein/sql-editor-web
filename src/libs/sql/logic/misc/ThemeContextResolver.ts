import {Themeable} from "../style/Themeable";

export type ThemeContextResolver<T> = {
    resolve: (theme: Themeable.Theme) => T
}
