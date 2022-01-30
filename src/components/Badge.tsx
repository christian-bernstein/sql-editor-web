import {Color} from "../Color";
import React from "react";
// import "../styles/components/Badge.scss";
import styled from "styled-components";
import {Themeable} from "../Themeable";
import {utilizeGlobalTheme} from "../logic/App";

export type BadgeProps = {
    background?: Color,
}

export class Badge extends React.Component<BadgeProps, any>{

    constructor(props: BadgeProps) {
        super(props);
    }

    render() {
        const theme: Themeable.Theme = utilizeGlobalTheme();
        const Wrapper = styled.div`
          background: ${this.props.background ? this.props.background.toHex() : "#3E3E3E"};
          // padding: 4px 4px;
          // padding: 0 4px;
          border: 1px solid ${theme.colors.borderPrimaryColor.css()};
          border-radius: 9999px;
          font-size: 13px;
          display: flex;
          justify-content: center;
          align-items: center;
          box-shadow: 0 0 0 2px ${theme.colors.backgroundColor.css()};
        `;

        return(
            <Wrapper className={"badge"}>
                {this.props.children}
            </Wrapper>
        );
    }

}
