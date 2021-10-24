import {Color} from "../Color";
import React from "react";
import "../styles/components/Badge.scss";
import styled from "styled-components";

export type BadgeProps = {
    background?: Color
}

export class Badge extends React.Component<BadgeProps, any>{

    render() {
        const Wrapper = styled.div`
          background: ${this.props.background ? this.props.background.toHex() : "#3E3E3E"};
        `
        return(
            <Wrapper className={"badge"}>
                {this.props.children}
            </Wrapper>
        );
    }

}
