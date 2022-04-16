import {Shard} from "../../logic/misc/Shard";
import {App} from "../../logic/app/App";
import {QuickActionCategory} from "../../logic/data/quick/QuickActionCategory";
import React from "react";
import {DefaultQuickActions} from "../../logic/data/quick/DefaultQuickActions";

export class QuickActionShard extends Shard {

    private _quickActionsCategories?: Array<QuickActionCategory>;

    load(app: App) {
        super.load(app);
        this._quickActionsCategories = new Array<QuickActionCategory>();

        this.addCategory(new QuickActionCategory({
            id: "utilities",
            displayName: "Utilities & debugging"
        }), qac => {
            qac.registerQuickAction(
                DefaultQuickActions.fullscreenQA,
                DefaultQuickActions.logQA,
                DefaultQuickActions.rerenderQA,
                DefaultQuickActions.reloadQA,
            );
        });

        this.addCategory(new QuickActionCategory({
            id: "themes",
            displayName: "Themes"
        }), qac => {
            qac.registerQuickAction(
                DefaultQuickActions.lightThemeQA,
                DefaultQuickActions.darkThemeQA
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
