import {VFSFolderView} from "../../components/VFSFolderView";
import {Folder} from "../../data/Folder";
import {BC} from "../../../sql/logic/BernieComponent";
import {AtlasDocument} from "../../data/AtlasDocument";
import {WizardSubRoutine} from "./WizardSubRoutine";

export type WizardEngineInstruction = {
    view: VFSFolderView,
    currentFolder: Folder,
    component: BC<any, any, any>
    documentBase?: Partial<AtlasDocument>
    skipMetaWizard?: boolean
    subRoutines?: Array<WizardSubRoutine>,
    onSetupComplete?: (document: AtlasDocument) => void,
    wizardEngineID: string
}
