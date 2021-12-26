import React from "react";
import {WithVisualMeaning} from "../logic/WithVisualMeaning";
import styled from "styled-components";
import {getMeaningfulColors, MeaningfulColors, Themeable} from "../Themeable";
import {utilizeGlobalTheme} from "../logic/App";
import {ObjectVisualMeaning} from "../logic/ObjectVisualMeaning";
import {DimensionalMeasured, px} from "../logic/DimensionalMeasured";
import {getOr} from "../logic/Utils";

export type IconProps = {
    colored?: boolean,
    icon: JSX.Element,
    size?: DimensionalMeasured,
    hoverAnimation?: boolean,
    onClick?: () => void
} & WithVisualMeaning

export const Icon: React.FC<IconProps> = React.memo(props => {
    const vm: ObjectVisualMeaning = getOr(props.visualMeaning, ObjectVisualMeaning.UI_NO_HIGHLIGHT);
    const theme: Themeable.Theme = utilizeGlobalTheme();
    const meaningfulColors: MeaningfulColors = getMeaningfulColors(vm, theme);
    const Wrapper = styled.div`
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      
      svg {
        width: ${(props.size || px(20)).css()};
        height: ${(props.size || px(20)).css()};
        
        path {      
          fill: ${(props.colored ? meaningfulColors.iconColored : meaningfulColors.icon).css()};
        }
      }
      
      &:hover {
        border-radius: 50%;
        filter: brightness(1.1);
      }
    `;

    return (
        <Wrapper onClick={() => props.onClick?.()}>
            {props.icon}
        </Wrapper>
    );
});
