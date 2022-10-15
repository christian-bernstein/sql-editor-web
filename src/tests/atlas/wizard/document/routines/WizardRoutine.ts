import {BC} from "../../../../../logic/BernieComponent";

export type WizardRoutine = {
    title: string,
    description: string,
    tags: Array<string>,
    previewCard: (onSelectCallback: () => void) => JSX.Element,
    run: (component: BC<any, any, any>) => void
}
