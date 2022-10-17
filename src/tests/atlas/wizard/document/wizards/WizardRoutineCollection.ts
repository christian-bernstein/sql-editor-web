import {WizardRoutine} from "../WizardRoutine";
import {noteWizardRoutine} from "./note/NoteWizardRoutine";
import {markdownWizardRoutine} from "./markdown/MarkdownWizardRoutine";

export const wizardRoutines: Array<WizardRoutine> = [
    noteWizardRoutine,
    markdownWizardRoutine
]
