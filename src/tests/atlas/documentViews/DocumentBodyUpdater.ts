import {DocumentBodyUpdaterInstruction} from "./DocumentBodyUpdaterInstruction";

export interface DocumentBodyUpdater {
    update(instruction: DocumentBodyUpdaterInstruction): void;
}
