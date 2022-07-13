import {BernieComponent} from "../../../../logic/BernieComponent";
import {Assembly} from "../../../../logic/assembly/Assembly";
import {getMeaningfulColors, MeaningfulColors, Themeable} from "../../../../logic/style/Themeable";
import {Screen, screenedAndCentered} from "../../../../components/lo/Page";
import {AppHeader} from "../../../../components/lo/AppHeader";
import {FlexBox} from "../../../../components/lo/FlexBox";
import {RecipeCard} from "../../components/RecipeCard";
import {OverflowBehaviour} from "../../../../logic/style/OverflowBehaviour";
import {percent, px} from "../../../../logic/style/DimensionalMeasured";
import {EpicureRecipePage} from "../recipe/EpicureRecipePage";
import {EpicureAPI} from "../../EpicureAPI";
import {utilizeGlobalTheme} from "../../../../logic/app/App";
import {ObjectVisualMeaning} from "../../../../logic/style/ObjectVisualMeaning";
import {Backdrop, SpeedDial, SpeedDialAction, SpeedDialIcon, ThemeProvider} from "@mui/material";
import {ReactComponent as CreateIcon} from "../../../../assets/icons/ic-20/ic20-plus.svg";
import React from "react";
import {EpicureAddPage} from "../add/EpicureAddPage";
import {Text, TextType} from "../../../../components/lo/Text";
import {Map} from "../../../../components/logic/Map";
import {Filter} from "../Filter";
import {Box} from "../../../../components/lo/Box";
import {Icon} from "../../../../components/lo/Icon";
import {FlexDirection} from "../../../../logic/style/FlexDirection";
import {Align} from "../../../../logic/style/Align";
import {SideScroller} from "../../../../components/layout/SideScroller";
import {ReactComponent as CloseIcon} from "../../../../assets/icons/ic-20/ic20-close.svg";
import {ReactComponent as FilterIcon} from "../../../../assets/icons/ic-20/ic20-filter.svg";
import {BadgedWrapper} from "../../../../components/lo/BadgedWrapper";
import {If} from "../../../../components/logic/If";
import {EpicureFilterPage} from "../filter/EpicureFilterPage";
import {Separator} from "../../../../components/lo/Separator";
import {Orientation} from "../../../../logic/style/Orientation";

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
            <ThemeProvider theme={t.muiTheme} children={
                <Screen>
                    {this.renderSpeedDial()}
                    <AppHeader title={"Epicure Hub"} right={
                        this.component(() => {
                            const len = EpicureAPI.api().filters.length;
                            const showBadge = len !== 0;

                            return (
                                <If condition={showBadge} ifTrue={
                                    <BadgedWrapper badge={
                                        <Text text={`${len}`} visualMeaning={ObjectVisualMeaning.INFO} coloredText fontSize={px(10)}/>
                                    } showBadgeInitially={showBadge} children={
                                        <Icon icon={<FilterIcon/>} onClick={() => this.openLocalDialog(() => <EpicureFilterPage onFiltersUpdate={() => this.rerender("filters", "recipes")}/>)}/>
                                    }/>
                                } ifFalse={
                                    <Icon icon={<FilterIcon/>} onClick={() => this.openLocalDialog(() => <EpicureFilterPage onFiltersUpdate={() => this.rerender("filters", "recipes")}/>)}/>
                                }/>
                            );
                        }, "filters")
                    }
                               footer={
                                   this.component(() => (
                                       <Map<Filter<any>> data={EpicureAPI.api().filters} wrapper={props => <SideScroller useMouseDragging {...props}/>} renderer={item => (
                                           <Box>
                                               <FlexBox flexDir={FlexDirection.ROW} align={Align.CENTER}>
                                                   <Text text={item.type} bold whitespace={"nowrap"}/>
                                                   <Text text={item.dataStringRenderer ? item.dataStringRenderer(item.data) : `${item.data}`} whitespace={"nowrap"} type={TextType.secondaryDescription} fontSize={px(12)}/>
                                                   <Icon icon={<CloseIcon/>} onClick={() => {
                                                       EpicureAPI.api().removeFilter(item.id);
                                                       this.rerender("filters", "recipes");
                                                   }}/>
                                               </FlexBox>
                                           </Box>
                                       )}/>
                                   ), "filters")
                               }/>
                    <FlexBox width={percent(100)} overflowYBehaviour={OverflowBehaviour.SCROLL} children={
                        <FlexBox width={percent(100)} children={
                            this.component(() => (
                                <>
                                    {
                                        EpicureAPI.api().loadFilteredRecipes().map(recipe => (
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
            }/>
        );
    }
}
