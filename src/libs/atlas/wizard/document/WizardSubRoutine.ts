import {AtlasDocument} from "../../data/AtlasDocument";
import {WizardSubRoutineContext} from "./WizardSubRoutineContext";

export type WizardSubRoutine = {
    run: (document: Partial<AtlasDocument>, context: WizardSubRoutineContext) => Promise<Partial<AtlasDocument>>
}
