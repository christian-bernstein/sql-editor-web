import React from "react";
import {CSSProperties} from "styled-components";
import {Themeable} from "../Themeable";
import {App} from "../logic/App";
import {createMargin, Margin, setMarginToCSSProperties} from "../logic/Margin";
import {getOr, Utils} from "../logic/Utils";
import {DimensionalMeasured} from "../logic/DimensionalMeasured";

export type TextProps = {
    type?: TextType,
    margin?: Margin,
    fontSize?: DimensionalMeasured
}

export enum TextType {
    smallHeader = "small-header",
    secondaryDescription = "secondary-description",
    smallHeaderDeactivated = "small-header-deactivated"
}

const textTypeToThemeMapping: Map<TextType, (theme: Themeable.Theme) => CSSProperties> = new Map<TextType, (theme: Themeable.Theme) => CSSProperties>([
    [TextType.smallHeader, theme => theme.texts.complete.boldSmallHeader],
    [TextType.secondaryDescription, theme => theme.texts.complete.secondaryDescription],
    [TextType.smallHeaderDeactivated, theme => theme.texts.complete.boldSmallHeaderDeactivated],
]);

export const Text: React.FC<TextProps> = props => {
    const theme: Themeable.Theme = App.app().getGlobalTheme();
    const type: TextType = props.type === undefined ? TextType.secondaryDescription : props.type;
    const margin: Margin = getOr(props.margin, createMargin(0, 0, 0, 0));
    let style: CSSProperties = textTypeToThemeMapping.get(type)?.(theme) as CSSProperties;
    style = setMarginToCSSProperties(margin, style);
    if (props.fontSize !== undefined) {
        style = {
            ...style,
            fontSize: props.fontSize.css()
        };
    }

    return(
        <p style={style}>
            {props.children}
        </p>
    )
}
