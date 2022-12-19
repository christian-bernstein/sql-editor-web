import React, {CSSProperties} from "react";
import {WithVisualMeaning} from "../../logic/style/WithVisualMeaning";
import styled from "styled-components";
import {DimensionalMeasured, px} from "../../logic/style/DimensionalMeasured";
import {Orientation} from "../../logic/style/Orientation";
import {getOr} from "../../logic/Utils";
import {getMeaningfulColors, MeaningfulColors, Themeable} from "../../logic/style/Themeable";
import {Color} from "../../logic/style/Color";
import {utilizeGlobalTheme} from "../../logic/app/App";

export type SeparatorProps = {
    width?: DimensionalMeasured,
    orientation?: Orientation,
    borderRadius?: DimensionalMeasured,
    visible?: boolean,
    style?: CSSProperties
    // height?: DimensionalMeasured
} & WithVisualMeaning

export const Separator: React.FC<SeparatorProps> = React.memo(props => {
    const theme: Themeable.Theme = utilizeGlobalTheme();
    const col: Color = props.visualMeaning ? getMeaningfulColors(props.visualMeaning, theme).lighter : theme.colors.borderPrimaryColor;
    const Span = styled.span`
      border-radius: ${getOr(props.borderRadius, px()).css()};
      width: ${getOr(props.orientation, Orientation.HORIZONTAL) === Orientation.HORIZONTAL ? "100%" : getOr(props.width?.css(), "1px")};
      height: ${getOr(props.orientation, Orientation.HORIZONTAL) === Orientation.HORIZONTAL ? getOr(props.width?.css(), "1px") : "100%"};
      
      background: ${col.css()};
      visibility: ${getOr(props.visible, true) ? "visible" : "hidden"};
    `;
    return (
        <Span style={getOr(props.style, {})}/>
    );
})
