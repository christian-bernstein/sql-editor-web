import {WizardRoutine} from "./WizardRoutine";
import {WizardRoutineCard} from "../../../components/documentWizard/WizardRoutineCard";
import React, {useState} from "react";
import {AtlasMain} from "../../../AtlasMain";
import {StaticDrawerMenu} from "../../../../../components/lo/StaticDrawerMenu";
import {Flex} from "../../../../../components/lo/FlexBox";
import {Input} from "../../../../../components/lo/Input";
import {Button} from "../../../../../components/lo/Button";
import {v4} from "uuid";
import {WebsiteDocumentArchetype} from "../../../data/documentArchetypes/WebsiteDocumentArchetype";
import {AtlasDocument} from "../../../data/AtlasDocument";

export const websiteWizardRoutine: WizardRoutine = {
    title: "Website",
    description: "Save the link of a website & open it in a new tab",
    tags: [],
    previewCard: (onSelectCallback) => (
        <WizardRoutineCard
            title={"Website"}
            description={"Save a website"}
            tooltip={"Save the link of a website & open it in a new tab"}
            onSelect={() => onSelectCallback()}
        />
    ),
    run: (view, currentFolder, component) => {
        return new Promise<AtlasDocument>(async (resolve, reject) => {
            const url = await new Promise<string>((urlResolve, urlReject) => {
                component.dialog(
                    <StaticDrawerMenu body={props => {
                        const Form: React.FC = p => {
                            const [url, setURL] = useState("");

                            return (
                                <Flex elements={[
                                    <Input defaultValue={url} placeholder={"www.google.com"} onChange={ev => {
                                        setURL(ev.target.value);
                                    }}/>,
                                    <Button text={"Choose"} onClick={() => {
                                        urlResolve(url);
                                    }}/>
                                ]}/>
                            );
                        }

                        return <Form/>;
                    }}/>
                )
            });

            resolve({
                id: v4(),
                title: url,
                body: JSON.stringify({
                    url: url
                } as WebsiteDocumentArchetype)
            });
        });
    }
}
