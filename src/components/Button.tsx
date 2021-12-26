import React, {CSSProperties} from "react";
import {getMeaningfulColors, MeaningfulColors, Themeable} from "../Themeable";
import {utilizeGlobalTheme} from "../logic/App";
import styled from "styled-components";
import {ObjectVisualMeaning} from "../logic/ObjectVisualMeaning";
import {getOr} from "../logic/Utils";
import {Color} from "../Color";

export type ButtonProps = {
    style?: CSSProperties,
    visualMeaning?: ObjectVisualMeaning,
    opaque?: boolean,
    opaqueValue?: number,
    onClick?: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void,
    shrinkOnClick?: boolean
}

export class Button extends React.Component<ButtonProps, any> {

    constructor(props: ButtonProps) {
        super(props);
    }

    render() {
        const theme: Themeable.Theme = utilizeGlobalTheme();
        const meaningfulColors: MeaningfulColors = getMeaningfulColors(getOr(this.props.visualMeaning, ObjectVisualMeaning.UI_NO_HIGHLIGHT), theme);
        const bgColor: Color = this.props.opaque ? meaningfulColors.main.withAlpha(getOr(this.props.opaqueValue, .1)): meaningfulColors.main;

        const Button = styled.button`
          border-radius: ${theme.radii.defaultObjectRadius.css()};
          background-color: ${bgColor.css()};
          border: 1px solid ${meaningfulColors.lighter.css()};
          padding: ${theme.paddings.defaultButtonPadding.css()};
          color: ${theme.colors.fontPrimaryColor.css()};
          font-family: ${theme.texts.fontFamily};
          
          display: flex;
          align-content: center;
          justify-content: center;
          cursor: pointer;
          transition: all ${theme.transitions.mainTime.css()};
          
          &:hover {
            filter: brightness(1.2);
          }

          &:active {
            transform: ${this.props.shrinkOnClick ? "scale(.99)" : "scale(1)"};
          }
        `;

        return (
            <Button onClick={event => getOr(this.props.onClick, () => {})(event)} style={getOr(this.props.style, {} as CSSProperties)}>
                {this.props.children}
            </Button>
        );
    }
}
