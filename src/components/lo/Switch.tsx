import {BernieComponent} from "../../logic/BernieComponent";
import {getMeaningfulColors, Themeable} from "../../logic/style/Themeable";
import {Assembly} from "../../logic/assembly/Assembly";
import {Checkbox, FormControlLabel} from "@mui/material";
import React, {SyntheticEvent} from "react";
import {ObjectVisualMeaning} from "../../logic/style/ObjectVisualMeaning";
import {WithVisualMeaning} from "../../logic/style/WithVisualMeaning";
import {getOr} from "../../logic/Utils";
import styled from "styled-components";
import {If} from "../logic/If";

export type SwitchProps = WithVisualMeaning & {
    text?: JSX.Element | string,
    onChange?: (event: SyntheticEvent, checked: boolean) => void,
    checked?: boolean,
    basicIconColor?: boolean
}

export class Switch extends BernieComponent<SwitchProps, any, any> {

    componentRender(p: SwitchProps, s: any, l: any, t: Themeable.Theme, a: Assembly): JSX.Element | undefined {
        const vm = getOr(p.visualMeaning, ObjectVisualMeaning.UI_NO_HIGHLIGHT);
        const mc = getMeaningfulColors(vm, t);
        const checked = getOr(p.checked, false);
        // todo check if 3 width-settings affect the 'auto-result-open'-button in the editor
        const Wrapper = styled.span`       
          width: 100%;
          
          .MuiFormControlLabel-root {
            margin-right: 0;
            margin-left: 0;
            width: 100%;
          }
          
          .MuiTypography-root {
            margin-left: ${t.gaps.smallGab.css()};
            width: 100%;
          }
        `;
        return (
            <Wrapper>
                <FormControlLabel control={<Checkbox defaultChecked={checked} sx={{
                    color: getOr(p.basicIconColor, false) ? t.colors.iconColor.css() : t.colors.backgroundHighlightColor200.css(),
                    // paddingX: t.paddings.defaultButtonPadding.css(),
                    paddingX: 0,
                    paddingY: 0,

                    '&.Mui-checked': {
                        color: getOr(p.basicIconColor, false) ? t.colors.iconColor.css() : mc.lighter.css(),
                    },
                }}/>} label={
                    <If condition={p.text === undefined} ifTrue={<>{this.props.children}</>} ifFalse={
                        <>{p.text}</>
                    }/>
                } onChange={p.onChange}/>
            </Wrapper>
        );
    }
}
