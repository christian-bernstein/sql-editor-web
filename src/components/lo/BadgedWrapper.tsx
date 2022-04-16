import React from "react";
import "../../styles/components/BadgedWrapper.scss";
import styled from "styled-components";

export type BadgedWrapperProps = {
    badge: JSX.Element,
    showBadgeInitially: boolean,
    badgeFlowDirection?: "outwards" | "right"
    numberBadge?: boolean
}

export type BadgedWrapperState = {
    showBadge: boolean
}

export class BadgedWrapper extends React.Component<BadgedWrapperProps, BadgedWrapperState> {

    constructor(props: BadgedWrapperProps) {
        super(props);
        this.state = {
            showBadge: props.showBadgeInitially
        };
    }

    render() {
        const Container = styled.div`
          ${this.props.badgeFlowDirection === "right" ? "left: 25%;" : "right: -25%;"}
        `;
        return (
            <div className={"badged-wrapper"}>
                <div className={"wrapped"}>
                    {this.props.children}
                </div>
                <Container className={"badge-container"}>
                    {this.state.showBadge ? this.props.badge : <></>}
                </Container>
            </div>
        );
    }

    // todo implement method and use
    private shouldShowWrappedChildren(): boolean {
        return true;
    }
}
