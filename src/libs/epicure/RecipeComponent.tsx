import {BernieComponent} from "../../logic/BernieComponent";
import {Recipe} from "./Recipe";
import {Themeable} from "../../logic/style/Themeable";
import {Assembly} from "../../logic/assembly/Assembly";
import {Box} from "../../components/lo/Box";
import {Text, TextType} from "../../components/lo/Text";
import React from "react";
import {percent} from "../../logic/style/DimensionalMeasured";
import {Separator} from "../../components/lo/Separator";
import {FlexBox} from "../../components/lo/FlexBox";
import {FlexDirection} from "../../logic/style/FlexDirection";
import {Justify} from "../../logic/style/Justify";

export type RecipeComponentProps = {
    recipe: Recipe
}

export class RecipeComponent extends BernieComponent<RecipeComponentProps, any, any> {
    componentRender(p: RecipeComponentProps, s: any, l: any, t: Themeable.Theme, a: Assembly): JSX.Element | undefined {
        return (
            <Box width={percent(100)}>
                <Text text={p.recipe.title} type={TextType.smallHeader}/>
                <Separator/>
                <Text text={p.recipe.description}/>

                <FlexBox flexDir={FlexDirection.ROW} justifyContent={Justify.SPACE_BETWEEN}>
                    <Text text={`**${p.recipe.kcal}** kcal`}/>
                    <Text text={`**${p.recipe.cookingTimeInMin}** min`}/>
                </FlexBox>
            </Box>
        );
    }
}
