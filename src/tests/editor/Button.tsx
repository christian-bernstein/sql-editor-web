import React from "react";
import {Themeable} from "../../Themeable";
import {app} from "../../logic/App";
import styled from "styled-components";

export type ButtonProps = {
    highlight?: boolean,
    gridPos?: string,
    onClick?: React.MouseEventHandler<HTMLButtonElement>
}

export class Button extends React.Component<ButtonProps, any> {

    constructor(props: ButtonProps) {
        super(props);
    }

    render() {
        const theme: Themeable.Theme = app().getGlobalTheme();
        const Button = styled.button`
          display: flex;
          justify-content: center;
          align-items: center;
          min-width: 20px;
          width: 100%;
          height: 40px;
          border-radius: 6px;
          grid-area: ${this.props.gridPos};
          border: 1px solid ${
            this.props.highlight ? 
                    theme.colors.primaryHighlightColor.css() : 
                    theme.colors.borderPrimaryColor.css()
          };
          user-select: none;
          color: ${theme.colors.fontPrimaryColor.css()};
          font-weight: bold;
          background-color: ${
                  this.props.highlight ?
                          theme.colors.primaryColor.css() :
                          theme.colors.backgroundHighlightColor.css()
          };
          cursor: pointer;
          justify-self: center;
          
          &:hover {
            box-shadow: 0 0 0 3px ${theme.colors.borderPrimaryShadowColor.css()};
            filter: brightness(1.2);
          }
          
          svg path {
            fill: white !important;
          }
        `;
        return (
            <Button onClick={event => this.props.onClick?.(event)}>
                {this.props.children}
            </Button>
        );
    }
}
