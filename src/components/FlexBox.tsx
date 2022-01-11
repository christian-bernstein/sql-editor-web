import React, {CSSProperties} from "react";
import {Themeable} from "../Themeable";
import {utilizeGlobalTheme} from "../logic/App";
import styled from "styled-components";
import {FlexDirection} from "../logic/FlexDirection";
import {getOr} from "../logic/Utils";
import {DimensionalMeasured} from "../logic/DimensionalMeasured";
import {Align} from "../logic/Align";
import {Justify} from "../logic/Justify";
import {OverflowBehaviour} from "../logic/OverflowBehaviour";

export type FlexBoxProps = {
    flexDir?: FlexDirection,
    gap?: DimensionalMeasured,
    style?: CSSProperties,
    align?: Align,
    justifyContent?: Justify,
    width?: DimensionalMeasured,
    overflowXBehaviour?: OverflowBehaviour
    classnames?: string[]
}

export class FlexBox extends React.Component<FlexBoxProps, any> {

    render() {
        const theme: Themeable.Theme = utilizeGlobalTheme();
        const Wrapper = styled.div`
          display: flex;
          flex-direction: ${getOr(this.props.flexDir, FlexDirection.COLUMN)};
          gap: ${getOr(this.props.gap?.css(), theme.gaps.defaultGab.css())};
          align-items: ${this.props.align || Align.START};
          justify-content: ${getOr(this.props.justifyContent, Justify.FLEX_START)};
          width: ${getOr(this.props.width?.css(), "auto")};
          overflow-x: ${getOr<OverflowBehaviour>(this.props.overflowXBehaviour, OverflowBehaviour.VISIBLE)};
          // overflow-y: visible;
        `;
        return (
            <Wrapper style={getOr(this.props.style, {})} className={getOr(this.props.classnames?.join(" "), "")}>
                {this.props.children}
            </Wrapper>
        );
    }
}
