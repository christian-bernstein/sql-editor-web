import {WizardRoutine} from "../WizardRoutine";
import {noteWizardRoutine} from "./note/NoteWizardRoutine";
import {markdownWizardRoutine} from "./markdown/MarkdownWizardRoutine";
import {websiteWizardRoutine} from "./website/WebsiteWizardRoutine";

export const wizardRoutines: Array<WizardRoutine> = [
    noteWizardRoutine,
    markdownWizardRoutine,
    websiteWizardRoutine
]
