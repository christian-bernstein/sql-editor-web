import {BC} from "../../../libs/sql/logic/BernieComponent";
import {Assembly} from "../../../libs/sql/logic/assembly/Assembly";
import {Themeable} from "../../../libs/sql/logic/style/Themeable";
import styled from "styled-components";
import {Flex} from "../../../libs/sql/components/lo/FlexBox";
import {Typography} from "./Typography";
import {AF} from "../../../libs/sql/components/logic/ArrayFragment";
import {Link} from "react-router-dom";
import {Icon} from "../../../libs/sql/components/lo/Icon";
import {ReactComponent as LinkArrow} from "../assets/arrow-right.svg";
import {Color} from "../../../libs/sql/logic/style/Color";

export type LinkWithDescriptionProps = {
    title: string,
    description: string,
    destination: string
}

export class LinkWithDescription extends BC<LinkWithDescriptionProps, any, any> {

    componentRender(p: LinkWithDescriptionProps, s: any, l: any, t: Themeable.Theme, a: Assembly): JSX.Element | undefined {

        const LinkWithDescriptionWrapper = styled.div`
          display: flex;
          position: relative;
          flex-direction: column;
          
        `;

        const LinkWrapper = styled.a`
          display: flex;
          position: relative;
          flex-direction: row;
          align-items: center;
          gap: 21px;
          text-decoration: none !important;
          
          .icon {
            transition: margin-left 100ms ease-in-out;
            margin-left: 0;
          }
          
          &:hover {
            .icon {
              margin-left: .5rem;
            }
          }
        `;

        return (
            <LinkWithDescriptionWrapper children={
                <AF elements={[
                    <LinkWrapper href={p.destination} children={
                        <AF elements={[
                            <Typography text={p.title} style={{
                                color: "#C767FE",
                                textDecoration: "none !important",
                            }}/>,
                            <span className={"icon"} children={
                                <Icon icon={<LinkArrow/>} colored color={Color.ofHex("#C767FE")}/>
                            }/>
                        ]}/>
                    }/>,
                    <Typography style={{
                        fontFamily: 'DM Serif Text'
                    }} text={p.description}/>
                ]}/>
            }/>
        );
    }
}
