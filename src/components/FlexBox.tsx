import React, {CSSProperties} from "react";
import {Themeable} from "../Themeable";
import {utilizeGlobalTheme} from "../logic/App";
import styled from "styled-components";
import {FlexDirection} from "../logic/FlexDirection";
import {getOr} from "../logic/Utils";
import {DimensionalMeasured} from "../logic/DimensionalMeasured";
import {Align} from "../logic/Align";

export type FlexBoxProps = {
    flexDir?: FlexDirection,
    gap?: DimensionalMeasured,
    style?: CSSProperties,
    align?: Align,
}

export class FlexBox extends React.Component<FlexBoxProps, any> {

    render() {
        const theme: Themeable.Theme = utilizeGlobalTheme();
        const Wrapper = styled.div`
          display: flex;
          flex-direction: ${getOr(this.props.flexDir, FlexDirection.COLUMN)};
          gap: ${getOr(this.props.gap?.css(), theme.gaps.defaultGab.css())};
          align-items: ${this.props.align || Align.START};
        `;
        return (
            <Wrapper style={getOr(this.props.style, {})}>
                {this.props.children}
            </Wrapper>
        );
    }
}
