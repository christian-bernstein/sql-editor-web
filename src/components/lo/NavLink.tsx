import {BernieComponent} from "../../logic/BernieComponent";
import {Assembly} from "../../logic/assembly/Assembly";
import {Themeable} from "../../logic/style/Themeable";
import styled from "styled-components";
import {Text, TextType} from "./Text";
import {Cursor} from "../../logic/style/Cursor";
import {px} from "../../logic/style/DimensionalMeasured";
import {Icon} from "./Icon";
import {ReactComponent as DropdownIndicatorIcon} from "../../assets/icons/ic-16/ic16-chevron-down.svg";
import {If} from "../logic/If";

export type NavLinkProps = {
    text: string,
    onClick?: (link: NavLink) => void,
    onHoverStart?: (link: NavLink) => void,
    onHoverEnd?: (link: NavLink) => void,
    dropDownIndicator?: boolean
}

export class NavLink extends BernieComponent<NavLinkProps, any, any> {

    componentRender(p: NavLinkProps, s: any, l: any, t: Themeable.Theme, a: Assembly): JSX.Element | undefined {
        const CSS = styled.span`          
          p {
            transition: color .1s ease;
            font-weight: normal;
          }
          
          path {
            transition: fill .1s ease;
            fill: ${t.colors.fontSecondaryColor.css()} !important;
          }

          &:hover {
            p {
              color: ${t.colors.fontPrimaryColor.css()};
            }

            path {
              fill: ${t.colors.fontPrimaryColor.css()} !important;
            }
          }
        `;

        return (
            <CSS children={
                <Text
                    onMouseOver={() => p.onHoverStart?.(this)}
                    onClick={() => p.onClick?.(this)}
                    cursor={Cursor.pointer}
                    fontSize={px(14)}
                    type={TextType.displayDescription}
                    text={p.text}
                    enableRightAppendix
                    enableLeftAppendix
                    rightAppendix={
                        <If condition={p.dropDownIndicator} ifTrue={
                            <Icon icon={<DropdownIndicatorIcon/>} size={px(10)}/>
                        }/>
                    }
                />
            }/>
        );
    }

}
