import React, {CSSProperties} from "react";
import {WithVisualMeaning} from "../logic/WithVisualMeaning";
import styled from "styled-components";
import {getMeaningfulColors, MeaningfulColors, Themeable} from "../Themeable";
import {utilizeGlobalTheme} from "../logic/App";
import {ObjectVisualMeaning} from "../logic/ObjectVisualMeaning";
import {DimensionalMeasured, px} from "../logic/DimensionalMeasured";
import {getOr} from "../logic/Utils";
import {Color} from "../Color";

export type IconProps = {
    colored?: boolean,
    icon: JSX.Element,
    size?: DimensionalMeasured,
    hoverAnimation?: boolean,
    onClick?: () => void,
    style?: CSSProperties
    // color?: Color
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
      position: relative;
      
      // todo implement icon highlight circle box
      // &:after {
      //   content: '';
      //   position: absolute;
      //   left: 0;
      //   top: 0;
      //   width: 20px;
      //   border: 1px solid crimson;
      //   height: 20px;
      //   border-radius: 50%;
      //   transform: translateX(0) translateY(0);
      // }
      
      svg {
        width: ${(props.size || px(20)).css()};
        height: ${(props.size || px(20)).css()};
        fill: ${(props.colored ? meaningfulColors.iconColored : meaningfulColors.icon).css()};
        
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
        <Wrapper style={getOr(props.style, {})} onClick={() => props.onClick?.()}>
            {props.icon}
        </Wrapper>
    );
});
