import {BC} from "../../logic/BernieComponent";
import {Assembly} from "../../logic/assembly/Assembly";
import {Themeable} from "../../logic/style/Themeable";
import {Screen} from "../../components/lo/Page";
import {Flex} from "../../components/lo/FlexBox";
import {Align} from "../../logic/style/Align";
import {DrawerHeader} from "../../components/lo/DrawerHeader";
import {VM} from "../../logic/style/ObjectVisualMeaning";
import {SettingsGroup} from "../../components/lo/SettingsGroup";
import {IAtlasAPI} from "./api/IAtlasAPI";
import {FolderComponent} from "./components/FolderComponent";
import {FolderPreviewComponent} from "./components/FolderPreviewComponent";
import {Button} from "../../components/lo/Button";
import {percent, px} from "../../logic/style/DimensionalMeasured";
import {FolderSetupDialog} from "./components/FolderSetupDialog";
import {Folder} from "./data/Folder";

export type AtlasMainProps = {
    api: IAtlasAPI
}

export class AtlasMain extends BC<AtlasMainProps, any, any> {

    private static atlasInstance: AtlasMain | undefined = undefined;

    public static atlas(consumer?: (atlas: AtlasMain) => void): AtlasMain {
        consumer?.(this.atlasInstance as AtlasMain);
        return this.atlasInstance as AtlasMain;
    }

    init() {
        super.init();
        this.folderAssembly();
    }

    public api(): IAtlasAPI {
        return this.props.api;
    }

    componentDidMount() {
        super.componentDidMount();
        AtlasMain.atlasInstance = this;
    }

    componentWillUnmount() {
        super.componentWillUnmount();
        AtlasMain.atlasInstance = undefined;
    }

    private folderAssembly() {
        this.assembly.assembly("folder", theme => {
            return (
                <Flex fw elements={[
                    <DrawerHeader
                        header={"Folder view"}
                        enableBadge
                        badgeVM={VM.UI_NO_HIGHLIGHT}
                        badgeText={"Virtual Folder System"}
                        description={"All your folders at-a-glance"}
                    />,

                    <Flex fw padding paddingX={px(25)} elements={[
                        <Button width={percent(100)} text={"Create folder"} onClick={() => {
                            this.dialog(
                                <FolderSetupDialog actions={{
                                    onSubmit(folder: Folder): boolean {
                                        const success = AtlasMain.atlas().api().createFolder(folder);
                                        setTimeout(() => {
                                            AtlasMain.atlas(atlas => {
                                                atlas.closeLocalDialog();
                                                atlas.rerender("folders");
                                            });
                                        }, 1);
                                        return success;
                                    }
                                }}/>
                            );
                        }}/>
                    ]}/>,

                    this.component(() => (
                        <SettingsGroup title={"All folders / global folders"} elements={
                            this.api().getAllFolders().map(data => (
                                <FolderComponent data={data} onSelect={(component, _) => new Promise<void>((resolve, reject) => {
                                    try {
                                        this.dialog(
                                            <FolderPreviewComponent data={data}/>
                                        );
                                        resolve();
                                    } catch (e) {
                                        reject(e);
                                    }
                                })}/>
                            ))
                        }/>
                    ), "folders")
                ]}/>
            );
        })
    }

    componentRender(p: any, s: any, l: any, t: Themeable.Theme, a: Assembly): JSX.Element | undefined {
        return (
            <Screen deactivatePadding children={
                <Flex fh fw align={Align.CENTER} elements={[
                    this.a("folder")
                ]}/>
            }/>
        );
    }
}
