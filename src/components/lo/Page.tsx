import React, {CSSProperties} from "react";
import {Themeable} from "../../logic/style/Themeable";
import {utilizeGlobalTheme} from "../../logic/app/App";
import styled from "styled-components";
import {DimensionalMeasured, px} from "../../logic/style/DimensionalMeasured";
import {getOr} from "../../logic/Utils";

import Background from "../../assets/images/img-2.png";
import {Image} from "./Image";
import {Centered} from "./PosInCenter";
import {BottomNavigation, BottomNavigationAction} from "@mui/material";
import {Text, TextType} from "./Text";
import {Icon} from "./Icon";
import {ReactComponent as LogoIcon} from "../../assets/logo.svg";
import {ObjectVisualMeaning} from "../../logic/style/ObjectVisualMeaning";
import {ReactComponent as ReleaseIcon} from "../../assets/icons/ic-24/ic24-globe.svg";
import {StaticDrawerMenu} from "./StaticDrawerMenu";
import {QuickActionPanel} from "../ho/quickPanel/QuickActionPanel";
import {ReactComponent as SettingsIcon} from "../../assets/icons/ic-24/ic24-settings.svg";
import {AppModeSwitcher} from "../ho/appModeSwitcher/AppModeSwitcher";

export type PageProps = {
    gapX?: DimensionalMeasured,
    gapY?: DimensionalMeasured,
    deactivateGap?: boolean,
    style?: CSSProperties,
    classnames?: string[],
    deactivatePadding?: boolean
    onDoubleClick?: (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => void
}

export function screenedAndCentered(child: JSX.Element): JSX.Element {
    return (
        <Screen children={
            <Centered fullHeight children={child}/>
        }/>
    );
}

export const Screen: React.FC<PageProps> = React.memo(props => {
    const theme: Themeable.Theme = utilizeGlobalTheme();
    const Wrapper = styled.div`
      padding: ${props.deactivatePadding ? 0 : theme.paddings.defaultObjectPadding.css()};
      // width: 100%;
      // height: 100%;
      width: 100vw;
      height: 100vh;
      display: flex;
      flex-direction: column;
      overflow-y: scroll;
      background-color: ${theme.colors.backgroundColor.css()};
      gap: ${getOr(props.deactivateGap, false) ? 0 : getOr(props.gapY?.css(), theme.gaps.defaultGab.css())} ${getOr(props.deactivateGap, false) ? 0 : getOr(props.gapX?.css(), theme.gaps.defaultGab.css())}
    `;

    const BG = styled.div`
      z-index: 1;
      position: absolute;
      width: 100%;
      height: 100%;
      left: 0;
      top: 0;
      filter: opacity(.1);
    `;

    const Content = styled.div`
      z-index: 2;
      position: absolute;
      width: 100%;
      height: 100%;
      left: 0;
      top: 0;
      padding: ${props.deactivatePadding ? 0 : theme.paddings.defaultObjectPadding.css()};
      display: flex;
      flex-direction: column;
      overflow-y: scroll;
      gap: ${getOr(props.deactivateGap, false) ? 0 : getOr(props.gapY?.css(), theme.gaps.defaultGab.css())} ${getOr(props.deactivateGap, false) ? 0 : getOr(props.gapX?.css(), theme.gaps.defaultGab.css())}
    `;

    return (
        <Wrapper onDoubleClick={event => getOr(props.onDoubleClick, () => {})(event)} style={getOr(props.style, {})} className={getOr(props.classnames?.join(" "), "")}>
            {/*<BG children={<Image pure src={Background}/>}/>*/}
            <Content children={props.children}/>


        </Wrapper>
    );
});

export class Page extends React.Component<PageProps, any>{

    render() {
        const theme: Themeable.Theme = utilizeGlobalTheme();
        const Wrapper = styled.div`
          padding: ${theme.paddings.defaultObjectPadding.css()};
          width: 100%;
          height: 100%;
          display: flex;
          flex-direction: column;
          overflow-y: scroll;
          background-color: ${theme.colors.backgroundColor.css()};
          gap: ${getOr(this.props.deactivateGap, false) ? 0 : getOr(this.props.gapY?.css(), theme.gaps.defaultGab.css())} ${getOr(this.props.deactivateGap, false) ? 0 : getOr(this.props.gapX?.css(), theme.gaps.defaultGab.css())}
        `;

        return (
            <Wrapper className={getOr(this.props.classnames?.join(" "), "")}>
                {this.props.children}
            </Wrapper>
        );
    }

    // {this.props.children}
}
