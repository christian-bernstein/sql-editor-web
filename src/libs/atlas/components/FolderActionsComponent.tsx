import {BC} from "../../sql/logic/BernieComponent";
import {Folder} from "../data/Folder";
import {Themeable} from "../../sql/logic/style/Themeable";
import {Assembly} from "../../sql/logic/assembly/Assembly";
import {StaticDrawerMenu} from "../../sql/components/lo/StaticDrawerMenu";
import {Flex} from "../../sql/components/lo/FlexBox";
import {DrawerHeader} from "../../sql/components/lo/DrawerHeader";
import {VM} from "../../sql/logic/style/ObjectVisualMeaning";
import {createMargin} from "../../sql/logic/style/Margin";
import React from "react";
import {SettingsGroup} from "../../sql/components/lo/SettingsGroup";
import {SettingsElement} from "../../sql/components/ho/settingsElement/SettingsElement";
import {FolderAction} from "../data/FolderAction";
import {IAtlasAPI} from "../api/IAtlasAPI";
import {AtlasMain} from "../AtlasMain";
import {CategorySetupDialog} from "./CategorySetupDialog";
import {FolderEditDialog} from "./FolderEditDialog";

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
        }],
        ["create-category", {
            execute(api: IAtlasAPI, atlas: AtlasMain, folder: Folder, controller: FolderActionsComponent): Promise<void> {
                return new Promise<void>((resolve, reject) => {
                    controller.dialog(
                        <CategorySetupDialog folder={folder} actions={{
                            onCancel() {
                                controller.closeLocalDialog();
                            },
                            onSubmit: category => {
                                const success = AtlasMain.atlas().api().createCategory(category);
                                if (success) {
                                    AtlasMain.atlas().api().linkCategoryToFolder(category.id, folder.id);
                                    resolve();
                                } else {
                                    reject();
                                }
                                setTimeout(() => {
                                    controller.closeLocalDialog();
                                    controller.props.caller.rerender("categories");
                                }, 1);
                                return success;
                            }
                        }}/>
                    );
                })
            }
        }],
        ["edit", {
            execute(api: IAtlasAPI, atlas: AtlasMain, folder: Folder, controller: FolderActionsComponent): Promise<void> {
                return new Promise<void>((resolve, reject) => {
                    try {
                        controller.dialog(
                            <FolderEditDialog
                                folder={folder}
                                actions={{
                                    onSubmit(edited: Folder) {
                                        api.updateFolder(folder.id, original => {
                                            return ({
                                                ...original,
                                                ...edited
                                            })
                                        });
                                        controller.closeLocalDialog();
                                        controller.props.caller.closeLocalDialog();
                                        controller.props.caller.rerender("body");
                                        atlas.rerender("folders");
                                        resolve();
                                    },
                                    onCancel() {
                                        controller.closeLocalDialog();
                                        resolve();
                                    }
                                }}
                            />
                        );
                    } catch (e) {
                        reject(e);
                    }
                })
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
                        header={`Actions for *${p.data.title}*`}
                        enableBadge
                        badgeVM={VM.UI_NO_HIGHLIGHT}
                        badgeText={"Actions"}
                        description={`Available action for folder *${p.data.title}*.`}
                    />,

                    <SettingsGroup title={"Available actions"} elements={[
                        <SettingsElement groupDisplayMode title={"Create category"} promiseBasedOnClick={element => this.executeAction("create-category")}/>,
                        <SettingsElement groupDisplayMode title={"Edit folder"} promiseBasedOnClick={element => this.executeAction("edit")}/>,
                        <SettingsElement groupDisplayMode title={"Delete folder"} promiseBasedOnClick={element => this.executeAction("delete")}/>,
                    ]}/>
                ]}/>
            )}/>
        );
    }
}
