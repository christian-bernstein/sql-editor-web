import {BC} from "../../../libs/sql/logic/BernieComponent";
import {Assembly} from "../../../libs/sql/logic/assembly/Assembly";
import {Themeable} from "../../../libs/sql/logic/style/Themeable";
import styled from "styled-components";
import {CSSProperties} from "react";

export type TypographyProps = {
    text: string,
    style?: CSSProperties
}

export class Typography extends BC<TypographyProps, any, any> {

    componentRender(p: TypographyProps, s: any, l: any, t: Themeable.Theme, a: Assembly): JSX.Element | undefined {
        const P = styled.p`
          margin: 0 !important;
          font-size: 16px;
          color: black;
          font-family: 'Rubik Mono One', sans-serif;
        `;

        return (
            <P style={p.style} children={p.text}/>
        );
    }
}
