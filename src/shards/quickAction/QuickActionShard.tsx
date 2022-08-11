import {Shard} from "../../logic/misc/Shard";
import {App} from "../../logic/app/App";
import {QuickActionCategory} from "../../logic/data/quick/QuickActionCategory";
import React from "react";
import {DefaultQuickActions} from "../../logic/data/quick/DefaultQuickActions";
import {Themeable} from "../../logic/style/Themeable";
import {QuickActionPanel} from "../../components/ho/quickPanel/QuickActionPanel";
import {QuickActionConfig} from "../../logic/data/quick/QuickActionConfig";
import {If} from "../../components/logic/If";
import {BadgedWrapper} from "../../components/lo/BadgedWrapper";
import {Icon} from "../../components/lo/Icon";
import {ReactComponent as CheckIcon} from "../../assets/icons/ic-20/ic20-check.svg";
import {px} from "../../logic/style/DimensionalMeasured";
import {ObjectVisualMeaning} from "../../logic/style/ObjectVisualMeaning";
import {ReactComponent as DarkThemeIcon} from "../../assets/icons/ic-20/ic20-brightness-low.svg";
import {ReactComponent as LightThemeIcon} from "../../assets/icons/ic-20/ic20-brightness-high.svg";

export class QuickActionShard extends Shard {

    private _quickActionsCategories?: Array<QuickActionCategory>;

    load(app: App) {
        super.load(app);
        this._quickActionsCategories = new Array<QuickActionCategory>();

        this.addCategory(new QuickActionCategory({
            id: "utilities",
            displayName: "Utilities"
        }), qac => {
            qac.registerQuickAction(
                DefaultQuickActions.serverQuickViewQA,
                DefaultQuickActions.fullscreenQA,
                DefaultQuickActions.logQA,
                DefaultQuickActions.clearLogQA,
                DefaultQuickActions.rerenderQA,
                DefaultQuickActions.reloadQA,
                DefaultQuickActions.gotoBoardingPageQA
            );
        });

        this.addCategory(new QuickActionCategory({
            id: "themes",
            displayName: "Themes"
        }), qac => {
            // qac.registerQuickAction(
            //     DefaultQuickActions.lightThemeQA,
            //     DefaultQuickActions.darkThemeQA
            // );

            App.app().config.themes.forEach((theme, name) => {
                qac.registerQuickAction({
                    displayName: `Toggle ${name}-theme`,
                    tags: [name, String(theme.mode), "Theme"],
                    render(theme: Themeable.Theme, panel: QuickActionPanel, config: QuickActionConfig): JSX.Element {

                        const icon = theme.mode === "dark" ? <DarkThemeIcon/> : <LightThemeIcon/>;

                        return (
                            <If condition={App.app().globalThemeName === name} ifTrue={
                                <BadgedWrapper badge={
                                    <Icon icon={<CheckIcon/>} size={px(12)} colored visualMeaning={ObjectVisualMeaning.INFO}/>
                                } showBadgeInitially>
                                    <Icon icon={icon}/>
                                </BadgedWrapper>
                            } ifFalse={
                                <Icon icon={icon}/>
                            }/>
                        );
                    },
                    onClick: (event, config) => {
                        App.app().setGlobalTheme(name);
                        App.app().rerenderGlobally();
                    }
                })
            })
        });

        this.addCategory(new QuickActionCategory({
            id: "development",
            displayName: "Development"
        }), qac => {
            qac.registerQuickAction(
                DefaultQuickActions.appModeSwitcherQA,
            );
        });
    }

    public addCategory(category: QuickActionCategory, initHandler?: (qac: QuickActionCategory) => void) {
        if (this._quickActionsCategories?.push(category)) {
            initHandler?.(category);
        }
    }

    public useCategory(id: String, action: (qac: QuickActionCategory) => void): void {
        const filter = this._quickActionsCategories?.filter(qac => qac.config.id === id);
        if (filter != undefined && filter.length === 1) {
            action(filter[0]);
        }
    }

    get quickActionsCategories(): Array<QuickActionCategory> | undefined {
        return this._quickActionsCategories;
    }
}
