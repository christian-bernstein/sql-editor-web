import React, {CSSProperties} from "react";
import {getMeaningfulColors, MeaningfulColors, Themeable} from "../../logic/style/Themeable";
import {utilizeGlobalTheme} from "../../logic/app/App";
import styled from "styled-components";
import {ObjectVisualMeaning} from "../../logic/style/ObjectVisualMeaning";
import {getOr} from "../../logic/Utils";
import {Color} from "../../logic/style/Color";
import {DimensionalMeasured} from "../../logic/style/DimensionalMeasured";
import {Cursor} from "../../logic/style/Cursor";
import {Text} from "./Text";
import {BackgroundColorProps} from "../props/BackgroundColorProps";
import {Tooltip} from "../ho/tooltip/Tooltip";

export type ButtonProps = {
    style?: CSSProperties,
    visualMeaning?: ObjectVisualMeaning,
    opaque?: boolean,
    opaqueValue?: number,

    onClick?: (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => void,
    onDoubleClick?: (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => void,
    onContextMenu?: (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => void,

    shrinkOnClick?: boolean,
    width?: DimensionalMeasured,
    height?: DimensionalMeasured,
    cursor?: Cursor,
    enableBaseAnimation?: boolean,
    baseAnimation?: "hover-repeat",
    padding?: DimensionalMeasured,
    zIndex?: number,
    border?: boolean,
    bgColorOnDefault?: boolean,
    highlight?: boolean,
    vibrateOnClick?: boolean,
    vibrationPattern?: number[],
    text?: string,

    tooltip?: string | JSX.Element,

    borderRadiiConfig?: {
        enableCustomBorderRadii?: boolean,
        fallbackCustomBorderRadii?: DimensionalMeasured,
        topLeft?: DimensionalMeasured,
        topRight?: DimensionalMeasured,
        bottomLeft?: DimensionalMeasured,
        bottomRight?: DimensionalMeasured
    },
} & BackgroundColorProps

export class Button extends React.Component<ButtonProps, any> {

    constructor(props: ButtonProps) {
        super(props);
    }

    private onClick(event: React.MouseEvent<HTMLDivElement, MouseEvent>) {
        if (this.props.vibrateOnClick && window.navigator.vibrate !== undefined) {
            window.navigator.vibrate(getOr(this.props.vibrationPattern, [1]));
        }
        if (this.props.onClick !== undefined) {
            this.props.onClick?.(event);
        }
    }

    private onDoubleClick(event: React.MouseEvent<HTMLDivElement, MouseEvent>) {
        if (this.props.vibrateOnClick && window.navigator.vibrate !== undefined) {
            window.navigator.vibrate(getOr(this.props.vibrationPattern, [1]));
        }
        if (this.props.onDoubleClick !== undefined) {
            this.props.onDoubleClick?.(event);
        }
    }

    private onContextMenu(event: React.MouseEvent<HTMLDivElement, MouseEvent>) {
        if (this.props.vibrateOnClick && window.navigator.vibrate !== undefined) {
            window.navigator.vibrate(getOr(this.props.vibrationPattern, [1]));
        }
        if (this.props.onContextMenu !== undefined) {
            this.props.onContextMenu?.(event);
            event.preventDefault();
            event.stopPropagation();
        }
    }

    private getBackgroundColor(): Color {
        // Check if custom background color is set
        const backgroundConfig = this.props.backgroundColorConfig;
        if (backgroundConfig?.backgroundColor !== undefined) return backgroundConfig.backgroundColor;
        // Return default generated background color
        const theme: Themeable.Theme = utilizeGlobalTheme();
        const meaningfulColors: MeaningfulColors = getMeaningfulColors(getOr(this.props.visualMeaning, ObjectVisualMeaning.UI_NO_HIGHLIGHT), theme);
        return this.props.opaque ? meaningfulColors.main.withAlpha(getOr(this.props.opaqueValue, .1)) : meaningfulColors.main;
    }

    render() {
        const theme: Themeable.Theme = utilizeGlobalTheme();
        const meaningfulColors: MeaningfulColors = getMeaningfulColors(getOr(this.props.visualMeaning, ObjectVisualMeaning.UI_NO_HIGHLIGHT), theme);
        const bgColor: Color = this.getBackgroundColor();

        const Button = styled.div`
          border-radius: ${theme.radii.defaultObjectRadius.css()};
          background-color: ${getOr(this.props.bgColorOnDefault, true) ? bgColor.css() : "transparent"};
          border: ${getOr(this.props.border, true) ? `1px solid ${meaningfulColors.lighter.css()}` : "none"};
          padding: ${getOr(this.props.padding, theme.paddings.defaultButtonPadding).css()};
          color: ${theme.colors.fontPrimaryColor.css()};
          font-family: ${theme.texts.fontFamily};
          width: ${getOr(this.props.width?.css(), "auto")};
          height: ${getOr(this.props.height?.css(), "auto")};
          display: flex;
          align-content: center;
          justify-content: center;
          cursor: ${getOr(this.props.cursor, Cursor.pointer)};
          transition: all ${theme.transitions.mainTime.css()};
          z-index: ${getOr(this.props.zIndex, 1)};
          -webkit-tap-highlight-color: transparent;
          
          border-radius: ${(() => {
            const config = this.props.borderRadiiConfig;
            if (config !== undefined && config.enableCustomBorderRadii) {
              const radii = getOr(config.fallbackCustomBorderRadii, theme.radii.defaultObjectRadius);
              const topLeft: DimensionalMeasured = getOr(config.topLeft, radii);
              const topRight: DimensionalMeasured = getOr(config.topRight, radii);
              const bottomLeft: DimensionalMeasured = getOr(config.bottomLeft, radii);
              const bottomRight: DimensionalMeasured = getOr(config.bottomRight, radii);
              return `${topLeft.css()} ${topRight.css()} ${bottomLeft.css()} ${bottomRight.css()}`;
            } else {
              return theme.radii.defaultObjectRadius.css();
            }
          })()};
          
          ${getOr(this.props.enableBaseAnimation, false) ? (
              `animation: 1.5s infinite ${this.props.baseAnimation};`
          ) : ("")}
          
          & * {
            cursor: ${getOr(this.props.cursor, Cursor.pointer)};
          }
          
          * {
            user-select: none;
          }
          
          &:hover {
            background-color: ${bgColor.css()};
            filter: brightness(${theme.hovers.hoverLightFilter.css()});
            box-shadow: ${this.props.highlight ? `0 0 0 4px ${meaningfulColors.lighter.withAlpha(.13).css()}` : "none"};
          }

          &:active {
            transform: ${this.props.shrinkOnClick ? "scale(.99)" : "scale(1)"};
            filter: brightness(${theme.hovers.clickLightFilter.css()});
          }
          
          @keyframes hover-repeat {
            0%, 100% {
              box-shadow: 0 0 0 0 ${meaningfulColors.lighter.withAlpha(.13).css()};
            }

            50% {
              box-shadow: 0 0 0 4px ${meaningfulColors.lighter.withAlpha(.13).css()};
            }
          }
        `;

        const buttonRenderer = () => (
            <Button
                onClick={event => this.onClick(event)}
                style={getOr(this.props.style, {} as CSSProperties)}
                onDoubleClick={event => this.onDoubleClick(event)}
                onContextMenu={event => this.onContextMenu(event)}
            >
                {this.props.text === undefined ? undefined : (
                    <Text whitespace={"nowrap"} text={this.props.text}/>
                )}
                {this.props.children}
            </Button>
        );

        if (this.props.tooltip !== undefined) {
            return (
                <Tooltip arrow title={this.props.tooltip} children={
                    buttonRenderer()
                }/>
            );
        } else {
            return buttonRenderer();
        }
    }
}
