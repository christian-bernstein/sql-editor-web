import React, {CSSProperties} from "react";
import styled from "styled-components";
import {getOr} from "../../logic/Utils";
import {DimensionalMeasured, px} from "../../logic/style/DimensionalMeasured";

export type GridProps = {
    rows?: number
    columns?: number
    style?: CSSProperties,
    gap?: DimensionalMeasured,
    height?: DimensionalMeasured,
    responsive?: boolean,
    minResponsiveWidth?: DimensionalMeasured,
}

export class LiteGrid extends React.Component<GridProps, any> {

    constructor(props: GridProps) {
        super(props);
    }

    render() {
        const Wrapper = styled.div`
          display: grid;
          width: 100%;
          height: ${getOr(this.props.height?.css(), "auto")};
          grid-template-columns: repeat(${this.props.responsive ? "auto-fit" : getOr(this.props.columns, 1)}, ${this.props.responsive ? "minmax(" + getOr(this.props.minResponsiveWidth?.css(), "1fr") + ", 1fr)" : "1fr"});
          grid-template-rows: repeat(${getOr(this.props.rows, 1)}, 1fr);
          grid-gap: ${getOr(this.props.gap, px()).css()};

          ::-webkit-scrollbar {
            display: none;
          }
        `;
        return (
            <Wrapper style={getOr(this.props.style, {})}>
                {this.props.children}
            </Wrapper>
        );
    }
}
