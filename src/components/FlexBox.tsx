import React, {CSSProperties} from "react";
import {Themeable} from "../Themeable";
import {utilizeGlobalTheme} from "../logic/App";
import styled from "styled-components";
import {FlexDirection} from "../logic/style/FlexDirection";
import {getOr} from "../logic/Utils";
import {DimensionalMeasured} from "../logic/style/DimensionalMeasured";
import {Align} from "../logic/Align";
import {Justify} from "../logic/style/Justify";
import {OverflowBehaviour} from "../logic/style/OverflowBehaviour";
import {createMargin, Margin} from "../logic/Margin";

export type FlexBoxProps = {
    flexDir?: FlexDirection,
    gap?: DimensionalMeasured,
    style?: CSSProperties,
    align?: Align,
    justifyContent?: Justify,
    width?: DimensionalMeasured,
    height?: DimensionalMeasured,
    overflowXBehaviour?: OverflowBehaviour,
    overflowYBehaviour?: OverflowBehaviour
    classnames?: string[],
    margin?: Margin
}

export class FlexBox extends React.Component<FlexBoxProps, any> {

    render() {
        const theme: Themeable.Theme = utilizeGlobalTheme();
        const margin: Margin = getOr(this.props.margin, createMargin(0, 0, 0, 0));
        const Wrapper = styled['div']`
          display: flex;
          flex-direction: ${getOr(this.props.flexDir, FlexDirection.COLUMN)};
          gap: ${getOr(this.props.gap?.css(), theme.gaps.defaultGab.css())};
          align-items: ${this.props.align || Align.START};
          justify-content: ${getOr(this.props.justifyContent, Justify.FLEX_START)};
          width: ${getOr(this.props.width?.css(), "auto")};
          height: ${getOr(this.props.height?.css(), "auto")};
          overflow-x: ${getOr<OverflowBehaviour>(this.props.overflowXBehaviour, OverflowBehaviour.VISIBLE)};
          overflow-y: ${getOr<OverflowBehaviour>(this.props.overflowYBehaviour, OverflowBehaviour.VISIBLE)};
          margin-top: ${margin.top?.css()};
          margin-bottom: ${margin.bottom?.css()};
          margin-left: ${margin.left?.css()};
          margin-right: ${margin.right?.css()};
        `;
        return (
            <Wrapper style={getOr(this.props.style, {})} className={getOr(this.props.classnames?.join(" "), "")}>
                {this.props.children}
            </Wrapper>
        );
    }
}
