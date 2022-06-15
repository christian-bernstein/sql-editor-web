import {BernieComponent} from "../../../../logic/BernieComponent";
import {Assembly} from "../../../../logic/assembly/Assembly";
import {getMeaningfulColors, MeaningfulColors, Themeable} from "../../../../logic/style/Themeable";
import {Screen, screenedAndCentered} from "../../../../components/lo/Page";
import {AppHeader} from "../../../../components/lo/AppHeader";
import {FlexBox} from "../../../../components/lo/FlexBox";
import {RecipeCard} from "../../components/RecipeCard";
import {OverflowBehaviour} from "../../../../logic/style/OverflowBehaviour";
import {percent} from "../../../../logic/style/DimensionalMeasured";
import {UnitOfMeasure} from "../../UnitOfMeasure";
import {Recipe} from "../../Recipe";
import {EpicureRecipePage} from "../recipe/EpicureRecipePage";
import {EpicureAPI} from "../../EpicureAPI";
import {utilizeGlobalTheme} from "../../../../logic/app/App";
import {ObjectVisualMeaning} from "../../../../logic/style/ObjectVisualMeaning";
import {Backdrop, SpeedDial, SpeedDialAction, SpeedDialIcon} from "@mui/material";
import {ReactComponent as CreateIcon} from "../../../../assets/icons/ic-20/ic20-plus.svg";
import React from "react";
import {EpicureAddPage} from "../add/EpicureAddPage";

export type EpicureHubPageLocalState = {
    speedDialOpen: boolean
}

export class EpicureHubPage extends BernieComponent<any, any, EpicureHubPageLocalState> {

    constructor() {
        super(undefined, undefined, {
            speedDialOpen: false
        }, {
            enableLocalDialog: true
        });
    }

    init() {
        super.init();
        EpicureAPI.api(() => new EpicureAPI());
    }

    private toggleSpeedDial(open: boolean) {
        this.local.setStateWithChannels({
            speedDialOpen: open
        }, ["dial"])
    }

    private renderSpeedDial(): JSX.Element {
        const theme: Themeable.Theme = utilizeGlobalTheme();
        const infoVM: MeaningfulColors = getMeaningfulColors(ObjectVisualMeaning.INFO, theme);

        return this.component(() => (
            <>
                <Backdrop open={this.local.state.speedDialOpen} style={{
                    zIndex: 1000
                }}/>
                <SpeedDial
                    ariaLabel="SpeedDial tooltip example"
                    sx={{
                        ['& .MuiButtonBase-root']: {
                            borderRadius: theme.radii.defaultObjectRadius.css(),
                            borderWidth: "1px",
                            borderStyle: "solid",
                            borderColor: theme.colors.borderPrimaryColor.css(),
                            backgroundColor: theme.colors.backgroundHighlightColor.css(),
                        },
                        ['& .MuiSpeedDialAction-staticTooltipLabel']: {
                            backgroundColor: theme.colors.tooltipBackgroundColor.css(),
                            color: theme.colors.tooltipPrimaryFontColor.css(),
                            fontFamily: "OperatorMono !important"
                        },
                        ['& .MuiButtonBase-root:hover']: {
                            backgroundColor: infoVM.main.withAlpha(.2).css(),
                            borderColor: infoVM.lighter.css(),
                            boxShadow: "0 0 0 4px " + infoVM.shadowColor.css()
                        },
                        ['& svg path']: {
                            fill: infoVM.icon.css() + " !important"
                        },
                        zIndex: 1100,
                        position: 'absolute',
                        bottom: 16,
                        right: 16,
                    }}
                    icon={<SpeedDialIcon />}
                    onClose={(event, reason) => this.toggleSpeedDial(false)}
                    onOpen={(event, reason) => this.toggleSpeedDial(true)}
                    open={this.local.state.speedDialOpen}
                >
                    <SpeedDialAction
                        key={"add-new-recipe"}
                        icon={<CreateIcon/>}
                        tooltipTitle={"Add new recipe"}
                        style={{
                            whiteSpace: "nowrap"
                        }}
                        tooltipOpen
                        onClick={event => {
                            this._openLocalDialog(<EpicureAddPage onAdd={() => {
                                this.rerender("recipes");
                                this.closeLocalDialog();
                                this.toggleSpeedDial(false);
                            }}/>);
                        }}
                    />
                </SpeedDial>
            </>
        ), "dial")
    }

    componentRender(p: any, s: any, l: any, t: Themeable.Theme, a: Assembly): JSX.Element | undefined {
        return (
            <Screen>
                {this.renderSpeedDial()}
                <AppHeader title={"Epicure Hub"}/>
                <FlexBox width={percent(100)} overflowYBehaviour={OverflowBehaviour.SCROLL} children={
                    <FlexBox width={percent(100)} children={
                        this.component(() => (
                            <>
                                {
                                    EpicureAPI.api().loadAllRecipes().map(recipe => (
                                        <RecipeCard recipe={recipe} ctx={{
                                            onOpen: {
                                                on: (recipe, param) => {
                                                    this._openLocalDialog(screenedAndCentered(<EpicureRecipePage recipe={recipe}/>));
                                                }
                                            },
                                            onDelete: {
                                                on: recipe => {
                                                    this.rerender("recipes");
                                                }
                                            }
                                        }}/>
                                    ))
                                }
                            </>
                        ), "recipes")}
                    />
                }/>
            </Screen>
        );
    }
}
