import {BernieComponent} from "../../logic/BernieComponent";
import {Themeable} from "../../logic/style/Themeable";
import {Assembly} from "../../logic/assembly/Assembly";
import styled from "styled-components";

export type DotProps = {
    className?: string
}

export class Dot extends BernieComponent<DotProps, any, any> {
    componentRender(p: DotProps, s: any, l: any, t: Themeable.Theme, a: Assembly): JSX.Element | undefined {
        const Styled = styled.span`
          width: 3px;
          height: 3px;
          border-radius: 10px;
          background-color: ${t.colors.borderPrimaryColor.css()};
        `;

        return (
            <Styled className={p.className}/>
        );
    }
}
