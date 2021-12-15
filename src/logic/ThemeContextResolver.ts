import {Themeable} from "../Themeable";

export type ThemeContextResolver<T> = {
    resolve: (theme: Themeable.Theme) => T
}
