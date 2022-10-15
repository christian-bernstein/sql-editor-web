import {WizardRoutine} from "./WizardRoutine";
import {WizardRoutineCard} from "../../../components/documentWizard/WizardRoutineCard";
import React from "react";
import {Button} from "../../../../../components/lo/Button";
import {DocumentSetupDialog} from "../../../components/DocumentSetupDialog";
import {AtlasDocument} from "../../../data/AtlasDocument";
import {AtlasMain} from "../../../AtlasMain";

export const noteWizardRoutine: WizardRoutine = {
    title: "Create note",
    description: "Create empty note",
    tags: ["Note", "Blank"],
    previewCard: (onSelectCallback) => (
        <WizardRoutineCard
            title={"Create note"}
            description={"Create empty note"}
            tooltip={"Create empty note"}
            onSelect={() => onSelectCallback()}
        />
    ),
    run: (view, currentFolder, component) => {
        component.dialog(
            <DocumentSetupDialog
                category={{
                    id: "",
                    documents: []
                }}
                actions={{
                    onSubmit: (document: AtlasDocument) => {
                        const folder = view.getCurrentFolder();
                        try {
                            AtlasMain.atlas().api().createDocumentInFolder(folder.id, document);
                            setTimeout(() => {
                                AtlasMain.atlas(atlas => {
                                    atlas.rerender("folders");
                                });
                            }, 1);
                            component.closeLocalDialog();
                            view.closeLocalDialog();
                            view.reloadFolderView();
                            return true;
                        } catch (e) {
                            return false;
                        }
                    }
                }}
            />
        );
    }
}
