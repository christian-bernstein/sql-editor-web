import {WizardRoutine} from "../../WizardRoutine";
import {WizardRoutineCard} from "../../../../components/documentWizard/WizardRoutineCard";
import {DefaultWizardEngine} from "../../engines/DefaultWizardEngine";
import React from "react";
import {WizardSubRoutine} from "../../WizardSubRoutine";
import {AtlasDocument} from "../../../../data/AtlasDocument";
import {DocumentType} from "../../../../data/DocumentType";
import {MarkdownDocumentArchetype} from "../../../../data/documentArchetypes/MarkdownDocumentArchetype";

export const markdownWizardRoutine: WizardRoutine = {
    title: "Create markdown file",
    description: "Create markdown file",
    tags: ["Markdown", "MD"],
    previewCard: (onSelectCallback) => (
        <WizardRoutineCard
            title={"Create markdown file"}
            description={"Create markdown file"}
            tooltip={"Create markdown file"}
            onSelect={() => onSelectCallback()}
        />
    ),
    run: (view, currentFolder, component, onSetupComplete) => {
        return new DefaultWizardEngine().run({
            view: view,
            component: component,
            currentFolder: currentFolder,
            onSetupComplete: onSetupComplete,
            wizardEngineID: "default",
            subRoutines: new Array<WizardSubRoutine>({
                run: (document, context) => {
                    return new Promise<Partial<AtlasDocument>>((resolve, reject) => {
                        resolve({
                            documentType: DocumentType.MARKDOWN,
                            body: JSON.stringify({
                                source: ""
                            } as MarkdownDocumentArchetype)
                        });
                    })
                }
            })
        });
    }
}
