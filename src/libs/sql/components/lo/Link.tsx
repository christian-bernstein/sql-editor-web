import React from "react";
import styled from "styled-components";
import {ObjectVisualMeaning} from "../../logic/style/ObjectVisualMeaning";
import {getMeaningfulColors, MeaningfulColors, Themeable} from "../../logic/style/Themeable";
import {utilizeGlobalTheme} from "../../logic/app/App";
import {getOr} from "../../logic/Utils";
import {ReactComponent as LinkIcon} from "../../../../assets/icons/ic-16/ic16-link.svg";
import {LinkPreview} from "@dhaiwat10/react-link-preview";
import {CustomTooltip} from "./CustomTooltip";
import {If} from "../logic/If";

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
            <If condition={getOr(this.props.linkTooltip, false)} ifTrue={
                <CustomTooltip enterDelay={2000} noBorder arrow noPadding title={
                    <LinkPreview
                        fallback={null}
                        fallbackImageSrc={""}
                        backgroundColor={theme.colors.backgroundHighlightColor200.css()}
                        primaryTextColor={theme.colors.fontPrimaryColor.css()}
                        secondaryTextColor={theme.colors.fontSecondaryColor.css()}
                        borderColor={theme.colors.borderPrimaryColor.css()}
                        borderRadius={theme.radii.defaultObjectRadius.css()}
                        imageHeight={"250px"}
                        showLoader
                        openInNewTab
                        width={"400px"}
                        url={this.props.href}
                    />
                } children={
                    <Wrapper href={this.props.href}>
                        {this.props.children}
                        {!this.props.showLinkIcon ? <></> : <LinkIcon/>}
                    </Wrapper>
                }/>
            } ifFalse={
                <Wrapper href={this.props.href}>
                    {this.props.children}
                    {!this.props.showLinkIcon ? <></> : <LinkIcon/>}
                </Wrapper>
            }/>
            // <Wrapper href={this.props.href}>
            //     {this.props.children}
            //     {!this.props.showLinkIcon ? <></> : <LinkIcon/>}
            // </Wrapper>
        );
    }
}
