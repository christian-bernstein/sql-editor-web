import {Color} from "../Color";
import React from "react";
// import "../styles/components/Badge.scss";
import styled from "styled-components";
import {getMeaningfulColors, Themeable} from "../Themeable";
import {utilizeGlobalTheme} from "../logic/App";
import {WithVisualMeaning} from "../logic/WithVisualMeaning";
import {getOr} from "../logic/Utils";
import {ObjectVisualMeaning} from "../logic/ObjectVisualMeaning";
import {Cursor} from "../logic/style/Cursor";
import {Text} from "./Text";
import {px} from "../logic/DimensionalMeasured";

export type BadgeProps = WithVisualMeaning & {
    background?: Color,
    opaque?: boolean,
    padding?: boolean,
    visibleStructure?: boolean,
    shadow?: boolean,
    cursor?: Cursor
}

export class Badge extends React.Component<BadgeProps, any>{

    /**
     * Creates a standardized beta-badge element.
     * This element indicates component or function being in its beta
     * @param theme The theme used for creating the beta-badge
     */
    public static beta(theme: Themeable.Theme = utilizeGlobalTheme()): JSX.Element {
        return (
            <Badge background={theme.colors.betaHighlightColor} visualMeaning={ObjectVisualMeaning.BETA} padding opaque>
                <Text text={"**beta**"} uppercase fontSize={px(12)} visualMeaning={ObjectVisualMeaning.BETA} coloredText/>
            </Badge>
        )
    }

    constructor(props: BadgeProps) {
        super(props);
    }

    render() {
        const theme: Themeable.Theme = utilizeGlobalTheme();
        const mc = getMeaningfulColors(getOr(this.props.visualMeaning, ObjectVisualMeaning.UI_NO_HIGHLIGHT), theme);
        const opaque = getOr(this.props.opaque, false);
        const bgColor: Color = opaque ? mc.main.withAlpha(.1) : mc.main;
        const vs = getOr(this.props.visibleStructure, true);
        const padding = getOr(this.props.padding, true);
        const shadow = getOr(this.props.shadow, false);
        const cursor = getOr(this.props.cursor, Cursor.default);

        const Wrapper = styled.div`
          background: ${vs ? bgColor.css() : "transparent"};
          padding: 0 ${padding ? "5px" : "0"};
          // border: 1px solid ${theme.colors.borderPrimaryColor.css()};
          cursor: ${cursor};
          border: 1px solid ${mc.lighter.css()};
          border-radius: 9999px;
          font-size: 13px;
          display: flex;
          justify-content: center;
          align-items: center;
          box-shadow: 0 0 0 ${shadow ? "2px" : "0"} ${theme.colors.backgroundColor.css()};
        `;

        return(
            <Wrapper className={"badge"}>
                {this.props.children}
            </Wrapper>
        );
    }
}
