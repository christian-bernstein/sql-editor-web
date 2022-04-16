import "../../styles/components/Input.scss";
import React, {ChangeEvent} from "react";
import {v4} from "uuid";
import {ObjectVisualMeaning} from "../../logic/style/ObjectVisualMeaning";
import {getMeaningfulColors, MeaningfulColors, Themeable} from "../../logic/style/Themeable";
import {utilizeGlobalTheme} from "../../logic/app/App";
import {getOr} from "../../logic/Utils";
import styled from "styled-components";
import {Color} from "../../logic/style/Color";
import {FontWeight} from "../../logic/style/FontWeight";
import {DimensionalMeasured, px} from "../../logic/style/DimensionalMeasured";
import {If} from "../logic/If";

// todo remove
import {ReactComponent as EditIcon} from "../../assets/icons/ic-16/ic16-edit.svg";
import {FlexBox} from "./FlexBox";
import {Align} from "../../logic/style/Align";
import {Justify} from "../../logic/style/Justify";
import {Icon} from "./Icon";
import {CircularProgress} from "@mui/material";
import {ReactComponent as QuickIcon} from "../../assets/icons/ic-20/ic20-bolt.svg";

export type InputProps = {
    id?: string,
    defaultValue?: string,
    label?: string,
    visualMeaning?: ObjectVisualMeaning,
    opaque?: boolean,
    opaqueValue?: number,
    onChange?: (ev: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void,
    value?: string
    autoFocus?: boolean,
    type?: string,
    placeholder?: string,
    fontWeight?: FontWeight,
    height?: DimensionalMeasured,
    width?: DimensionalMeasured
    hideLabel?: boolean,
    minHeightBoundary?: boolean,
    bgColor?: Color,
    styledBorder?: boolean,
    paddingLeft?: boolean,
    fontSize?: DimensionalMeasured,
    minWidth?: DimensionalMeasured
}

export type InputState = {
    id: string,
    value: string
}

export class Input extends React.Component<InputProps, InputState> {

    private ref: React.RefObject<React.LegacyRef<HTMLInputElement> | undefined> = React.createRef<React.LegacyRef<HTMLInputElement> | undefined>();

    constructor(props: InputProps) {
        super(props);
        this.state = {
            id: getOr(props.id, v4()),
            value: ""
        };
    }

    private onInputChange(ev: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
        this.props.onChange?.(ev);
    }

    shouldComponentUpdate(nextProps: Readonly<InputProps>, nextState: Readonly<InputState>, nextContext: any): boolean {
        return false;
    }

    render() {
        const theme: Themeable.Theme = utilizeGlobalTheme();
        const meaningfulColors: MeaningfulColors = getMeaningfulColors(getOr(this.props.visualMeaning, ObjectVisualMeaning.UI_NO_HIGHLIGHT), theme);
        const baseColor: Color = getOr(this.props.bgColor, meaningfulColors.main);
        const bgColor: Color = this.props.opaque ? baseColor.withAlpha(getOr(this.props.opaqueValue, .1)): baseColor;
        const styledBorder = getOr(this.props.styledBorder, true);
        const paddingLeft = getOr(this.props.paddingLeft, true);

        const Wrapper = styled.div`
          min-width: ${getOr(this.props.minWidth, px()).css()};
          width: 100%;
          min-height: ${getOr(this.props.minHeightBoundary, true) ? "3.5rem" : "0"};
          height: ${this.props.height === undefined ? "auto" : this.props.height?.css()} !important;
          position: relative;
          background-color: ${theme.colors.backgroundHighlightColor.css()};
          box-sizing: border-box;
          border-radius: ${styledBorder ? theme.radii.defaultObjectRadius.css() : 0};
          padding: ${theme.paddings.defaultObjectPadding.css()};
          border: ${styledBorder ? "1px" : 0} solid ${meaningfulColors.lighter.css()};
          
          transition: all ${theme.transitions.fastTime.css()};
          
          &:hover {
            filter: brightness(${theme.hovers.hoverLightFilter.css()});
            // border: 1px solid ${meaningfulColors.lighter.css()} !important;
            // box-shadow: 0 0 0 4px ${theme.colors.borderPrimaryShadowColor.css()};
          }
          
          input {
            background-color: ${bgColor.css()};
            border: none;
            color: ${theme.colors.fontPrimaryColor.css()};
            font-family: "${theme.texts.fontFamily}", "Consolas", monospace !important;
            font-weight: ${getOr(this.props.fontWeight, "normal")};
            font-size: ${getOr(this.props.fontSize, px(12)).css()};
            position: absolute;
            top: 0;
            left: 0;
            bottom: 0;
            right: 0;
            width: 100%;
            height: 100%;
            outline: none;
            box-sizing: border-box;
            padding: ${paddingLeft ? theme.paddings.defaultObjectPadding.css() : 0};
            border-radius: ${theme.radii.defaultObjectRadius.withPlus(-2).css()};
            z-index: 1;
            
            &:focus {
              box-shadow: 0 0 0 4px ${meaningfulColors.shadowColor.css()};
            }
          }
          
          label {
            font-size: 14px;
            position: absolute;
            
            user-select: none;
            pointer-events: none;
            z-index: 2;
            
            left: ${theme.paddings.defaultObjectPadding.css()};
            top: 1.25rem;
            // padding: 0 .25rem;
            font-weight: 100;
            color: ${theme.colors.fontSecondaryColor.css()};
            transition: all .3s;
          }

          // todo fix
          // input:not(:placeholder-shown)
          // input:placeholder-shown
          input:focus + label, input:not(:placeholder-shown) + label {
            top: +.15rem;
            left: ${theme.paddings.defaultObjectPadding.css()};
            color: ${theme.colors.fontSecondaryColor.css()};
            font-size: 12.5px;
            letter-spacing: 0.02rem;
            font-weight: 100;
            z-index: 10;
          }
        `;

        return (
            <Wrapper className={"input-container"} key={this.state.id}>

                <input key={this.state.id}
                       type={getOr(this.props.type, "input")}
                       autoFocus={getOr(this.props.autoFocus, false)}
                       spellCheck={false}
                       ref={() => this.ref}
                       onChange={event => this.onInputChange(event)}
                       placeholder={getOr(this.props.placeholder, " ")}
                       value={this.props.value}
                />
                <If condition={getOr(this.props.hideLabel, false)} ifTrue={
                    <></>
                } ifFalse={
                    <label htmlFor={this.state.id}>{this.props.label}</label>
                }/>
            </Wrapper>
        );
    }
}
