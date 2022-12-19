import {SettingsElementIconConfig} from "../../sql/components/ho/settingsElement/SettingsElement";

export type SettingsPageBlueprint = {
    pageID: string,
    title: string,
    description: string,
    pageRenderer: () => JSX.Element,
    iconConfig?: SettingsElementIconConfig
}
