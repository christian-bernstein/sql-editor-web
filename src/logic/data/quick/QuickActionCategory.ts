import {QuickActionConfig} from "./QuickActionConfig";
import {QuickActionCategoryConfig} from "./QuickActionCategoryConfig";

export class QuickActionCategory {

    private readonly quickActions: Array<QuickActionConfig> = new Array<QuickActionConfig>();

    private readonly _config: QuickActionCategoryConfig;

    constructor(config: QuickActionCategoryConfig) {
        this._config = config;
    }

    public getQuickActions(sortOutNotVisibleActions: boolean = false): Array<QuickActionConfig> {
        if (sortOutNotVisibleActions) {
            return this.quickActions.filter(qac => {
                if (qac.shouldShow) {
                    return qac.shouldShow();
                } else return true;
            })
        } else return this.quickActions;
    }

    public registerQuickAction(...qa: Array<QuickActionConfig>) {
        this.quickActions.push(...qa);
    }

    get config(): QuickActionCategoryConfig {
        return this._config;
    }
}
