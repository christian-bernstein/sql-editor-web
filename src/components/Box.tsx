import React from "react";
import styled from "styled-components";
import {getMeaningfulColors, MeaningfulColors, Themeable} from "../Themeable";
import {utilizeGlobalTheme} from "../logic/App";
import {DimensionalMeasured} from "../logic/DimensionalMeasured";
import {OverflowBehaviour} from "../logic/OverflowBehaviour";
import {getOr} from "../logic/Utils";
import {ObjectVisualMeaning} from "../logic/ObjectVisualMeaning";
import {Color} from "../Color";

export type BoxProps = {
    highlight?: boolean
    classNames?: string[],
    width?: DimensionalMeasured,
    height?: DimensionalMeasured,
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
    color?: Color
}

export class Box extends React.Component<BoxProps, any> {

    constructor(props: BoxProps) {
        super(props);
    }

    render() {
        const theme: Themeable.Theme = utilizeGlobalTheme();
        const meaningfulColors: MeaningfulColors = getMeaningfulColors(getOr(this.props.visualMeaning, ObjectVisualMeaning.UI_NO_HIGHLIGHT), theme);
        const col: Color = this.props.color ? this.props.color : meaningfulColors.main;
        const bgColor: Color = this.props.opaque ? col.withAlpha(getOr(this.props.opaqueValue, .1)) : col;

        const Box = styled.div`
          box-sizing: border-box;
          // todo check if this causes issues along the board
          
          background-color: ${bgColor.css()};
          border-radius: ${theme.radii.defaultObjectRadius.css()};
          border: 1px solid ${meaningfulColors.lighter.css()};
          padding: ${this.props.noPadding ? "0" : (getOr(this.props.paddingY, theme.paddings.defaultObjectPadding).css() + " " + getOr(this.props.paddingX, theme.paddings.defaultObjectPadding).css())};
          width: ${getOr(this.props.width?.css(), "auto")};
          // min-width: ${getOr(this.props.width?.css(), "auto")};
          height: ${getOr(this.props.height?.css(), "auto")};
          overflow-x: ${getOr<OverflowBehaviour>(this.props.overflowXBehaviour, OverflowBehaviour.VISIBLE)};
          overflow-y: ${getOr<OverflowBehaviour>(this.props.overflowYBehaviour, OverflowBehaviour.VISIBLE)};
          display: flex;
          flex-direction: column;
          gap: ${getOr(this.props.gapY?.css(), "0")} ${getOr(this.props.gapX?.css(), "0")};
          // min-height: 100% !important;
          
          &.highlight:hover {
            filter: brightness(${theme.hovers.hoverLightFilter.css()});
            border: 1px solid ${theme.colors.primaryHighlightColor.css()} !important;
            box-shadow: 0 0 0 4px ${theme.colors.borderPrimaryShadowColor.css()};
          }
        `;
        const classNames: string[] = this.props.classNames === undefined ? [] : this.props.classNames;
        const highlight: boolean = this.props.highlight === undefined ? false : this.props.highlight;
        return (
            <Box onClick={event => getOr(this.props.onClick, () => {})(event)} className={[...classNames, "box", highlight ? "highlight" : ""].join(" ").trim()}>
                {this.props.children}
            </Box>
        );
    }
}
