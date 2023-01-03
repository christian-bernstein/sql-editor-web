import {BC} from "../../../libs/sql/logic/BernieComponent";
import {Assembly} from "../../../libs/sql/logic/assembly/Assembly";
import {Themeable} from "../../../libs/sql/logic/style/Themeable";
import styled from "styled-components";
import {isDesktop} from "react-device-detect";
import {AF} from "../../../libs/sql/components/logic/ArrayFragment";

export type ScreenProps = {
    main: JSX.Element
    background?: JSX.Element
}

export class Screen extends BC<ScreenProps, any, any> {

    componentRender(p: ScreenProps, s: any, l: any, t: Themeable.Theme, a: Assembly): JSX.Element | undefined {

        const Container = styled.div`
          width: 100vw;
          height: 100vh;
          background-color: white;
          position: relative;
          display: flex;
          justify-content: center;
        `;

        const Background = styled.div`
          position: absolute;
          width: 100%;
          height: 100%;
        `;

        const Content = styled.div`
          width: 100%;
          height: 100%;
          z-index: 100;
          
          padding-left: .75rem;
          padding-right: .75rem;
          
          @media (min-width: 1400px) {
            max-width: 1320px;
          }

          @media (min-width: 1580px) {
            max-width: 1550px;
          }
        `;

        return (
            <Container children={
                <AF elements={[
                    <Content children={p.main}/>,
                    <Background children={p.background}/>
                ]}/>
            }/>
        );
    }
}
