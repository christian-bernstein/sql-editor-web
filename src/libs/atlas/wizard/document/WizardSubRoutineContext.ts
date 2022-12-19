import {VFSFolderView} from "../../components/VFSFolderView";
import {Folder} from "../../data/Folder";
import {BC} from "../../../sql/logic/BernieComponent";
import {WizardEngineInstruction} from "./WizardEngineInstruction";
import {AtlasDocument} from "../../data/AtlasDocument";

export type WizardSubRoutineContext = {
    view: VFSFolderView,
    currentFolder: Folder,
    component: BC<any, any, any>
    mainEngineInstruction: WizardEngineInstruction
    documentBase: Partial<AtlasDocument>;
}
