import {BC} from "../../../libs/sql/logic/BernieComponent";
import {Assembly} from "../../../libs/sql/logic/assembly/Assembly";
import {Themeable} from "../../../libs/sql/logic/style/Themeable";
import styled from "styled-components";
import {Typography} from "./Typography";

export type NavElementProps = {
    title: string,
    href: string,
    fixedActive?: boolean
}

export class NavElement extends BC<NavElementProps, any, any> {

    componentRender(p: NavElementProps, s: any, l: any, t: Themeable.Theme, a: Assembly): JSX.Element | undefined {
        const NavElementWrapper = styled.a`
          position: relative;
          text-decoration: none;
          
          &:before {
            content: '';
            position: absolute;
            bottom: -5px;
            left: 50%;
            transform: translateX(-50%);
            width: 80%;
            height: 2px;
            background-color: black;
            opacity: 0;
            transition: opacity 100ms ease-in-out;
          }
          
          &:hover {
            &:before {
              opacity: 1;
            }
          }
        `;

        return (
            <NavElementWrapper href={p.href} children={
                <Typography text={p.title} style={{
                    fontSize: "14px",
                    fontWeight: 600,
                    textTransform: "uppercase",
                    fontFamily: 'Poppins, sans-serif'
                }}/>
            }/>
        );
    }
}
