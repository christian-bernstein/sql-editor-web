import {BernieComponent} from "../../../logic/BernieComponent";
import {Assembly} from "../../../logic/assembly/Assembly";
import {Themeable} from "../../../logic/style/Themeable";
import {Box} from "../../../components/lo/Box";
import {Text, TextType} from "../../../components/lo/Text";
import {percent, px} from "../../../logic/style/DimensionalMeasured";
import {Recipe} from "../Recipe";
import {ElementHeader} from "../../../components/lo/ElementHeader";
import {ReactComponent as ContextIcon} from "../../../assets/icons/ic-20/ic20-more-ver.svg";
import {ReactComponent as DeleteIcon} from "../../../assets/icons/ic-20/ic20-delete.svg";
import {Icon} from "../../../components/lo/Icon";
import {FlexBox} from "../../../components/lo/FlexBox";
import {LiteGrid} from "../../../components/lo/LiteGrid";
import {ObjectVisualMeaning} from "../../../logic/style/ObjectVisualMeaning";
import {Align} from "../../../logic/style/Align";
import {FlexDirection} from "../../../logic/style/FlexDirection";
import {OverflowBehaviour} from "../../../logic/style/OverflowBehaviour";
import {Button} from "../../../components/lo/Button";
import {RecipeCtxAction} from "../RecipeCtxAction";
import {ContextCompound} from "../../../components/ho/contextCompound/ContextCompound";
import {ContextMenuElement} from "../../../components/lo/ContextMenuElement";
import {EpicureAPI} from "../EpicureAPI";
import {Badge} from "../../../components/lo/Badge";

export type RecipeCardCtx = {
    onOpen: RecipeCtxAction<undefined>,
    onDelete: RecipeCtxAction<undefined>,
}

export type RecipeCardProps = {
    recipe: Recipe,
    ctx: RecipeCardCtx
}

export class RecipeCard extends BernieComponent<RecipeCardProps, any, any> {

    /**
     * #014034
     * #02735E
     * #038C73
     */
    componentRender(p: RecipeCardProps, s: any, l: any, t: Themeable.Theme, a: Assembly): JSX.Element | undefined {
        return (
            <Box width={percent(100)} children={
                <FlexBox width={percent(100)}>
                    <ElementHeader boldHeader title={p.recipe.title} appendix={
                        <ContextCompound menu={
                            <FlexBox gap={px(1)}>
                                <ContextMenuElement title={"Clear session data"} titleAppendix={() => Badge.beta()} onClick={() => {
                                    EpicureAPI.api().removeRecipeSession(p.recipe.id);
                                }} icon={() => <Icon icon={<DeleteIcon/>}/>}/>
                                <ContextMenuElement visualMeaning={ObjectVisualMeaning.ERROR} title={"Delete recipe"} onClick={() => {
                                    EpicureAPI.api().deleteRecipe(p.recipe.id);
                                    p.ctx.onDelete.on(p.recipe);
                                }} icon={() => <Icon icon={<DeleteIcon/>}/>}/>
                            </FlexBox>
                        } children={
                            <Icon icon={<ContextIcon/>}/>
                        }/>
                    }/>
                    <Text text={p.recipe.description}/>
                    <LiteGrid columns={3} gap={t.gaps.defaultGab}>
                        <Box opaque visualMeaning={ObjectVisualMeaning.INFO} children={
                            <FlexBox align={Align.CENTER} gap={t.gaps.smallGab}>
                                <Text text={String(p.recipe.kcal)} type={TextType.smallHeader}/>
                                <Text text={"kcal"}/>
                            </FlexBox>
                        }/>
                        <Box opaque visualMeaning={ObjectVisualMeaning.INFO} children={
                            <FlexBox align={Align.CENTER} gap={t.gaps.smallGab}>
                                <Text text={String(p.recipe.cookingTimeInMin)} type={TextType.smallHeader}/>
                                <Text text={"min"}/>
                            </FlexBox>
                        }/>
                        <Box opaque visualMeaning={ObjectVisualMeaning.INFO} children={
                            <FlexBox align={Align.CENTER} gap={t.gaps.smallGab}>
                                <Text text={String(p.recipe.kcal)} type={TextType.smallHeader}/>
                                <Text text={"kcal"}/>
                            </FlexBox>
                        }/>
                    </LiteGrid>

                    <FlexBox flexDir={FlexDirection.ROW} width={percent(100)} overflowXBehaviour={OverflowBehaviour.SCROLL}>
                        <FlexBox flexDir={FlexDirection.ROW} align={Align.CENTER} children={
                            p.recipe.categories.map(cat => <Button highlight={false} children={
                                <Text text={cat}/>
                            }/>)
                        }/>
                    </FlexBox>

                    <Button visualMeaning={ObjectVisualMeaning.UI_NO_HIGHLIGHT} opaque width={percent(100)} onClick={() => p.ctx.onOpen.on(p.recipe)} children={
                        <Text text={"Show recipe"}/>
                    }/>
                </FlexBox>
            }/>
        );
    }

}
