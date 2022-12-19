import {Folder} from "./Folder";
import {IAtlasAPI} from "../api/IAtlasAPI";
import {AtlasMain} from "../AtlasMain";

export interface FolderAction<Controller> {
    execute(
        api: IAtlasAPI,
        atlas: AtlasMain,
        folder: Folder,
        controller: Controller
    ): Promise<void>;
}
