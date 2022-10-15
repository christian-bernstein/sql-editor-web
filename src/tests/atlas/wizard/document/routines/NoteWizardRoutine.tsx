import {WizardRoutine} from "./WizardRoutine";
import {WizardRoutineCard} from "../../../components/documentWizard/WizardRoutineCard";
import React from "react";
import {Button} from "../../../../../components/lo/Button";

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
    run: component => {
        component.dialog(
            <Button text={"Hello world"} onClick={() => component.closeLocalDialog()}/>
        );
    }
}
