import React from "react";
import styled from "styled-components";

export type BoxProps = {
    highlight: boolean
    classNames: string[]
}

export class Box extends React.Component<BoxProps, any> {

    constructor(props: BoxProps) {
        super(props);
    }

    render() {
        const Box = styled.div`
          border-radius: 6px;
          border: 1px solid #30363D;
          padding: .6rem;
        `;
        return (
            <Box className={[...this.props.classNames, "box"].join(" ").trim()}>
                {this.props.children}
            </Box>
        );
    }
}
