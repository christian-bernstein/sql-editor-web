import {ProjectInfoData} from "../../../../logic/data/ProjectInfoData";
import {Shard} from "../../../../logic/misc/Shard";

export class DBSessionCacheShard extends Shard {

    get currentInfoData(): ProjectInfoData | undefined {
        return this._currentInfoData;
    }

    set currentInfoData(value: ProjectInfoData | undefined) {
        this._currentInfoData = value;
    }

    private _currentInfoData: ProjectInfoData | undefined
}
