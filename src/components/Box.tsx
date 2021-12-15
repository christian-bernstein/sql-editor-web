import React from "react";
import styled from "styled-components";
import {Themeable} from "../Themeable";
import {App} from "../logic/App";

export type BoxProps = {
    highlight?: boolean
    classNames?: string[]
}

export class Box extends React.Component<BoxProps, any> {

    constructor(props: BoxProps) {
        super(props);
    }

    render() {
        const theme: Themeable.Theme = App.app().getGlobalTheme();
        const Box = styled.div`
          background-color: ${theme.colors.backgroundHighlightColor.css()};
          border-radius: ${theme.radii.defaultObjectRadius.css()};
          border: 1px solid #30363D;
          padding: ${theme.paddings.defaultObjectPadding.css()};

          &.highlight:hover {
            filter: brightness(${theme.hovers.hoverLightFilter.css()});
            border: 1px solid ${theme.colors.primaryHighlightColor.css()} !important;
            box-shadow: 0 0 0 4px ${theme.colors.borderPrimaryShadowColor.css()};
          }
        `;
        const classNames: string[] = this.props.classNames === undefined ? [] : this.props.classNames;
        const highlight: boolean = this.props.highlight === undefined ? false : this.props.highlight;
        return (
            <Box className={[...classNames, "box", highlight ? "highlight" : ""].join(" ").trim()}>
                {this.props.children}
            </Box>
        );
    }
}
