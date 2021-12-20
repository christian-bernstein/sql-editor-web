import React from "react";
import styled, {CSSProperties} from "styled-components";
import {getMeaningfulColors, MeaningfulColors, Themeable} from "../Themeable";
import {utilizeGlobalTheme} from "../logic/App";
import {createMargin, Margin, setMarginToCSSProperties} from "../logic/Margin";
import {getOr} from "../logic/Utils";
import {DimensionalMeasured} from "../logic/DimensionalMeasured";
import {ObjectVisualMeaning} from "../logic/ObjectVisualMeaning";
import ReactMarkdown from 'react-markdown'

export type TextProps = {
    text: string,
    type?: TextType,
    margin?: Margin,
    fontSize?: DimensionalMeasured,
    visualMeaning?: ObjectVisualMeaning,
    enableLeftAppendix?: boolean,
    leftAppendix?: JSX.Element,
    coloredIcon?: boolean
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
    const theme: Themeable.Theme = utilizeGlobalTheme();
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

    const meaningfulColors: MeaningfulColors = getMeaningfulColors(getOr(props.visualMeaning, ObjectVisualMeaning.UI_NO_HIGHLIGHT), theme);
    const Wrapper = styled.p`
      display: flex;
      align-items: center;
      gap: ${theme.paddings.defaultTextIconPadding.css()};
      svg path {
        fill: ${(props.coloredIcon ? meaningfulColors.iconColored : meaningfulColors.icon).css()};
      }
      p {
        margin-top: 0;
        margin-bottom: 0;
      }
    `;

    return(
        <Wrapper style={style}>
            {props.enableLeftAppendix ? props.leftAppendix : <></>}
            <ReactMarkdown children={props.text}/>
        </Wrapper>
    )
}
