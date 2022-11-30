import React, {CSSProperties} from "react";
import {WithVisualMeaning} from "../../logic/style/WithVisualMeaning";
import styled from "styled-components";
import {getMeaningfulColors, MeaningfulColors, Themeable} from "../../logic/style/Themeable";
import {utilizeGlobalTheme} from "../../logic/app/App";
import {ObjectVisualMeaning} from "../../logic/style/ObjectVisualMeaning";
import {DimensionalMeasured, px} from "../../logic/style/DimensionalMeasured";
import {getOr} from "../../logic/Utils";
import {Color} from "../../logic/style/Color";
import {Tooltip} from "../ho/tooltip/Tooltip";

export type IconProps = {
    colored?: boolean,
    icon: JSX.Element,
    size?: DimensionalMeasured,
    hoverAnimation?: boolean,
    onClick?: (event: React.MouseEvent<HTMLDivElement>) => void,
    style?: CSSProperties
    color?: Color,
    tooltip?: string | JSX.Element,
    coloredOnDefault?: boolean,
    uiNoHighlightOnDefault?: boolean
} & WithVisualMeaning

export const Icon: React.FC<IconProps> = React.memo(props => {
    const vm: ObjectVisualMeaning = getOr(props.visualMeaning, ObjectVisualMeaning.UI_NO_HIGHLIGHT);
    const theme: Themeable.Theme = utilizeGlobalTheme();
    const meaningfulColors: MeaningfulColors = getMeaningfulColors(vm, theme);
    const meaningfulColorsUINOHighlight: MeaningfulColors = getMeaningfulColors(ObjectVisualMeaning.UI_NO_HIGHLIGHT, theme);

    const color: Color = (props.color !== undefined) ? props.color : (props.colored ? meaningfulColors.iconColored : meaningfulColors.icon);
    const coloredOnDefault = props.coloredOnDefault ?? true;

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
        
        path {
          transition: fill 100ms;
          fill: ${coloredOnDefault ? color.css() : (props.uiNoHighlightOnDefault ?? false ? meaningfulColorsUINOHighlight.iconColored.css() : meaningfulColorsUINOHighlight.icon.css())};
        }
      }
      
      &:hover {
        border-radius: 50%;
        filter: brightness(1.1);

        path {
          fill: ${color.css()} !important;
        }
      }
    `;

    const iconRenderer = () => (
        <Wrapper style={getOr(props.style, {})} onClick={(event: React.MouseEvent<HTMLDivElement>) => props.onClick?.(event)}>
            {props.icon}
        </Wrapper>
    );

    if (props.tooltip !== undefined) {
        return (
            <Tooltip title={props.tooltip} children={
                iconRenderer()
            }/>
        );
    } else {
        return iconRenderer();
    }
});
