import {QuickActionPanel} from "../../../components/ho/quickPanel/QuickActionPanel";
import {Themeable} from "../../../Themeable";

export interface QuickActionConfig {
    tags: string[]
    render(theme: Themeable.Theme, panel: QuickActionPanel): JSX.Element,
    shouldShow?(): boolean,
    renderHover?(theme: Themeable.Theme, panel: QuickActionPanel): JSX.Element
}
