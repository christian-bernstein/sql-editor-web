import {Shard} from "../logic/Shard";
import {App} from "../logic/App";
import {QuickActionCategory} from "../logic/data/quick/QuickActionCategory";
import {Themeable} from "../Themeable";
import {QuickActionPanel} from "../components/ho/quickPanel/QuickActionPanel";
import {Text} from "../components/Text";
import React from "react";
import {ObjectVisualMeaning} from "../logic/ObjectVisualMeaning";

export class QuickActionShard extends Shard {

    private _quickActionsCategories?: Array<QuickActionCategory>;

    load(app: App) {
        super.load(app);
        this._quickActionsCategories = new Array<QuickActionCategory>();

        this.addCategory(new QuickActionCategory({
            id: "debug",
            displayName: "Debug category"
        }), qac => {
            qac.registerQuickAction({
                beta: true,
                tags: ["Debug"],
                description: "Debug action",
                displayName: "Debug",
                wrapInDefaultButton: true,
                render(theme: Themeable.Theme, panel: QuickActionPanel, config): JSX.Element {
                    return <Text text={"D!"}/>;
                }
            })

            qac.registerQuickAction({
                beta: false,
                tags: ["Debug"],
                description: "Debug action",
                displayName: "Debug",
                wrapInDefaultButton: true,
                visualMeaning: ObjectVisualMeaning.INFO,
                wrapperStyleOverwrite: {
                    gridColumnStart: "span 2"
                },
                render(theme: Themeable.Theme, panel: QuickActionPanel, config): JSX.Element {
                    return <Text text={"HI!"}/>
                }
            })
        })
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
