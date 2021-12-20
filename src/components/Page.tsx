import React from "react";
import {Themeable} from "../Themeable";
import {utilizeGlobalTheme} from "../logic/App";
import styled from "styled-components";

export type PageProps = {
}

export class Page extends React.Component<PageProps, any>{

    render() {
        const theme: Themeable.Theme = utilizeGlobalTheme();
        const Wrapper = styled.div`
          padding: ${theme.paddings.defaultObjectPadding.css()};
          width: 100%;
          height: 100%;
          overflow: hidden;
          background-color: ${theme.colors.backgroundColor.css()};
        `;
        return (
            <Wrapper>
                {this.props.children}
            </Wrapper>
        );
    }

}
