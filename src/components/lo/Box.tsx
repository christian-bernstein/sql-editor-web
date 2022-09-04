import React, {CSSProperties} from "react";
import styled from "styled-components";
import {getMeaningfulColors, MeaningfulColors, Themeable} from "../../logic/style/Themeable";
import {utilizeGlobalTheme} from "../../logic/app/App";
import {DimensionalMeasured} from "../../logic/style/DimensionalMeasured";
import {OverflowBehaviour} from "../../logic/style/OverflowBehaviour";
import {getOr} from "../../logic/Utils";
import {ObjectVisualMeaning} from "../../logic/style/ObjectVisualMeaning";
import {Color} from "../../logic/style/Color";
import {Cursor} from "../../logic/style/Cursor";

export type BoxProps = {
    highlight?: boolean
    classNames?: string[],
    width?: DimensionalMeasured,
    height?: DimensionalMeasured,
    maxHeight?: DimensionalMeasured,
    maxWidth?: DimensionalMeasured,
    minWidth?: DimensionalMeasured,
    minHeight?: DimensionalMeasured,
    overflowXBehaviour?: OverflowBehaviour,
    overflowYBehaviour?: OverflowBehaviour,
    visualMeaning?: ObjectVisualMeaning,
    opaque?: boolean,
    opaqueValue?: number,
    noPadding?: boolean
    paddingX?: DimensionalMeasured,
    paddingY?: DimensionalMeasured,
    onClick?: (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => void
    gapX?: DimensionalMeasured,
    gapY?: DimensionalMeasured,
    color?: Color,
    hideScrollbar?: boolean,
    borderless?: boolean,
    style?: CSSProperties,
    cursor?: Cursor,
    bgColor?: Color,
    noBGColor?: boolean,
    arrow?: BoxArrowConfig,
    borderRadiiConfig?: {
        enableCustomBorderRadii?: boolean,
        fallbackCustomBorderRadii?: DimensionalMeasured,
        topLeft?: DimensionalMeasured,
        topRight?: DimensionalMeasured,
        bottomLeft?: DimensionalMeasured,
        bottomRight?: DimensionalMeasured
    },
    elements?: Array<JSX.Element>,
    fw?: boolean,
    fh?: boolean,
    highlightShadow?: boolean
}

export type BoxArrowConfig = {
    enable?: boolean,
    bgColor?: Color
}

export class Box extends React.Component<BoxProps, any> {

    constructor(props: BoxProps) {
        super(props);
    }

    render() {
        const theme: Themeable.Theme = utilizeGlobalTheme();
        const meaningfulColors: MeaningfulColors = getMeaningfulColors(getOr(this.props.visualMeaning, ObjectVisualMeaning.UI_NO_HIGHLIGHT), theme);
        const col: Color = this.props.color ? this.props.color : meaningfulColors.main;
        const bgColor: Color = getOr(this.props.bgColor, this.props.opaque ? col.withAlpha(getOr(this.props.opaqueValue, theme.alpha.opaqueUI)) : col);

        const arrayBgColor: Color = getOr(this.props.arrow?.bgColor, Color.ofHex("#000000", 0));

        const Box = styled.div`
          cursor: ${getOr(this.props.cursor, Cursor.default)};
          box-sizing: border-box;
          position: relative;
          // todo check if this causes issues along the board

          // position: relative;
          background-color: ${getOr(this.props.noBGColor, false) ? "none" : bgColor.css()};
          // border-radius: ${theme.radii.defaultObjectRadius.css()};
          
          border-radius: ${(() => {
              const config = this.props.borderRadiiConfig;
              if (config !== undefined && config.enableCustomBorderRadii) {
                const radii = getOr(config.fallbackCustomBorderRadii, theme.radii.defaultObjectRadius);
                const topLeft: DimensionalMeasured = getOr(config.topLeft, radii);
                const topRight: DimensionalMeasured = getOr(config.topRight, radii);
                const bottomLeft: DimensionalMeasured = getOr(config.bottomLeft, radii);
                const bottomRight: DimensionalMeasured = getOr(config.bottomRight, radii);
                return `${topLeft.css()} ${topRight.css()} ${bottomLeft.css()} ${bottomRight.css()}`;
              } else {
                  return theme.radii.defaultObjectRadius.css();
              }
          })()};
          
          
          border: ${this.props.borderless ? "none" : `1px solid ${meaningfulColors.lighter.css()}`};
          padding: ${this.props.noPadding ? "0" : (getOr(this.props.paddingY, theme.paddings.defaultObjectPadding).css() + " " + getOr(this.props.paddingX, theme.paddings.defaultObjectPadding).css())};
          width: ${this.props.fw ? "100%" : getOr(this.props.width?.css(), "auto")};
            // min-width: ${getOr(this.props.width?.css(), "auto")};
          height: ${this.props.fh ? "100%" : getOr(this.props.height?.css(), "auto")};
          max-height: ${getOr(this.props.maxHeight?.css(), "auto")};
          max-width: ${getOr(this.props.maxWidth?.css(), "auto")};
          min-width: ${getOr(this.props.minWidth?.css(), "auto")};
          min-height: ${getOr(this.props.minHeight?.css(), "auto")};
          overflow-x: ${getOr<OverflowBehaviour>(this.props.overflowXBehaviour, OverflowBehaviour.VISIBLE)};
          overflow-y: ${getOr<OverflowBehaviour>(this.props.overflowYBehaviour, OverflowBehaviour.VISIBLE)};
          display: flex;
          flex-direction: column;
          gap: ${getOr(this.props.gapY?.css(), "0")} ${getOr(this.props.gapX?.css(), "0")};
          // min-height: 100% !important;

          transition: all ${theme.transitions.fastTime.css()};
          box-shadow: 0 0 0 0 ${meaningfulColors.shadowColor.css()};

          &::-webkit-scrollbar {
            display: ${getOr(this.props.hideScrollbar, true) ? "none" : "block"};
          }

          &.highlight:hover {
            filter: brightness(${theme.hovers.hoverLightFilter.css()});
              // border: 1px solid ${theme.colors.primaryHighlightColor.css()} !important;
            border: ${this.props.borderless ? "0" : "1px"} solid ${meaningfulColors.lighter.css()} !important;
              // box-shadow: 0 0 0 4px ${theme.colors.borderPrimaryShadowColor.css()};
            
            
            box-shadow: 0 0 0 ${getOr(this.props.highlightShadow, true) ? "4px" : "0"} ${meaningfulColors.shadowColor.css()};
          }
          
          // Arrow border
          &::before {
            display: ${this.props.arrow && !this.props.borderless && getOr(this.props.arrow.enable, true) ? "block" : "none"};
            content: ' ';
            position: absolute;
            pointer-events: none;
            top: 11px;
            left: -8px;
            width: 8px;
            height: 16px;
            // clip-path: polygon(0 50%, 100% 0, 100% 100%);
            clip-path: polygon(0 50%, 100% 0, 100% 1.5px, 1.5px 50%, 100% calc(100% - 1.5px), 100% 100%);
            background-color: ${meaningfulColors.lighter.css()};
          }
          
          // Arrow background
          &::after {
            display: ${this.props.arrow && getOr(this.props.arrow.enable, true) ? "block" : "none"};
            content: ' ';
            position: absolute;
            pointer-events: none;
            top: 12px;
            left: -6.75px;
            width: 7px;
            height: 14px;
            clip-path: polygon(0 50%, 100% 0, 100% 100%);
            // background-color: ${getOr(this.props.noBGColor, false) ? "none" : bgColor.css()};
            background-color: ${arrayBgColor.css()};
            // background-color: red;
          }
        `;

        const classNames: string[] = this.props.classNames === undefined ? [] : this.props.classNames;
        const highlight: boolean = this.props.highlight === undefined ? false : this.props.highlight;
        return (
            <Box style={getOr(this.props.style, {})} onClick={event => getOr(this.props.onClick, () => {})(event)} className={[...classNames, "box", highlight ? "highlight" : ""].join(" ").trim()}>
                {this.props.elements}
                {this.props.children}
            </Box>
        );
    }
}
