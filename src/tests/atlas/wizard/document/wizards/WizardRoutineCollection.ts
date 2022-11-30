import {WizardRoutine} from "../WizardRoutine";
import {noteWizardRoutine} from "./note/NoteWizardRoutine";
import {markdownWizardRoutine} from "./markdown/MarkdownWizardRoutine";
import {websiteWizardRoutine} from "./website/WebsiteWizardRoutine";
import {pdfWizardRoutine} from "./pdf/PDFWizardRoutine";

export const wizardRoutines: Array<WizardRoutine> = [
    noteWizardRoutine,
    markdownWizardRoutine,
    websiteWizardRoutine,
    pdfWizardRoutine
]
