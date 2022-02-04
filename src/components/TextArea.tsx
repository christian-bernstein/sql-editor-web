import React, {ChangeEvent} from "react";
import {ObjectVisualMeaning} from "../logic/ObjectVisualMeaning";
import {getOr} from "../logic/Utils";
import {v4} from "uuid";
import {InputProps} from "./Input";
import styled from "styled-components";
import {getMeaningfulColors, MeaningfulColors, Themeable} from "../Themeable";
import {utilizeGlobalTheme} from "../logic/App";
import {FontWeight} from "../logic/style/FontWeight";

export type TextAreaProps = {
    id?: string,
    defaultValue?: string,
    label: string,
    visualMeaning?: ObjectVisualMeaning,
    opaque?: boolean,
    opaqueValue?: number,
    onChange?: (ev: ChangeEvent<HTMLTextAreaElement>) => void,
    value?: string
    autoFocus?: boolean,
    placeholder?: string,
    rows?: number,
    fontWeight?: FontWeight
}

export type TextAreaState = {
    id: string,
    value: string
}

// todo add styling
export class TextArea extends React.Component<TextAreaProps, TextAreaState> {

    constructor(props: TextAreaProps) {
        super(props);
        this.state = {
            id: getOr(props.id, v4()),
            value: ""
        };
    }

    private onInputChange(ev: ChangeEvent<HTMLTextAreaElement>) {
        this.props.onChange?.(ev);
    }

    render() {
        const theme: Themeable.Theme = utilizeGlobalTheme();
        const meaningfulColors: MeaningfulColors = getMeaningfulColors(getOr(this.props.visualMeaning, ObjectVisualMeaning.UI_NO_HIGHLIGHT), theme);
        const TextArea = styled.textarea`
          width: 100%;
          position: relative;
          background-color: ${theme.colors.backgroundHighlightColor.css()};
          border-radius: ${theme.radii.defaultObjectRadius.css()};
          padding: ${theme.paddings.defaultObjectPadding.css()};
          border: 1px solid ${meaningfulColors.lighter.css()};
          color: ${theme.colors.fontPrimaryColor.css()};
          font-family: "${theme.texts.fontFamily}", "Consolas", monospace !important;
          font-variant-ligatures: common-ligatures;
          min-height: 3.5rem;
          font-weight: ${getOr(this.props.fontWeight, "normal")};
          resize: vertical;  
          
          &:hover {
            filter: brightness(${theme.hovers.hoverLightFilter.css()});
          }

          &:focus {
            box-shadow: 0 0 0 4px ${meaningfulColors.shadowColor.css()};
          }
        `;

        return (
            <TextArea
                key={this.state.id}
                rows={getOr(this.props.rows, 8)}
                autoFocus={getOr(this.props.autoFocus, false)}
                spellCheck={false}
                onChange={event => this.onInputChange(event)}
                placeholder={getOr(this.props.placeholder, " ")}
                value={this.props.value}
            />
        );
    }
}
