import {Shard} from "../../../../logic/misc/Shard";
import {ISettingsAPI} from "../../../../logic/settings/ISettingsAPI";
import {App} from "../../../../logic/app/App";
import {SettingsAPI} from "../../../../logic/settings/SettingsAPI";

export class SettingsShard extends Shard {

    private settingsAPI?: ISettingsAPI;

    load(app: App) {
        super.load(app);
        this.settingsAPI = new SettingsAPI();
    }

    public getAPI(): ISettingsAPI {
        if (this.settingsAPI === undefined) {
            throw new Error("SettingsAPI instance in SettingsShard is undefined, but shouldn't be.");
        }
        return this.settingsAPI;
    }

}
