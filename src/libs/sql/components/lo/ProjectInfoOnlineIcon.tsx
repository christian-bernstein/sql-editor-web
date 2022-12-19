import React from "react";
import {LoadState} from "../../logic/misc/LoadState";
import styled from "styled-components";
import {ReactComponent as StaticIcon} from "../../../../assets/icons/ic-20/ic20-link.svg";
import {Icon} from "./Icon";
import {ObjectVisualMeaning} from "../../logic/style/ObjectVisualMeaning";
import {getMeaningfulColors, MeaningfulColors, Themeable} from "../../logic/style/Themeable";
import {utilizeGlobalTheme} from "../../logic/app/App";
import {px} from "../../logic/style/DimensionalMeasured";

export const ProjectInfoOnlineIcon: React.FC<{
    static: boolean,
    state: LoadState
}> = React.memo(props => {
    const vm: ObjectVisualMeaning = (() => {
        switch (props.state) {
            case LoadState.ONLINE: return ObjectVisualMeaning.SUCCESS;
            case LoadState.OFFLINE: return ObjectVisualMeaning.UI_NO_HIGHLIGHT;
            case LoadState.STOPPING: return ObjectVisualMeaning.ERROR;
            case LoadState.STARTING: return ObjectVisualMeaning.WARNING;
            case undefined:
                // todo fix
                // console.error("ProjectInfoOnlineIcon reads undefined on LoadState, but shouldn't do that")
                return ObjectVisualMeaning.UI_NO_HIGHLIGHT;
        }
    })();
    const theme: Themeable.Theme = utilizeGlobalTheme();
    const mc: MeaningfulColors = getMeaningfulColors(vm, theme);
    const Wrapper = styled.div`
      border-radius: 50%;
      display: flex;
      justify-content: center;
      align-items: center;
      width: 20px;
      height: 20px;
      background-color: ${mc.main.withAlpha(theme.alpha.opaqueUI).css()};
      border: 1px solid ${mc.lighter.css()};
    `;
    return (
        <Wrapper {...props}>
            {props.static ? (
                <Icon icon={<StaticIcon/>} size={px(14)} visualMeaning={vm} colored/>
            ) : <></>}
        </Wrapper>
    );
});
