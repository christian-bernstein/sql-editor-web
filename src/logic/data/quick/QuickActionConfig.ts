import {QuickActionPanel} from "../../../components/ho/quickPanel/QuickActionPanel";
import {Themeable} from "../../../Themeable";
import {ObjectVisualMeaning} from "../../ObjectVisualMeaning";
import {CSSProperties} from "react";

export interface QuickActionConfig {
    tags: string[],
    description?: string,
    displayName: string,

    visualMeaning?: ObjectVisualMeaning,

    // todo add onClick

    wrapperStyleOverwrite?: CSSProperties,
    wrapInDefaultButton?: boolean,
    render(theme: Themeable.Theme, panel: QuickActionPanel, config: QuickActionConfig): JSX.Element,
    shouldShow?(): boolean,
    renderHover?(theme: Themeable.Theme, panel: QuickActionPanel): JSX.Element,
    beta?: boolean
}
