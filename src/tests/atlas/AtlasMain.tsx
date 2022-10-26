import {BC, BernieComponent, GenericBC} from "../../logic/BernieComponent";
import {Assembly} from "../../logic/assembly/Assembly";
import {Themeable} from "../../logic/style/Themeable";
import {Screen} from "../../components/lo/Page";
import {Flex, FlexRow} from "../../components/lo/FlexBox";
import {Align} from "../../logic/style/Align";
import {DrawerHeader} from "../../components/lo/DrawerHeader";
import {ObjectVisualMeaning, VM} from "../../logic/style/ObjectVisualMeaning";
import {SettingsGroup} from "../../components/lo/SettingsGroup";
import {IAtlasAPI} from "./api/IAtlasAPI";
import {FolderComponent} from "./components/FolderComponent";
import {FolderPreviewComponent} from "./components/FolderPreviewComponent";
import {Button} from "../../components/lo/Button";
import {percent, px} from "../../logic/style/DimensionalMeasured";
import {FolderSetupDialog} from "./components/FolderSetupDialog";
import {Folder} from "./data/Folder";
import {StaticDrawerMenu} from "../../components/lo/StaticDrawerMenu";
import {SearchDialog} from "./components/SearchDialog";
import React from "react";
import {Text, TextType} from "../../components/lo/Text";
import {ISOHubComponent} from "./components/ISOHubComponent";
import {SettingsElement} from "../../components/ho/settingsElement/SettingsElement";
import {ReactComponent as DeleteIcon} from "../../assets/icons/ic-20/ic20-delete.svg";
import {ReactComponent as SettingsIcon} from "../../assets/icons/ic-20/ic20-settings.svg";
import {ReactComponent as ActionIcon} from "../../assets/icons/ic-20/ic20-more-ver.svg";
import {ReactComponent as StorageIcon} from "../../assets/icons/ic-20/ic20-dns.svg";
import {HOCWrapper} from "../../components/HOCWrapper";
import {StorageQuotaDialog} from "./components/StorageQuotaDialog";
import {Centered} from "../../components/lo/PosInCenter";
import {Dot} from "../../components/lo/Dot";
import {createMargin} from "../../logic/style/Margin";
import {Icon} from "../../components/lo/Icon";
import {ConfirmationDialog} from "../../components/lo/ConfirmationDialog";
import {VFSFolderView} from "./components/VFSFolderView";
import {AccountTreeRounded, CodeOffRounded, CodeRounded} from "@mui/icons-material";
import {Tooltip} from "../../components/ho/tooltip/Tooltip";
import {Gloria} from "../../frameworks/gloria/Gloria";
import {GloriaCommandPalette} from "../../frameworks/gloria/components/GloriaCommandPalette";
import {AF} from "../../components/logic/ArrayFragment";
import {Utils} from "../../logic/Utils";

export type AtlasMainProps = {
    api: IAtlasAPI
}

export type AtlasMainLocalState = {
    gloriaDialogHOCWrapper?: GenericBC
}

export class AtlasMain extends BC<AtlasMainProps, any, AtlasMainLocalState> {

    private static atlasInstance: AtlasMain | undefined = undefined;

    public static atlas(consumer?: (atlas: AtlasMain) => void): AtlasMain {
        consumer?.(this.atlasInstance as AtlasMain);
        return this.atlasInstance as AtlasMain;
    }

    constructor(props: AtlasMainProps) {
        super(props, undefined, {});
    }

    public openGloria() {
        const wrapper = AtlasMain.atlas().ls().gloriaDialogHOCWrapper;
        if (wrapper === undefined) {
            throw new Error("gloriaDialogHOCWrapper is undefined")
        }

        wrapper.dialog(
            <Screen style={{ backgroundColor: "transparent" }} deactivatePadding children={
                <Centered fullHeight children={
                    <GloriaCommandPalette gloria={new Gloria().registerCommand({
                        id: "long-duration-test",
                        title: () => "I take a long time!",
                        description: () => "This is the test description for `Test 1`. This commands does only print to the console.",
                        executor: (ctx) => new Promise(resolve => {
                            setTimeout(() => {
                                resolve(undefined);
                            }, 5000);
                        })
                    }).registerCommand({
                        id: "open-tree-view",
                        title: () => "Open tree view",
                        executor: (ctx) => new Promise(resolve => {
                            AtlasMain.atlas().openTreeViewDialog();
                            AtlasMain.atlas(atlas => {
                                atlas.ls().gloriaDialogHOCWrapper?.closeLocalDialog();
                            })
                            resolve(undefined);
                        })
                    }).registerCommand({
                        id: "asd",
                        title: () => "ASd",
                        executor: (ctx) => new Promise(resolve => {
                            console.log("asd running");
                            resolve(undefined);
                        })
                    }).registerCommand({
                        id: "test-3",
                        title: () => "3 not 2!",
                        executor: (ctx) => new Promise(resolve => {
                            console.log("Test 3 running");
                            resolve(undefined);
                        })
                    })}/>
                }/>
            }/>
        );
    }

    public api(): IAtlasAPI {
        return this.props.api;
    }

    public openTreeViewDialog() {
        this.dialog(
            <VFSFolderView
                onClose={() => this.closeLocalDialog()}
            />
        );
    }

    private registerGloriaCommandInput() {
        document.addEventListener("keydown", ev => {
            //if (ev.code === "Backquote") {
            if (ev.ctrlKey && ev.code === "KeyK") {
                AtlasMain.atlas().openGloria();
                ev.preventDefault();
            }
        });
    }

    private folderAssembly() {
        this.assembly.assembly("folder", theme => {
            return (
                <Flex fw fh elements={[
                    <DrawerHeader
                        header={"Folder view"}
                        enableBadge
                        badgeVM={VM.UI_NO_HIGHLIGHT}
                        badgeText={"Virtual Folder System"}
                        description={"All your folders at-a-glance\nPress on the context icon to see available actions, like creating folders or accessing ISO-image manager"}
                    />,

                    // <PdfViewerComponent
                    //     document={"sample.pdf"}
                    // />,

                    <FlexRow fw padding paddingX={px(25)} gap={theme.gaps.smallGab} elements={[

                        <Tooltip noBorder title={"Open tree view"} arrow children={
                            <Button height={percent(100)} children={ <Icon icon={<AccountTreeRounded/>}/> } onClick={() => {
                                this.openTreeViewDialog();
                            }}/>
                        }/>,

                        <Button height={percent(100)} children={
                            <Icon icon={<SettingsIcon/>}/>
                        }/>,

                        <Button width={percent(100)} shrinkOnClick text={"Finder"} onClick={() => {
                            this.dialog(
                                <Screen children={
                                    <SearchDialog actions={{
                                        onCancel(dialog: SearchDialog) {
                                            AtlasMain.atlas(atlas => atlas.closeLocalDialog());
                                        }
                                    }}/>
                                }/>
                            );
                        }}/>,

                        <Tooltip noBorder title={"Open command view"} arrow children={
                            <Button height={percent(100)} children={ <Icon icon={<CodeRounded/>}/> } onClick={() => {
                                AtlasMain.atlas().openGloria();
                            }}/>
                        }/>,

                        <Button height={percent(100)} children={
                            <Icon icon={<ActionIcon/>}/>
                        } onClick={() => {
                            this.dialog(
                                <HOCWrapper body={wrapper => (
                                    <StaticDrawerMenu body={props => (
                                        <Flex fw elements={[
                                            <DrawerHeader
                                                header={`Actions`}
                                                enableBadge
                                                badgeVM={VM.UI_NO_HIGHLIGHT}
                                                badgeText={"Actions"}
                                                description={`Available action for atlas.`}
                                            />,

                                            <SettingsGroup title={"Available actions"} elements={[
                                                <SettingsElement groupDisplayMode title={"Create folder"} onClick={() => {
                                                    wrapper.dialog(
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
                                                }}/>,

                                                <SettingsElement groupDisplayMode title={"Storage quota"} iconConfig={{
                                                    enable: true,
                                                    iconGenerator: element => <StorageIcon/>
                                                }} onClick={element => {
                                                    wrapper.dialog(
                                                        <StorageQuotaDialog/>
                                                    )
                                                }}/>,

                                                <SettingsElement groupDisplayMode title={"ISO-image manager"} iconConfig={{
                                                    enable: true,
                                                    iconGenerator: element => <SettingsIcon/>
                                                }} onClick={() => {
                                                    wrapper.dialog(
                                                        <ISOHubComponent/>
                                                    );
                                                }}/>,

                                                <SettingsElement groupDisplayMode title={"Settings"}/>,
                                            ]}/>,

                                            <SettingsGroup title={"Danger zone"} elements={[
                                                <SettingsElement groupDisplayMode title={"Clear data"} iconConfig={{
                                                    enable: true,
                                                    color: theme.colors.errorColor,
                                                    iconGenerator: element => <DeleteIcon/>
                                                }} onClick={element => {
                                                    element.helper.confirm({
                                                        title: "Clear data",
                                                        vm: ObjectVisualMeaning.ERROR,
                                                        text: "This action cannot be undone. Once data is cleared, it is removed unrecoverable from the system.\n**It is recommended to create recoverable backups via the ISO-image manager**.",
                                                        actions: {
                                                            onConfirm(component: BC<any, any, any>) {
                                                                AtlasMain.atlas(atlas => {
                                                                    atlas.api().clear().then(() => {
                                                                        atlas.rerender("folders");
                                                                        component.closeLocalDialog();
                                                                        element.closeLocalDialog();
                                                                    });
                                                                });
                                                            },
                                                            onCancel(component: BernieComponent<any, any, any>) {
                                                                component.closeLocalDialog();
                                                            }
                                                        }
                                                    }, (config, caller) => <ConfirmationDialog config={config} caller={caller}/>)
                                                }}/>
                                            ]}/>
                                        ]}/>
                                    )}/>
                                )}/>
                            )
                        }}/>,
                    ]}/>,

                    this.component(() => {
                        // Render empty state
                        if (this.api().getAllFolders().length === 0) {
                            return (
                                <Centered fullHeight children={
                                    <Flex width={percent(75)} align={Align.CENTER} gap={theme.gaps.smallGab} elements={[
                                        <Text
                                            text={"No folders found"}
                                            uppercase
                                            bold
                                        />,
                                        <Text
                                            text={"No folders were found. To view folders import them via **ISO-image manager** or create a new folder from scratch"}
                                            type={TextType.secondaryDescription}
                                            fontSize={px(11)}
                                            align={Align.CENTER}
                                        />,

                                        <FlexRow margin={createMargin(20, 0, 0, 0)} gap={theme.gaps.smallGab} elements={[
                                            <Button
                                                border={false}
                                                bgColorOnDefault={false}
                                                highlight={false}
                                                visualMeaning={ObjectVisualMeaning.INFO}
                                                opaque
                                                children={
                                                    <Text
                                                        whitespace={"nowrap"}
                                                        text={"Create first folder"}
                                                        type={TextType.secondaryDescription}
                                                        fontSize={px(11)}
                                                        coloredText
                                                        visualMeaning={VM.INFO}
                                                    />
                                                }
                                                onClick={() => {
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
                                                }}
                                            />,
                                            <Dot/>,
                                            <Button
                                                border={false}
                                                bgColorOnDefault={false}
                                                highlight={false}
                                                visualMeaning={ObjectVisualMeaning.INFO}
                                                opaque
                                                children={
                                                    <Text
                                                        whitespace={"nowrap"}
                                                        text={"ISO-image manager"}
                                                        type={TextType.secondaryDescription}
                                                        fontSize={px(11)}
                                                        coloredText
                                                        visualMeaning={VM.INFO}
                                                    />
                                                }
                                                onClick={() => {
                                                    this.dialog(
                                                        <ISOHubComponent/>
                                                    );
                                                }}
                                            />
                                        ]}/>
                                    ]}/>
                                }/>
                            );
                        }

                        return (
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
                        );
                    }, "folders")
                ]}/>
            );
        })
    }

    init() {
        super.init();
        this.folderAssembly();
    }

    componentDidMount() {
        super.componentDidMount();
        AtlasMain.atlasInstance = this;
        this.registerGloriaCommandInput();
    }

    componentWillUnmount() {
        super.componentWillUnmount();
        AtlasMain.atlasInstance = undefined;
    }

    componentRender(p: any, s: any, l: any, t: Themeable.Theme, a: Assembly): JSX.Element | undefined {
        return (
            <AF elements={[
                // Visual content
                <Screen deactivatePadding children={
                    <Flex fh fw align={Align.CENTER} elements={[
                        this.a("folder")
                    ]}/>
                }/>,

                // logic components
                <HOCWrapper body={() => <></>} componentDidMount={wrapper => {
                    this.local.setState({
                        gloriaDialogHOCWrapper: wrapper
                    });
                }}/>
            ]}/>
        );
    }
}
