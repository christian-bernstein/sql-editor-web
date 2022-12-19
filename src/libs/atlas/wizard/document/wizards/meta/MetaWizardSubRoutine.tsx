import {WizardSubRoutine} from "../../WizardSubRoutine";
import {AtlasDocument} from "../../../../data/AtlasDocument";
import {StaticDrawerMenu} from "../../../../../../components/lo/StaticDrawerMenu";
import {DocumentSetupDialog} from "../../../../components/DocumentSetupDialog";
import React from "react";

export const metaWizardSubRoutine: WizardSubRoutine = {
    run: (document, context) => {
        return new Promise<Partial<AtlasDocument>>((resolve, reject) => {
            context.component.dialog(
                <StaticDrawerMenu body={() => (
                    <DocumentSetupDialog

                        // TODO remove
                        category={{ id: "", documents: [] }}

                        actions={{
                            onSubmit: (document: AtlasDocument) => {
                                try {
                                    resolve(document);
                                    return true;
                                } catch (e) {
                                    reject();
                                    return false;
                                }
                            }
                        }}
                    />
                )}/>
            );
        })
    }
}
