import {QuickActionPanel} from "../../../components/ho/quickPanel/QuickActionPanel";
import {Themeable} from "../../../Themeable";
import {ObjectVisualMeaning} from "../../ObjectVisualMeaning";
import React, {CSSProperties} from "react";

export interface QuickActionConfig {
    tags: string[],
    description?: string,
    displayName: string,
    opaque?: boolean,
    visualMeaning?: ObjectVisualMeaning,
    onClick?: (event: React.MouseEvent<HTMLSpanElement, MouseEvent>, config: QuickActionConfig) => void,
    wrapperStyleOverwrite?: CSSProperties,
    wrapInDefaultButton?: boolean,
    render(theme: Themeable.Theme, panel: QuickActionPanel, config: QuickActionConfig): JSX.Element,
    shouldShow?(): boolean,
    renderHover?(theme: Themeable.Theme, panel: QuickActionPanel): JSX.Element,
    beta?: boolean
}
