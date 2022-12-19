import {BernieComponent} from "../../logic/BernieComponent";
import {Assembly} from "../../logic/assembly/Assembly";
import {Themeable} from "../../logic/style/Themeable";
import {Recipe} from "./Recipe";
import {UnitOfMeasure} from "./UnitOfMeasure";
import {Screen} from "../../components/lo/Page";
import React from "react";
import {AppHeader} from "../../components/lo/AppHeader";
import {Input} from "../../components/lo/Input";
import {FlexBox} from "../../components/lo/FlexBox";
import {FlexDirection} from "../../logic/style/FlexDirection";
import {percent} from "../../logic/style/DimensionalMeasured";
import {OverflowBehaviour} from "../../logic/style/OverflowBehaviour";
import {RecipeComponent} from "./RecipeComponent";
import {arrayFactory} from "../../logic/Utils";

export type EpicureSearchPageLocalState = {
    recipes: Recipe[]
}

export class EpicureSearchPage extends BernieComponent<any, any, EpicureSearchPageLocalState> {

    constructor() {
        super(undefined, undefined, {
            recipes: arrayFactory(i => {
                return {
                    id: "asd",
                    steps: [],
                    title: "Gebratene Nudeln auf tailändische Art",
                    cookingTimeInMin: 60,
                    categories: ["asiatisch"],
                    kcal: 570,
                    description: "Diese leckeren Nudeln sind nach tailändischer Art gekocht und das Leibgericht von Christian. Das Gericht kann ",
                    comment: "Sehr leckeres ",
                    ingredients: [{
                        name: "Morcheln",
                        unit: UnitOfMeasure.amount(8)
                    }]
                }
            }, 10)
        });
    }

    componentRender(p: any, s: any, l: any, t: Themeable.Theme, a: Assembly): JSX.Element | undefined {
        return (
            <Screen>
                <AppHeader title={"Recipes"}/>
                <Input label={"Search"}/>
                <FlexBox flexDir={FlexDirection.COLUMN} height={percent(100)} overflowYBehaviour={OverflowBehaviour.SCROLL}>
                    {this.local.state.recipes.map(recipe => <RecipeComponent recipe={recipe}/>)}
                </FlexBox>
            </Screen>
        );
    }
}
