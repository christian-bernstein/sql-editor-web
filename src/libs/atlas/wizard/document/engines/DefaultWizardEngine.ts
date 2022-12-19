import {IWizardEngine} from "../IWizardEngine";
import {WizardEngineInstruction} from "../WizardEngineInstruction";
import {AtlasDocument} from "../../../data/AtlasDocument";
import {v4} from "uuid";
import {metaWizardSubRoutine} from "../wizards/meta/MetaWizardSubRoutine";
import {AtlasMain} from "../../../AtlasMain";

export class DefaultWizardEngine implements IWizardEngine {

    async run(instruction: WizardEngineInstruction) {
        let document: Partial<AtlasDocument> = {
            ...instruction.documentBase,
            id: v4(),
        };

        if (!(instruction.skipMetaWizard ?? false)) {
            document = {
                ...document,
                ...await metaWizardSubRoutine.run(document, {
                    documentBase: document,
                    component: instruction.component,
                    currentFolder: instruction.currentFolder,
                    mainEngineInstruction: instruction,
                    view: instruction.view
                })
            };
        }

        console.log("after meta wizard", document);

        for (const sub of instruction.subRoutines ?? []) {
            document = {
                ...document,
                ...await sub.run(document, {
                    documentBase: document,
                    component: instruction.component,
                    currentFolder: instruction.currentFolder,
                    mainEngineInstruction: instruction,
                    view: instruction.view
                })
            };


        }

        const finalized = document as AtlasDocument;

        console.log("finalized", document);

        try {
            AtlasMain.atlas().api().createDocumentInFolder(instruction.currentFolder.id, finalized);
            console.log("Created document", finalized, "successfully");
            instruction.onSetupComplete?.(finalized);
        } catch (e) {
            console.error(e);
            console.error("Cannot create document", finalized);
        }
    }
}
