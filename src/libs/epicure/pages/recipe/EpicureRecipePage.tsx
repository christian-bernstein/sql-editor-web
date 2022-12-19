import {BernieComponent} from "../../../sql/logic/BernieComponent";
import {Recipe} from "../../Recipe";
import {Assembly} from "../../../sql/logic/assembly/Assembly";
import {Themeable} from "../../../sql/logic/style/Themeable";
import {percent, px} from "../../../sql/logic/style/DimensionalMeasured";
import {ElementHeader} from "../../../sql/components/lo/ElementHeader";
import {Text, TextType} from "../../../sql/components/lo/Text";
import {LiteGrid} from "../../../sql/components/lo/LiteGrid";
import {Box} from "../../../sql/components/lo/Box";
import {ObjectVisualMeaning} from "../../../sql/logic/style/ObjectVisualMeaning";
import {ReactComponent as ResetIcon} from "../../../../assets/icons/ic-20/ic20-refresh.svg";
import {FlexBox} from "../../../sql/components/lo/FlexBox";
import {Align} from "../../../sql/logic/style/Align";
import {FlexDirection} from "../../../sql/logic/style/FlexDirection";
import {OverflowBehaviour} from "../../../sql/logic/style/OverflowBehaviour";
import {Button} from "../../../sql/components/lo/Button";
import {Screen} from "../../../sql/components/lo/Page";
import {AppHeader} from "../../../sql/components/lo/AppHeader";
import {Step as MUIStep, StepContent, StepLabel, Stepper} from "@mui/material";
import {EpicureAPI} from "../../EpicureAPI";
import {RecipeSession} from "../../RecipeSession";
import {Icon} from "../../../sql/components/lo/Icon";
import {Step} from "../../Step";
import {Switch} from "../../../sql/components/lo/Switch";
import {Justify} from "../../../sql/logic/style/Justify";
import {Cursor} from "../../../sql/logic/style/Cursor";

export type EpicureRecipePageProps = {
    recipe: Recipe
}

export class EpicureRecipePage extends BernieComponent<EpicureRecipePageProps, any, any> {

    private gotoStep(session: RecipeSession, delta: 'up' | 'down' | 'first' | 'last') {
        switch (delta) {
            case "up":
                session.currentStep = session.currentStep + 1;
                break;
            case "down":
                session.currentStep = session.currentStep - 1;
                break;
            case "first":
                session.currentStep = 0;
                break;
            case "last":
                session.currentStep = Math.max(this.props.recipe.steps.length - 1, 0);
                break;
        }
        EpicureAPI.api().saveRecipeSession(this.props.recipe.id, session);
        this.rerender("steps");
    }

    private gotoStepByIndex(session: RecipeSession, index: number) {
        session.currentStep = index;
        EpicureAPI.api().saveRecipeSession(this.props.recipe.id, session);
        this.rerender("steps");
    }

    private renderStep(step: Step, index: number, session: RecipeSession): JSX.Element {
        return (
            <MUIStep key={String(index)}>
                <StepLabel optional={
                    step.optional ? (
                        <Text fontSize={px(11)} text={"optional"} uppercase visualMeaning={ObjectVisualMeaning.WARNING} coloredText/>
                    ) : (
                        <></>
                    )
                } children={
                    <Text bold fontSize={px(13)} text={step.title} onClick={() => this.gotoStepByIndex(session, index)} cursor={Cursor.pointer}/>
                }/>
                <StepContent children={
                    <FlexBox width={percent(100)}>
                        {/*<Image src={"https://cdn.dribbble.com/users/2447331/screenshots/14663337/media/5ec967a95c7cdee9abbbe41904e1a798.jpg?compress=1&resize=1600x1200&vertical=top"}/>*/}
                        <Text text={step.text}/>
                        <FlexBox width={percent(100)} flexDir={FlexDirection.ROW}>
                            <Button width={percent(50)} visualMeaning={ObjectVisualMeaning.INFO} opaque children={<Text text={"Next"}/>} onClick={() => {
                                this.gotoStep(session, "up");
                            }}/>
                            <Button width={percent(50)} children={<Text text={"Previous"}/>} onClick={() => {
                                this.gotoStep(session, "down");
                            }}/>
                        </FlexBox>
                    </FlexBox>
                }/>
            </MUIStep>
        );
    }

    componentRender(p: EpicureRecipePageProps, s: any, l: any, t: Themeable.Theme, a: Assembly): JSX.Element | undefined {
        const session = EpicureAPI.api().loadRecipeSession(p.recipe.id)
        return (
            <Screen children={
                <FlexBox width={percent(100)} height={percent(100)}>
                    <AppHeader title={p.recipe.title}/>
                    <FlexBox width={percent(100)} height={percent(100)} overflowYBehaviour={OverflowBehaviour.SCROLL}>
                        <FlexBox width={percent(100)}>
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

                            {
                                this.component(() => {
                                    return (
                                        <Box width={percent(100)} children={
                                            <FlexBox width={percent(100)}>
                                                <ElementHeader title={"Ingredients"} boldHeader appendix={
                                                    <Icon icon={<ResetIcon/>} onClick={() => {
                                                        session.ingredientChecked = [];
                                                        EpicureAPI.api().saveRecipeSession(this.props.recipe.id, session);
                                                        this.rerender("ingredients");
                                                    }}/>
                                                }/>
                                                {
                                                    p.recipe.ingredients.map(ingredient => {
                                                        return (
                                                            <Switch checked={EpicureAPI.api().isIngredientChecked(ingredient.name, session.ingredientChecked)} visualMeaning={ObjectVisualMeaning.INFO} children={
                                                                <FlexBox width={percent(100)} flexDir={FlexDirection.ROW} align={Align.CENTER} justifyContent={Justify.SPACE_BETWEEN}>
                                                                    <Text text={ingredient.name}/>
                                                                    <Text fontSize={px(12)} type={TextType.secondaryDescription} text={`${ingredient.unit.measurand} ${ingredient.unit.unit}`}/>
                                                                </FlexBox>
                                                            } onChange={(event, checked) => {
                                                                session.ingredientChecked = EpicureAPI.api().setIngredientChecked(ingredient.name, checked, session.ingredientChecked);
                                                                EpicureAPI.api().saveRecipeSession(this.props.recipe.id, session);
                                                            }}/>
                                                        );
                                                    })
                                                }
                                            </FlexBox>
                                        }/>
                                    );
                                }, "ingredients")
                            }

                            {
                                this.component(() => {
                                    return (
                                        <Box width={percent(100)} children={
                                            <FlexBox width={percent(100)}>
                                                <ElementHeader title={"Steps"} boldHeader appendix={
                                                    <Icon icon={<ResetIcon/>} onClick={() => {
                                                        this.gotoStep(session, "first")
                                                    }}/>
                                                }/>
                                                <Stepper activeStep={session.currentStep} orientation="vertical" sx={{width: "100%"}}>
                                                    {
                                                        p.recipe.steps.map((step, index) => this.renderStep(step, index, session))
                                                    }
                                                </Stepper>
                                            </FlexBox>
                                        }/>
                                    );
                                }, "steps")
                            }
                        </FlexBox>
                    </FlexBox>
                </FlexBox>
            }/>
        );
    }
}
