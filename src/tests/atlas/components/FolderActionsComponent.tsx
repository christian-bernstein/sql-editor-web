import {BC} from "../../../logic/BernieComponent";
import {Folder} from "../data/Folder";
import {Themeable} from "../../../logic/style/Themeable";
import {Assembly} from "../../../logic/assembly/Assembly";
import {StaticDrawerMenu} from "../../../components/lo/StaticDrawerMenu";
import {Flex} from "../../../components/lo/FlexBox";
import {DrawerHeader} from "../../../components/lo/DrawerHeader";
import {VM} from "../../../logic/style/ObjectVisualMeaning";
import {createMargin} from "../../../logic/style/Margin";
import React from "react";
import {SettingsGroup} from "../../../components/lo/SettingsGroup";
import {SettingsElement} from "../../../components/ho/settingsElement/SettingsElement";
import {FolderAction} from "../data/FolderAction";
import {IAtlasAPI} from "../api/IAtlasAPI";
import {AtlasMain} from "../AtlasMain";

export type FolderActionsComponentProps = {
    data: Folder,
    caller: BC<any, any, any>
}

export class FolderActionsComponent extends BC<FolderActionsComponentProps, any, any> {

    private actions: Map<string, FolderAction<FolderActionsComponent>> = new Map<string, FolderAction<FolderActionsComponent>>([
        ["delete", {
            execute(api: IAtlasAPI, atlas: AtlasMain, folder: Folder, controller: FolderActionsComponent): Promise<void> {
                return new Promise<void>((resolve, reject) => {
                    if (api.deleteFolder(folder.id)) {
                        resolve();
                        setTimeout(() => {
                            atlas.rerender("folders");
                            controller.closeLocalDialog();
                        }, 1);
                    } else {
                        reject("IAtlasAPI: cannot delete folder");
                    }
                });
            }
        }]
    ]);

    private executeAction(action: string): Promise<void> {
        const act = this.actions.get(action);
        if (act !== undefined) {
            return act?.execute(AtlasMain.atlas().api(), AtlasMain.atlas(), this.props.data, this);
        } else {
            throw new Error(`Action '${action}' cannot be found`);
        }
    }

    componentRender(p: FolderActionsComponentProps, s: any, l: any, t: Themeable.Theme, a: Assembly): JSX.Element | undefined {
        return (
            <StaticDrawerMenu body={props => (
                <Flex fw elements={[
                    <DrawerHeader
                        header={`Actions`}
                        enableBadge
                        badgeVM={VM.UI_NO_HIGHLIGHT}
                        badgeText={"Actions"}
                        description={"Actions.."}
                        margin={createMargin(0, 0, 40, 0)}
                    />,

                    <SettingsGroup title={"Available actions"} elements={[
                        <SettingsElement title={"Delete folder"} promiseBasedOnClick={element => this.executeAction("delete")}/>
                    ]}/>
                ]}/>
            )}/>
        );
    }
}
