import React, {CSSProperties} from "react";
import {Themeable} from "../Themeable";
import {utilizeGlobalTheme} from "../logic/App";
import styled from "styled-components";
import {DimensionalMeasured} from "../logic/style/DimensionalMeasured";
import {getOr} from "../logic/Utils";

export type PageProps = {
    gapX?: DimensionalMeasured,
    gapY?: DimensionalMeasured,
    deactivateGap?: boolean,
    style?: CSSProperties,
    classnames?: string[],
    deactivatePadding?: boolean
}

/**
 * todo rename to screen
 */
export const PageV2: React.FC<PageProps> = React.memo(props => {
    const theme: Themeable.Theme = utilizeGlobalTheme();
    const Wrapper = styled.div`
          padding: ${props.deactivatePadding ? 0 : theme.paddings.defaultObjectPadding.css()};
          width: 100%;
          height: 100%;
          display: flex;
          flex-direction: column;
          overflow-y: scroll;
          background-color: ${theme.colors.backgroundColor.css()};
          gap: ${getOr(props.deactivateGap, false) ? 0 : getOr(props.gapY?.css(), theme.gaps.defaultGab.css())} ${getOr(props.deactivateGap, false) ? 0 : getOr(props.gapX?.css(), theme.gaps.defaultGab.css())}
        `;
    return (
        <Wrapper style={getOr(props.style, {})} className={getOr(props.classnames?.join(" "), "")}>
            {props.children}
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
}
