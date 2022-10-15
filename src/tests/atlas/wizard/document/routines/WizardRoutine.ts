import {BC} from "../../../../../logic/BernieComponent";
import {Folder} from "../../../data/Folder";
import {VFSFolderView} from "../../../components/VFSFolderView";

export type WizardRoutine = {
    title: string,
    description: string,
    tags: Array<string>,
    previewCard: (onSelectCallback: () => void) => JSX.Element,
    run: (
        view: VFSFolderView,
        currentFolder: Folder,
        component: BC<any, any, any>
    ) => void
}
