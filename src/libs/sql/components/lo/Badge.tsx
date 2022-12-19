import {Color} from "../../logic/style/Color";
import React from "react";
// import "../styles/components/Badge.scss";
import styled from "styled-components";
import {getMeaningfulColors, Themeable} from "../../logic/style/Themeable";
import {utilizeGlobalTheme} from "../../logic/app/App";
import {WithVisualMeaning} from "../../logic/style/WithVisualMeaning";
import {getOr} from "../../logic/Utils";
import {ObjectVisualMeaning} from "../../logic/style/ObjectVisualMeaning";
import {Cursor} from "../../logic/style/Cursor";
import {Text} from "./Text";
import {px} from "../../logic/style/DimensionalMeasured";

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
                <Text text={"beta"} bold uppercase fontSize={px(12)} visualMeaning={ObjectVisualMeaning.BETA} coloredText/>
            </Badge>
        )
    }

    public static badge(text: string, config: WithVisualMeaning & {
        theme?: Themeable.Theme,
        backgroundColor?: Color
    }): JSX.Element {
        const theme = getOr(config.theme, utilizeGlobalTheme());
        const vm = getOr(config.visualMeaning, ObjectVisualMeaning.BETA)
        const color = getOr(config.backgroundColor, theme.colors.betaHighlightColor)

        return (
            <Badge background={color} visualMeaning={vm} padding opaque>
                <Text text={text} bold uppercase fontSize={px(12)} visualMeaning={vm} coloredText/>
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
          
          // border-radius: 9999px;
          border-radius: ${theme.radii.defaultObjectRadius.css()};
          
          font-size: 13px;
          display: inline-flex;
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
