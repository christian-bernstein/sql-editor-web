import {EpicureFilterPage} from "../filter/EpicureFilterPage";
import {Text} from "../../../../components/lo/Text";
import {FlexBox} from "../../../../components/lo/FlexBox";
import {FormElement} from "../../components/FormElement";
import {Input} from "../../../../components/lo/Input";
import {SelectElement} from "../../../../components/lo/Select";

export namespace Filters {

    export const filterSetupRenderers: Map<string, (component: EpicureFilterPage) => JSX.Element> = new Map<string, (component: EpicureFilterPage) => JSX.Element>([
        ["Recipe title", component => (
            <FormElement
                title={"Recipe title"}
                id={"recipe-title"}
                description={"Search for the recipes title *(Not case-sensitive)*"}
                inputGenerator={(onChange, value) => (
                    <Input
                        onChange={(ev) => onChange(ev.target.value)}
                        inputMode={"search"}
                        defaultValue={value}
                    />
                )}
                fdh={component.local.state.fdh}
            />
        )],

        ["Minimum calories", component => (
            <FormElement
                title={"Minimum calories"}
                id={"minimum-calories"}
                description={"Specify the minimum calories per portion"}
                inputGenerator={(onChange, value) => (
                    <Input
                        onChange={(ev) => onChange(ev.target.value)}
                        inputMode={"numeric"}
                        type={"number"}
                        defaultValue={value}
                        placeholder={"500"}
                    />
                )}
                fdh={component.local.state.fdh}
            />
        )]
    ])
}

export default Filters;
