import {WizardEngineInstruction} from "./WizardEngineInstruction";

export interface IWizardEngine {
    run(instruction: WizardEngineInstruction): void;
}
