import React from "react";
import styled from "styled-components";
import {Chart} from "./Chart";

export const ChartPage: React.FC = (props, context) => {
    const Page = styled.div`
      width: 100%;
      height: 100%;
      box-sizing: border-box;
      padding: .6rem;
      display: flex;
      justify-content: center;
      align-items: center;
    `;
    return (
        <Page className={"test"}>
            <Chart/>
        </Page>
    );
}
