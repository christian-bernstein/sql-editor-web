import {BC} from "../../../libs/sql/logic/BernieComponent";
import {Assembly} from "../../../libs/sql/logic/assembly/Assembly";
import {Themeable} from "../../../libs/sql/logic/style/Themeable";
import styled from "styled-components";
import {Typography} from "./Typography";
import React, {CSSProperties} from "react";

export type ButtonProps = {
    text: string,
    onClick?: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void,
    style?: CSSProperties
}

export class Button extends BC<ButtonProps, any, any> {

    componentRender(p: ButtonProps, s: any, l: any, t: Themeable.Theme, a: Assembly): JSX.Element | undefined {
        const Button = styled.button`
          padding: 7px 31px;
          border: solid 2px black;
          background-color: transparent;
          transition: all 150ms ease-in-out;
          position: relative;
          cursor: pointer;
          z-index: 0;
          
          * {
            cursor: pointer;
            color: white !important;
          }
          
          &:before {
            z-index: -1;
            content: '';
            transition: height 80ms ease-in-out;
            position: absolute;
            width: 100%;
            height: 100%;
            bottom: 0;
            left: 0;
            background-color: black;
          }
          
          &:hover {
            * {
              color: black !important;
            }
            
            &:before {
              height: 0;
            }
          }
          
          @keyframes hover {
            0% {
              * {
                color: white !important;
              }
            }
          }
        `;

        return (
            <Button style={p.style} onClick={event => p.onClick?.(event)} children={
                <Typography text={p.text} style={{
                    textTransform: "uppercase",
                    lineHeight: "17px"
                }}/>
            }/>
        );
    }
}
