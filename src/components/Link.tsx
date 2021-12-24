import React from "react";
import styled from "styled-components";
import {ObjectVisualMeaning} from "../logic/ObjectVisualMeaning";
import {getMeaningfulColors, MeaningfulColors, Themeable} from "../Themeable";
import {utilizeGlobalTheme} from "../logic/App";
import {getOr} from "../logic/Utils";
import {ReactComponent as LinkIcon} from "../assets/icons/ic-16/ic16-link.svg";
import ReactTooltip from "react-tooltip";
import {LinkPreview} from "@dhaiwat10/react-link-preview";

export type LinkProps = {
    href: string,
    visualMeaning?: ObjectVisualMeaning,
    showLinkIcon?: boolean,
    linkTooltip?: boolean
}

export class Link extends React.Component<LinkProps, any> {

    render() {
        const theme: Themeable.Theme = utilizeGlobalTheme();
        const meaningfulColors: MeaningfulColors = getMeaningfulColors(getOr(this.props.visualMeaning, ObjectVisualMeaning.INFO), theme)
        const Wrapper = styled.a`
          cursor: pointer;
          color: ${meaningfulColors.lighter.css()};
          transition: filter ${theme.transitions.fastTime.css()};
          // position: relative;

          &:hover, &:hover svg path {
            filter: brightness(1.1);
          }

          svg {
            margin-left: 4px;
            justify-self: center;
            align-self: center;
            position: absolute;

            path {
              fill: ${meaningfulColors.lighter.css()} !important;
            }
          }
        `;
        return (
            <Wrapper href={this.props.href}>
                {this.props.children}
                {!this.props.showLinkIcon ? <></> : <LinkIcon/>}
            </Wrapper>

        );
    }
}
