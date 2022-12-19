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
        `;

        const Background = styled.div`
          position: absolute;
          width: 100%;
          height: 100%;
          padding: 0 300px;
        `;

        const Content = styled.div`
          width: 100%;
          height: 100%;
          padding: 0 300px;
          z-index: 100;
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
