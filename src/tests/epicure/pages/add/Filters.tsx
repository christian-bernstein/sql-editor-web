import {FormElement} from "../../components/FormElement";
import {Input} from "../../../../components/lo/Input";
import {FilterSetting} from "../../FilterSetting";
import {filter} from "../../EpicureAPI";
import {FlexBox} from "../../../../components/lo/FlexBox";
import {percent} from "../../../../logic/style/DimensionalMeasured";
import {NumberRange} from "../../../../logic/data/NumberRange";

export namespace Filters {

    export const filterSetupRenderers: Map<string, FilterSetting> = new Map<string, FilterSetting>([
        ["Recipe title", {
            setupRenderer: component => {
                return (
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
                )
            },
            filterConvertor: (component, hub) => filter<string>({
                id: "recipe-title",
                data: hub.get("recipe-title"),
                type: "Recipe title",
                filterPreviewRenderer: data => <></>,
                filter: (recipe, filter, api) => {
                    if (filter.data === undefined) {
                        return true;
                    } else {
                        return recipe.title.toLowerCase().includes(`${filter.data.toLowerCase()}`);
                    }
                }
            })
        }],


        ["Minimum calories", {
            setupRenderer: component => (
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
            ),
            filterConvertor: (component, hub) => filter<number>({
                id: "minimum-calories",
                data: hub.get("minimum-calories"),
                type: "Minimum calories",
                filterPreviewRenderer: data => <></>,
                filter: (recipe, filter, api) => {
                    return recipe.kcal >= filter.data;
                }
            })
        }],


        ["Calories", {
            setupRenderer: component => (
                <FlexBox width={percent(100)}>
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
                                placeholder={"350"}
                            />
                        )}
                        fdh={component.local.state.fdh}
                    />

                    <FormElement
                        title={"Maximum calories"}
                        id={"maximum-calories"}
                        description={"Specify the maximum calories per portion"}
                        inputGenerator={(onChange, value) => (
                            <Input
                                onChange={(ev) => onChange(ev.target.value)}
                                inputMode={"numeric"}
                                type={"number"}
                                defaultValue={value}
                                placeholder={"800"}
                            />
                        )}
                        fdh={component.local.state.fdh}
                    />
                </FlexBox>
            ),
            filterConvertor: (component, hub) => filter<NumberRange>({
                id: "calories",
                data: {min: hub.get("minimum-calories"), max: hub.get("maximum-calories")},
                type: "Calories",
                filterPreviewRenderer: data => <></>,
                filter: (recipe, filter, api) => {
                    return recipe.kcal >= filter.data.min && recipe.kcal <= filter.data.max;
                }
            })
        }]
    ]);
}

export default Filters;
