import {WizardRoutine} from "../../WizardRoutine";
import {WizardRoutineCard} from "../../../../components/documentWizard/WizardRoutineCard";
import {DefaultWizardEngine} from "../../engines/DefaultWizardEngine";
import {WizardSubRoutine} from "../../WizardSubRoutine";
import {AtlasDocument} from "../../../../data/AtlasDocument";
import {DocumentType} from "../../../../data/DocumentType";
import {WebsiteDocumentArchetype} from "../../../../data/documentArchetypes/WebsiteDocumentArchetype";
import React from "react";
import {StaticDrawerMenu} from "../../../../../sql/components/lo/StaticDrawerMenu";
import {FileInput} from "../../../../../sql/components/ho/fileInput/FileInput";
import {FileInputSubmissionMode} from "../../../../../sql/components/ho/fileInput/FileInputSubmissionMode";
import {PDFDocumentArchetype} from "../../../../data/documentArchetypes/PDFDocumentArchetype";

export const pdfWizardRoutine: WizardRoutine = {
    title: "Save PDF",
    description: "Store a pdf document",
    tags: ["Document", "PDF"],
    previewCard: (onSelectCallback) => (
        <WizardRoutineCard
            title={"Save PDF"}
            description={"Save PDF"}
            tooltip={"Save PDF"}
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
            documentBase: {
                icon: {
                    dict: "atlas",
                    id: "pdf-file"
                }
            },
            subRoutines: new Array<WizardSubRoutine>({
                run: (document, context) => {
                    return new Promise<Partial<AtlasDocument>>((resolve, reject) => {
                        context.component.dialog(
                            <StaticDrawerMenu body={() => {
                                return (
                                    <FileInput onSubmit={ctx => {
                                        resolve({
                                            documentType: DocumentType.PDF,
                                            body: JSON.stringify({
                                                dataURL: ctx.dataURL ?? ""
                                            } as PDFDocumentArchetype)
                                        });
                                    }}/>
                                );
                            }}/>
                        );
                    });
                }
            })
        });
    }
}
