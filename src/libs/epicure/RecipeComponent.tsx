import {BernieComponent} from "../sql/logic/BernieComponent";
import {Recipe} from "./Recipe";
import {Themeable} from "../sql/logic/style/Themeable";
import {Assembly} from "../sql/logic/assembly/Assembly";
import {Box} from "../sql/components/lo/Box";
import {Text, TextType} from "../sql/components/lo/Text";
import React from "react";
import {percent} from "../sql/logic/style/DimensionalMeasured";
import {Separator} from "../sql/components/lo/Separator";
import {FlexBox} from "../sql/components/lo/FlexBox";
import {FlexDirection} from "../sql/logic/style/FlexDirection";
import {Justify} from "../sql/logic/style/Justify";

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
