import {QuickActionPanel} from "../../../components/ho/quickPanel/QuickActionPanel";
import {Themeable} from "../../style/Themeable";
import {ObjectVisualMeaning} from "../../style/ObjectVisualMeaning";
import React, {CSSProperties} from "react";

export interface QuickActionConfig {
    tags: string[],
    description?: string,
    displayName: string,
    opaque?: boolean,
    isAllowedAction?: () => boolean,
    visualMeaning?: ObjectVisualMeaning,
    onClick?: (event: React.MouseEvent<HTMLSpanElement, MouseEvent>, config: QuickActionConfig, panel: QuickActionPanel) => void,
    wrapperStyleOverwrite?: CSSProperties,
    wrapInDefaultButton?: boolean,
    render(theme: Themeable.Theme, panel: QuickActionPanel, config: QuickActionConfig): JSX.Element,
    shouldShow?(): boolean,
    renderHover?(theme: Themeable.Theme, panel: QuickActionPanel): JSX.Element,
    beta?: boolean
}
