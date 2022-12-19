import {BC} from "../../../libs/sql/logic/BernieComponent";
import {CSSProperties} from "react";
import styled from "styled-components";
import {Assembly} from "../../../libs/sql/logic/assembly/Assembly";
import {Themeable} from "../../../libs/sql/logic/style/Themeable";
import {Typography} from "./Typography";

export type TextLinkProps = {
    href: string,
    style?: CSSProperties,
    visibleLink?: string | JSX.Element
}

export class TextLink extends BC<TextLinkProps, any, any> {

    componentRender(p: TextLinkProps, s: any, l: any, t: Themeable.Theme, a: Assembly): JSX.Element | undefined {
        const TextLinkWrapper = styled.a`
          transition: all 100ms ease-in-out;
          text-decoration: underline;
          text-decoration-color: transparent;
          cursor: pointer;
          
          &:hover {
            text-decoration-color: black;
          }
        `;

        return (
            <TextLinkWrapper href={p.href} children={p.visibleLink}/>
        );
    }
}
