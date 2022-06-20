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
import {ReactComponent as SourceIcon} from "../../../assets/icons/ic-20/ic20-link.svg";
import {Icon} from "../../../components/lo/Icon";
import {FlexBox} from "../../../components/lo/FlexBox";
import {LiteGrid} from "../../../components/lo/LiteGrid";
import {ObjectVisualMeaning} from "../../../logic/style/ObjectVisualMeaning";
import {Align} from "../../../logic/style/Align";
import {FlexDirection} from "../../../logic/style/FlexDirection";
import {Button} from "../../../components/lo/Button";
import {RecipeCtxAction} from "../RecipeCtxAction";
import {ContextCompound} from "../../../components/ho/contextCompound/ContextCompound";
import {ContextMenuElement} from "../../../components/lo/ContextMenuElement";
import {EpicureAPI} from "../EpicureAPI";
import {Badge} from "../../../components/lo/Badge";
import Source, {MagazineSourceData} from "../Source";
import {Map} from "../../../components/logic/Map";
import {SideScroller} from "../../../components/layout/SideScroller";
import {Rating} from "@mui/material";
import {OverflowBehaviour} from "../../../logic/style/OverflowBehaviour";

export type RecipeCardCtx = {
    onOpen: RecipeCtxAction<undefined>,
    onDelete: RecipeCtxAction<undefined>,
}

export type RecipeCardProps = {
    recipe: Recipe,
    ctx: RecipeCardCtx
}

export class RecipeCard extends BernieComponent<RecipeCardProps, any, any> {

    componentRender(p: RecipeCardProps, s: any, l: any, t: Themeable.Theme, a: Assembly): JSX.Element | undefined {
        const api = EpicureAPI.api();
        const session = api.loadRecipeSession(p.recipe.id);

        return (
            <Box width={percent(100)} children={
                <FlexBox width={percent(100)}>
                    <ElementHeader boldHeader title={p.recipe.title} appendix={

                        <FlexBox flexDir={FlexDirection.ROW} align={Align.CENTER} overflowXBehaviour={OverflowBehaviour.SCROLL}>
                            <Rating
                                defaultValue={session.rating}
                                onChange={(event, value) => {
                                    const ls = api.loadRecipeSession(p.recipe.id);
                                    ls.rating = value === null ? undefined : value;
                                    api.saveRecipeSession(p.recipe.id, ls);
                                }}
                            />

                            <ContextCompound menu={
                                <FlexBox gap={px(1)}>
                                    <ContextMenuElement title={"Clear session data"} titleAppendix={() => Badge.beta()} onClick={() => {
                                        api.removeRecipeSession(p.recipe.id);
                                    }} icon={() => <Icon icon={<DeleteIcon/>}/>}/>
                                    <ContextMenuElement visualMeaning={ObjectVisualMeaning.ERROR} title={"Delete recipe"} onClick={() => {
                                        api.deleteRecipe(p.recipe.id);
                                        p.ctx.onDelete.on(p.recipe);
                                    }} icon={() => <Icon icon={<DeleteIcon/>}/>}/>
                                </FlexBox>
                            } children={
                                <Icon icon={<ContextIcon/>}/>
                            }/>
                        </FlexBox>






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

                    {
                        p.recipe.source === undefined ? <></> : (
                            () => {
                                const source = p.recipe.source as Source;
                                const data = source.data as MagazineSourceData;
                                return (
                                    <Box opaque visualMeaning={ObjectVisualMeaning.UI_NO_HIGHLIGHT} width={percent(100)} children={
                                        <FlexBox width={percent(100)} gap={t.gaps.smallGab} align={Align.CENTER} flexDir={FlexDirection.ROW}>
                                            <Icon icon={<SourceIcon/>}/>
                                            <Text text={""} delimiter={", "} texts={[
                                                `**Publisher:** ${data.title}`,
                                                `**Magazine:** ${data.month} ${data.year}`,
                                                `**Page:** ${data.page}`,
                                            ]}/>
                                        </FlexBox>
                                    }/>
                                );
                            }
                        )()
                    }

                    <Map<string> data={p.recipe.categories} wrapper={props => <SideScroller useMouseDragging {...props}/>} renderer={(item) => (
                        <Button highlight={false} children={
                            <Text text={item}/>
                        }/>
                    )}/>

                    <Button visualMeaning={ObjectVisualMeaning.UI_NO_HIGHLIGHT} opaque width={percent(100)} onClick={() => p.ctx.onOpen.on(p.recipe)} children={
                        <Text text={"Show recipe"}/>
                    }/>
                </FlexBox>
            }/>
        );
    }

}
