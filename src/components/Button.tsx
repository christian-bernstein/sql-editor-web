import React, {CSSProperties} from "react";
import {getMeaningfulColors, MeaningfulColors, Themeable} from "../Themeable";
import {utilizeGlobalTheme} from "../logic/App";
import styled from "styled-components";
import {ObjectVisualMeaning} from "../logic/ObjectVisualMeaning";
import {getOr} from "../logic/Utils";
import {Color} from "../Color";
import {DimensionalMeasured} from "../logic/DimensionalMeasured";
import {Cursor} from "../logic/style/Cursor";

export type ButtonProps = {
    style?: CSSProperties,
    visualMeaning?: ObjectVisualMeaning,
    opaque?: boolean,
    opaqueValue?: number,
    onClick?: (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => void,
    shrinkOnClick?: boolean,
    width?: DimensionalMeasured,
    height?: DimensionalMeasured,
    cursor?: Cursor,
    enableBaseAnimation?: boolean,
    baseAnimation?: "hover-repeat"
}

export class Button extends React.Component<ButtonProps, any> {

    constructor(props: ButtonProps) {
        super(props);
    }

    render() {
        const theme: Themeable.Theme = utilizeGlobalTheme();
        const meaningfulColors: MeaningfulColors = getMeaningfulColors(getOr(this.props.visualMeaning, ObjectVisualMeaning.UI_NO_HIGHLIGHT), theme);
        const bgColor: Color = this.props.opaque ? meaningfulColors.main.withAlpha(getOr(this.props.opaqueValue, .1)): meaningfulColors.main;

        const Button = styled.div`
          border-radius: ${theme.radii.defaultObjectRadius.css()};
          background-color: ${bgColor.css()};
          border: 1px solid ${meaningfulColors.lighter.css()};
          padding: ${theme.paddings.defaultButtonPadding.css()};
          color: ${theme.colors.fontPrimaryColor.css()};
          font-family: ${theme.texts.fontFamily};
          width: ${getOr(this.props.width?.css(), "auto")};
          height: ${getOr(this.props.height?.css(), "auto")};
          display: flex;
          align-content: center;
          justify-content: center;
          cursor: ${getOr(this.props.cursor, Cursor.pointer)};
          transition: all ${theme.transitions.mainTime.css()};
          ${getOr(this.props.enableBaseAnimation, false) ? (
              `animation: 1.5s infinite ${this.props.baseAnimation};`
          ) : ("")}
          
          & * {
            cursor: ${getOr(this.props.cursor, Cursor.pointer)};
          }
          
          &:hover {
            filter: brightness(1.2);
            box-shadow: 0 0 0 4px ${meaningfulColors.lighter.withAlpha(.13).css()};
          }

          &:active {
            transform: ${this.props.shrinkOnClick ? "scale(.99)" : "scale(1)"};
          }
          
          
          @keyframes hover-repeat {
            0%, 100% {
              box-shadow: 0 0 0 0 ${meaningfulColors.lighter.withAlpha(.13).css()};
            }

            50% {
              box-shadow: 0 0 0 4px ${meaningfulColors.lighter.withAlpha(.13).css()};
            }
          }
        `;

        return (
            <Button onClick={event => getOr(this.props.onClick, () => {})(event)} style={getOr(this.props.style, {} as CSSProperties)}>
                {this.props.children}
            </Button>
        );
    }
}
