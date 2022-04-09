import React from "react";
import styled, {CSSProperties} from "styled-components";
import {getMeaningfulColors, MeaningfulColors, Themeable} from "../Themeable";
import {utilizeGlobalTheme} from "../logic/App";
import {createMargin, Margin, setMarginToCSSProperties} from "../logic/Margin";
import {getOr} from "../logic/Utils";
import {DimensionalMeasured} from "../logic/style/DimensionalMeasured";
import {ObjectVisualMeaning} from "../logic/ObjectVisualMeaning";
import ReactMarkdown from 'react-markdown'
import {Link} from "./Link";
import {Align} from "../logic/Align";
import {Cursor} from "../logic/style/Cursor";
import {LinkPreview} from "@dhaiwat10/react-link-preview";
import {CustomTooltip} from "./CustomTooltip";

export type TextProps = {
    text: string,
    type?: TextType,
    margin?: Margin,
    fontSize?: DimensionalMeasured,
    visualMeaning?: ObjectVisualMeaning,
    enableLeftAppendix?: boolean,
    leftAppendix?: JSX.Element,
    enableRightAppendix?: boolean,
    rightAppendix?: JSX.Element,
    coloredIcon?: boolean,
    coloredText?: boolean,
    linkTooltip?: boolean,
    highlight?: boolean,
    align?: Align,
    uppercase?: boolean,
    onClick?: (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => void,
    cursor?: Cursor,
    whitespace?: "normal" | "pre-wrap" | "nowrap",
    renderMarkdown?: boolean,
    bold?: boolean
}

export enum TextType {
    smallHeader = "small-header",
    largeHeader = "large-header",
    defaultText = "default-text",
    secondaryDescription = "secondary-description",
    smallHeaderDeactivated = "small-header-deactivated",
}

const textTypeToThemeMapping: Map<TextType, (theme: Themeable.Theme) => CSSProperties> = new Map<TextType, (theme: Themeable.Theme) => CSSProperties>([
    [TextType.smallHeader, theme => theme.texts.complete.boldSmallHeader],
    [TextType.largeHeader, theme => theme.texts.complete.boldLargeHeader],
    [TextType.defaultText, theme => theme.texts.complete.defaultText],
    [TextType.secondaryDescription, theme => theme.texts.complete.secondaryDescription],
    [TextType.smallHeaderDeactivated, theme => theme.texts.complete.boldSmallHeaderDeactivated],
]);

export const Text: React.FC<TextProps> = props => {
    const theme: Themeable.Theme = utilizeGlobalTheme();
    const type: TextType = props.type === undefined ? TextType.defaultText : props.type;
    const margin: Margin = getOr(props.margin, createMargin(0, 0, 0, 0));
    const renderMD = getOr(props.renderMarkdown, true);
    let style: CSSProperties = textTypeToThemeMapping.get(type)?.(theme) as CSSProperties;
    style = setMarginToCSSProperties(margin, style);
    if (props.fontSize !== undefined) {
        style = {
            ...style,
            fontSize: props.fontSize.css()
        };
    }
    const text = getOr(props.bold, false) ? `**${props.text}**` : props.text;
    const meaningfulColors: MeaningfulColors = getMeaningfulColors(getOr(props.visualMeaning, ObjectVisualMeaning.UI_NO_HIGHLIGHT), theme);
    const Wrapper = styled.div`
      display: flex;
      align-items: center;
      gap: ${theme.paddings.defaultTextIconPadding.css()};
      cursor: ${getOr(props.cursor, Cursor.default)};
      // color: ${props.coloredText ? meaningfulColors.lighter.css() : theme.colors.fontPrimaryColor.css()} !important;
      color: ${props.coloredText ? meaningfulColors.lighter.css() + "!important" : ""};
      transition: all ${theme.transitions.fastTime.css()};

      text-overflow: ellipsis;
      
      &:hover {
        color: ${props.highlight ? meaningfulColors.main.css() : "auto"} !important;
      }
      
      // min-width: 100%;
      
      svg path {
        fill: ${(props.coloredIcon ? meaningfulColors.iconColored : meaningfulColors.icon).css()};
      }
      
      p, h1, h2, h3, h4, h5, h6 {
        margin-top: 0;
        margin-bottom: 0;
      }
      
      .md {
        width: 100%;
        white-space: ${getOr(props.whitespace, "pre-wrap")};
        // todo was comment, why? & does it make errors?
        
        text-align: ${getOr(props.align, Align.START)};
        // todo check if working
        text-transform: ${props.uppercase ? "uppercase" : "auto"};
      }
    `;

    return (
        <Wrapper style={style} onClick={event => getOr(props.onClick, () => {})(event)}>
            {props.enableLeftAppendix ? props.leftAppendix : <></>}

            {renderMD ? (
                <ReactMarkdown className={"md"} children={text} components={{
                    a: (mdProps, context) => {
                        return (
                            <Link linkTooltip showLinkIcon={false} visualMeaning={props.visualMeaning} href={getOr<string>(mdProps.href, "")}>{mdProps.children}</Link>

                            // <CustomTooltip title={
                            //     <LinkPreview url={getOr<string>(mdProps.href, "")}/>
                            // } children={
                            //     <Link showLinkIcon={false} visualMeaning={props.visualMeaning} href={getOr<string>(mdProps.href, "")}>{mdProps.children}</Link>
                            // }/>

                            // <LinkPreview url={getOr<string>(mdProps.href, "")}/>
                        );
                    }
                }}/>
            ) : (
                <p>{text}</p>
            )}
            {props.enableRightAppendix ? props.rightAppendix : <></>}
        </Wrapper>
    )
}
