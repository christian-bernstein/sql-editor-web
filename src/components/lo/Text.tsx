import React from "react";
import styled, {CSSProperties} from "styled-components";
import {getMeaningfulColors, MeaningfulColors, Themeable} from "../../logic/style/Themeable";
import {utilizeGlobalTheme} from "../../logic/app/App";
import {createMargin, Margin, setMarginToCSSProperties} from "../../logic/style/Margin";
import {getOr} from "../../logic/Utils";
import {DimensionalMeasured} from "../../logic/style/DimensionalMeasured";
import {ObjectVisualMeaning} from "../../logic/style/ObjectVisualMeaning";
import ReactMarkdown from 'react-markdown'
import {Link} from "./Link";
import {Align} from "../../logic/style/Align";
import {Cursor} from "../../logic/style/Cursor";
import {Image} from "./Image";
import rehypeRaw from "rehype-raw";
import {Color} from "../../logic/style/Color";

// todo implement
export type FontOptions = {
    display?: boolean,
    fontFamily?: string[]
}

export type TextProps = {
    text: string,
    texts?: string[],
    delimiter?: string,
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
    onMouseOver?: (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => void,
    onMouseLeave?: (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => void,
    cursor?: Cursor,
    whitespace?: "normal" | "pre-wrap" | "nowrap",
    renderMarkdown?: boolean,
    bold?: boolean,
    advancedLinkRendering?: boolean,
    color?: Color
}

export enum TextType {
    smallHeader = "small-header",
    largeHeader = "large-header",
    defaultText = "default-text",
    secondaryDescription = "secondary-description",
    smallHeaderDeactivated = "small-header-deactivated",
    displayText = "display-text",
    displayDescription = "display-description",
}

const textTypeToThemeMapping: Map<TextType, (theme: Themeable.Theme) => CSSProperties> = new Map<TextType, (theme: Themeable.Theme) => CSSProperties>([
    [TextType.smallHeader, theme => theme.texts.complete.boldSmallHeader],
    [TextType.largeHeader, theme => theme.texts.complete.boldLargeHeader],
    [TextType.defaultText, theme => theme.texts.complete.defaultText],
    [TextType.secondaryDescription, theme => theme.texts.complete.secondaryDescription],
    [TextType.smallHeaderDeactivated, theme => theme.texts.complete.boldSmallHeaderDeactivated],
    [TextType.displayText, theme => theme.texts.complete.displayText],
    [TextType.displayDescription, theme => theme.texts.complete.displayDescription]
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
    let text = getOr(props.bold, false) ? `**${props.text}**` : props.text;
    const meaningfulColors: MeaningfulColors = getMeaningfulColors(getOr(props.visualMeaning, ObjectVisualMeaning.UI_NO_HIGHLIGHT), theme);

    const Wrapper = styled.div`
      display: flex;
      align-items: center;
      gap: ${theme.paddings.defaultTextIconPadding.css()};
      cursor: ${getOr(props.cursor, Cursor.default)};
      color: ${props.coloredText ? (props.color === undefined ? meaningfulColors.lighter.css() : props.color.css()) + "!important" : ""};
      transition: all ${theme.transitions.fastTime.css()};
      text-overflow: ellipsis;
      
      &:hover {
        color: ${props.highlight ? meaningfulColors.main.css() : "auto"} !important;
      }
      
      svg path {
        fill: ${(props.coloredIcon ? meaningfulColors.iconColored : meaningfulColors.icon).css()};
      }
      
      p, h4, h5, h6, ul, li {
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

    if (props.texts !== undefined) {
        const delimiter = getOr(props.delimiter, "\n");
        text = `${text.length === 0 ? "" : `${text}${delimiter}`}${props.texts.join(delimiter)}`
    }

    return (
        <Wrapper style={style} onMouseLeave={event => props.onMouseLeave?.(event)} onMouseOver={event => props.onMouseOver?.(event)} onClick={event => getOr(props.onClick, () => {})(event)}>
            {props.enableLeftAppendix ? props.leftAppendix : <></>}

            {renderMD ? (
                <ReactMarkdown rehypePlugins={[rehypeRaw]} className={"md"} children={text} components={{
                    a: (mdProps, context) => {
                        if (getOr(props.advancedLinkRendering, false)) {
                            return (
                                <Link linkTooltip showLinkIcon={false} visualMeaning={props.visualMeaning} href={getOr<string>(mdProps.href, "")} children={mdProps.children}/>
                            );
                        } else {
                            const A = styled.a`
                              color: ${theme.colors.primaryColor.css()};
                              text-decoration: underline;
                              transition: .14s;
                              
                              &:hover {
                                color: ${theme.colors.primaryHighlightColor.css()};
                              }
                            `;

                            return (
                                <A href={getOr<string>(mdProps.href, "")} {...mdProps}/>
                            );
                        }
                    },
                    img: (props1, context) => {
                        return (
                            <Image src={getOr(props1.src, "")}/>
                        );
                    },
                    u: ({node, ...props}) => <u style={{textDecoration: 'underline'}} {...props} />
                }}/>
            ) : (
                <p>{text}</p>
            )}
            {props.enableRightAppendix ? props.rightAppendix : <></>}
        </Wrapper>
    )
}
