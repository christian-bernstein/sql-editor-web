import {BC, BernieComponent, GenericBC} from "../sql/logic/BernieComponent";
import {Assembly} from "../sql/logic/assembly/Assembly";
import {Themeable} from "../sql/logic/style/Themeable";
import {Screen} from "../sql/components/lo/Page";
import {Flex, FlexRow} from "../sql/components/lo/FlexBox";
import {Align} from "../sql/logic/style/Align";
import {DrawerHeader} from "../sql/components/lo/DrawerHeader";
import {ObjectVisualMeaning, VM} from "../sql/logic/style/ObjectVisualMeaning";
import {SettingsGroup} from "../sql/components/lo/SettingsGroup";
import {IAtlasAPI} from "./api/IAtlasAPI";
import {FolderComponent} from "./components/FolderComponent";
import {FolderPreviewComponent} from "./components/FolderPreviewComponent";
import {Button} from "../sql/components/lo/Button";
import {percent, px, vw} from "../sql/logic/style/DimensionalMeasured";
import {FolderSetupDialog} from "./components/FolderSetupDialog";
import {Folder} from "./data/Folder";
import {StaticDrawerMenu} from "../sql/components/lo/StaticDrawerMenu";
import {SearchDialog} from "./components/SearchDialog";
import React from "react";
import {Text, TextType} from "../sql/components/lo/Text";
import {ISOHubComponent} from "./components/ISOHubComponent";
import {SettingsElement} from "../sql/components/ho/settingsElement/SettingsElement";
import {ReactComponent as DeleteIcon} from "../../assets/icons/ic-20/ic20-delete.svg";
import {ReactComponent as SettingsIcon} from "../../assets/icons/ic-20/ic20-settings.svg";
import {ReactComponent as ActionIcon} from "../../assets/icons/ic-20/ic20-more-ver.svg";
import {ReactComponent as StorageIcon} from "../../assets/icons/ic-20/ic20-dns.svg";
import {HOCWrapper} from "../sql/components/HOCWrapper";
import {StorageQuotaDialog} from "./components/StorageQuotaDialog";
import {Centered} from "../sql/components/lo/PosInCenter";
import {Dot} from "../sql/components/lo/Dot";
import {createMargin} from "../sql/logic/style/Margin";
import {Icon} from "../sql/components/lo/Icon";
import {ConfirmationDialog} from "../sql/components/lo/ConfirmationDialog";
import {VFSFolderView} from "./components/VFSFolderView";
import {AccountTreeRounded, CodeRounded, HelpRounded} from "@mui/icons-material";
import {Tooltip} from "../sql/components/ho/tooltip/Tooltip";
import {Gloria} from "./gloria/Gloria";
import {GloriaCommandPalette} from "./gloria/components/GloriaCommandPalette";
import {AF} from "../sql/components/logic/ArrayFragment";
import {v4} from "uuid";
import {StringQuery} from "./components/queries/StringQuery";
import {IconDict} from "./icons/IconDict";
import {atlasIconDict} from "./icons/AtlasIconDict";
import {IconLookup} from "./icons/IconLookup";
import {CommandOrchestrator} from "./keylogger/CommandOrchestrator";
import {KeyCommandHint} from "./keylogger/components/KeyCommandHint";
import {KeyCommandOption} from "./keylogger/KeyCommandOption";
import {SettingsDisplayRoot} from "./settings/components/SettingsDisplayRoot";
import {HyperionAPI} from "./hyperion/HyperionAPI";
import {HyperionIndexedDBStreamAdapter} from "./hyperion/HyperionIndexedDBStreamAdapter";
import {FileInput} from "../sql/components/ho/fileInput/FileInput";
import {UpstreamTransactionType} from "./hyperion/UpstreamTransactionType";
import {EntityMovePromptComponent} from "./components/EntityMovePromptComponent";
import {Description} from "../sql/components/lo/Description";
import {AtlasLogo} from "./components/branding/AtlasLogo";
import {isMobile} from "react-device-detect";
import {TheiaAPI} from "./theia/TheiaAPI";
import {TheiaLocalDBNode} from "./theia/TheiaLocalDBNode";

export type AtlasMainProps = {
    api: IAtlasAPI
}

export type AtlasMainLocalState = {
    gloriaDialogHOCWrapper?: GenericBC,
    keyCommandDialogHOCWrapper?: GenericBC,
    vfsFolderViewInstance?: VFSFolderView,
    vfsFolderViewOpened: boolean,
    iconDict: IconDict,
    keyCommandOrchestrator: CommandOrchestrator
    displayLoadingScreen: boolean
}

export class AtlasMain extends BC<AtlasMainProps, any, AtlasMainLocalState> {

    private static atlasInstance: AtlasMain | undefined = undefined;

    public static atlas(consumer?: (atlas: AtlasMain) => void): AtlasMain {
        consumer?.(this.atlasInstance as AtlasMain);
        return this.atlasInstance as AtlasMain;
    }

    constructor(props: AtlasMainProps) {
        super(props, undefined, {
            vfsFolderViewOpened: false,
            iconDict: atlasIconDict,
            keyCommandOrchestrator: new CommandOrchestrator(),
            displayLoadingScreen: true
        });
    }

    init() {
        super.init();
        AtlasMain.atlasInstance = this;
        // Init hyperion api
        HyperionAPI.hyperion(prop => prop.setStreamAdapter(new HyperionIndexedDBStreamAdapter()), () => new HyperionAPI());
        // Init theia api
        TheiaAPI.theia(prop => prop.addNode("local", new TheiaLocalDBNode()), () => new TheiaAPI());

        this.folderAssembly();
        this.loadingDisplayAssembly();

        this.ls().keyCommandOrchestrator.registerCommand({
            title: "Toggle",
            initKey: "KeyT",
            helpText: "This is the test help text of command '*Test*'",
            keyHintGenerator: cache => (["KeyM"]),
            executor: (ctx, orchestrator) => new Promise<void>((resolve, reject) => {
                if (ctx.parameters[0] === "KeyM") {
                    AtlasMain.atlas(atlas => {
                        atlas.useVFSFolderView(view => {
                            view.toggleMenu();
                            resolve();
                        }, () => reject());
                    });
                }
                reject();
            })
        });

        this.ls().keyCommandOrchestrator.registerCommand({
            keyHintGenerator: (cache: Array<string>) => [],
            title: "Test",
            initKey: "KeyD",
            helpText: "This is the test help text of command '*Test*'",
            keyOptionsGenerator: ctx => {
                const folders = AtlasMain.atlas().api().getAllFolders();
                const getFolder = (id: string): (Folder | undefined) => folders.filter(folder => folder.id === id)[0] ?? undefined;
                return (AtlasMain.atlas().ls()?.vfsFolderViewInstance?.getCurrentFolder().subFolderIDs?.map(subFolderID => {
                    const folder = getFolder(subFolderID);
                    if (folder === undefined) return {
                        id: subFolderID,
                        title: `N/A '${subFolderID}'`
                    }
                    return ({
                        id: subFolderID,
                        title: folder.title
                    });
                }) ?? []) as Array<KeyCommandOption>;
            },
            executor: (ctx, orchestrator) => new Promise<void>((resolve, reject) => {
                const index = ctx.selectedOptionIndex;
                const options: Array<KeyCommandOption> = ctx.keyCommand?.keyOptionsGenerator?.(ctx) ?? [];
                const selected = options[index];
                const isSelected = (id: string) => selected.id === id;

                setTimeout(() => resolve(), 8000);
            })
        });

        this.ls().keyCommandOrchestrator.registerCommand({
            title: "Open..",
            initKey: "KeyO",
            helpText: "This is the test help text of command '*Test*'",
            keyOptionsGenerator: ctx => [
                { id: "gloria", title: "Gloria", description: "Gloria command palette dialog" },
                { id: "vfs", title: "VFS", description: "VFS folder view dialog" },
            ],
            keyHintGenerator: cache => ([]),
            executor: (ctx, orchestrator) => new Promise<void>((resolve, reject) => {
                const index = ctx.selectedOptionIndex;
                const options: Array<KeyCommandOption> = ctx.keyCommand?.keyOptionsGenerator?.(ctx) ?? [];
                const selected = options[index];
                const isSelected = (id: string) => selected.id === id;
                if (isSelected("gloria")) {
                    AtlasMain.atlas(atlas => {
                        atlas.openGloria();
                        resolve();
                    });
                }
                if (isSelected("vfs")) {
                    AtlasMain.atlas(atlas => {
                        atlas.openTreeViewDialog();
                        resolve();
                    });
                }
            })
        });

        this.ls().keyCommandOrchestrator.registerCommand({
            title: "Close a file",
            initKey: "KeyX",
            helpText: "This is the test help text of command '*Test*'",
            keyHintGenerator: cache => ([]),
            executor: (ctx, orchestrator) => new Promise<void>((resolve, reject) => {
                const view = this.ls().vfsFolderViewInstance;
                // TODO: Use .useVFS..(..)
                if (view === undefined) {
                    reject();
                    return;
                }
                try {
                    const multiplexers = view.ls().viewMultiplexers;
                    const multiplexer = multiplexers[0];
                    AtlasMain.atlas().ls()?.vfsFolderViewInstance?.closeAndRemoveDocumentFromMultiplexer(multiplexer.groupID, multiplexer.activeDocumentID as string);
                    resolve();
                } catch (e) {
                    console.error(e);
                    reject(e);
                }
            })
        });

        this.ls().keyCommandOrchestrator.registerCommand({
            title: "Open a file",
            initKey: "KeyF",
            helpText: "This is the test help text of command '*Test*'",
            keyOptionsGenerator: ctx => {
                return AtlasMain.atlas().ls()?.vfsFolderViewInstance?.getDocumentsInCurrentFolder().map(doc => ({
                    id: doc.id,
                    title: doc.title ?? `Unnamed '${doc.id}'`,
                    description: undefined
                })) ?? [];
            },
            keyHintGenerator: cache => ([]),
            executor: (ctx, orchestrator) => new Promise<void>((resolve, reject) => {
                const index = ctx.selectedOptionIndex;
                const options: Array<KeyCommandOption> = ctx.keyCommand?.keyOptionsGenerator?.(ctx) ?? [];
                const selected = options[index];
                const document = AtlasMain.atlas().api().getDocument(selected.id);
                AtlasMain.atlas().ls()?.vfsFolderViewInstance?.openDocument(document);
                resolve();
            })
        });

        this.ls().keyCommandOrchestrator.registerCommand({
            title: "A is here",
            initKey: "KeyA",
            helpText: "This is the test help text of command '*Test*'",
            keyOptionsGenerator: ctx => [
                { id: "a", title: "A 123", description: "A description :)" },
                { id: "b", title: "B 344", description: "B description" },
            ],
            keyHintGenerator: cache => ([]),
            executor: (ctx, orchestrator) => new Promise<void>((resolve, reject) => {
                resolve();
            })
        });

        this.ls().keyCommandOrchestrator.registerCommand({
            title: "Multiplexer",
            initKey: "KeyM",
            helpText: "",
            keyHintGenerator: cache => ([]),
            executor: (ctx, orchestrator) => new Promise<void>((resolve, reject) => {
                const view = this.ls().vfsFolderViewInstance;
                if (view === undefined) {
                    reject();
                    return;
                }
                try {
                    const multiplexers = view.ls().viewMultiplexers;
                    const multiplexer = multiplexers[0];
                    const documents = multiplexer.documents;
                    const indexKey = ctx.parameters[0];

                    const index = Number(indexKey.slice(-1));

                    console.log("indexKey", indexKey, indexKey.slice(-1), index);

                    console.log("switch-document", documents[index].title, multiplexer.groupID);

                    view.updateMultiplexer(multiplexer.groupID, ["main"], multiplexer => {
                        multiplexer.activeDocumentID = documents[index].id;
                        return multiplexer;
                    });

                    resolve();
                } catch (e) {
                    console.error(e);
                    reject(e);
                }
            })
        });

    }

    componentDidMount() {
        super.componentDidMount();
        this.registerGloriaCommandInput();
        this.initKeyCommandOrchestrator();

        this.setLoadingScreen(false);
    }

    componentWillUnmount() {
        super.componentWillUnmount();
        AtlasMain.atlasInstance = undefined;
    }

    // PUBLIC LOGIC

    public getKeyCommandOrchestrator(): CommandOrchestrator {
        return this.ls().keyCommandOrchestrator;
    }

    public getAtlasIconDict(): IconDict {
        return this.ls().iconDict;
    }

    public getIconFromLookup(lookup: IconLookup): JSX.Element {
        return this.getAtlasIconDict().table.get(lookup.id)?.() ?? (
            <Tooltip title={`**Error loading icon** Id: '${lookup.id}'; Dict: '${lookup.dict}'`} children={
                <HelpRounded/>
            }/>
        );
    }

    public isVFSFolderViewOpened(): boolean {
        const ls = this.ls();
        return !(!ls.vfsFolderViewOpened || ls.vfsFolderViewInstance === undefined);
    }

    public useVFSFolderView(action: (view: VFSFolderView) => void, ifNotOpen?: () => void) {
        const ls = this.ls();
        if (!ls.vfsFolderViewOpened || ls.vfsFolderViewInstance === undefined) {
            ifNotOpen?.();
            return;
        }
        action(ls.vfsFolderViewInstance);
    }

    public openGloria() {
        const wrapper = AtlasMain.atlas().ls().gloriaDialogHOCWrapper;
        if (wrapper === undefined) throw new Error("gloriaDialogHOCWrapper is undefined");

        wrapper.dialog(
            <Screen style={{ backgroundColor: "transparent" }} deactivatePadding children={
                <Centered fullHeight children={
                    <HOCWrapper body={gcpDialogWrapper => {
                        return (
                            <GloriaCommandPalette gloria={new Gloria().registerCommand({
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
                                id: "create-multiplexer",
                                title: () => "Create multiplexer",
                                executor: (ctx) => new Promise(resolve => {
                                    // TODO Fix bugs
                                    AtlasMain.atlas(atlas => {
                                        // Open vfs folder view if not opened yet
                                        if (!this.isVFSFolderViewOpened()) AtlasMain.atlas().openTreeViewDialog();
                                        // Create a new multiplexer
                                        let multiplexerName: string | undefined = undefined;
                                        const multiplexerFactory = () => {
                                            atlas.useVFSFolderView(view => {
                                                view.createMultiplexer({
                                                    groupID: v4(),
                                                    view: view,
                                                    groupTitle: multiplexerName ?? "Multiplexer",
                                                    documents: []
                                                });
                                                atlas.ls().gloriaDialogHOCWrapper?.closeLocalDialog();
                                            });
                                        }
                                        gcpDialogWrapper.dialog(
                                            <StringQuery title={"Choose multiplexer name"} description={"Choose the title of the new multiplexer"} onSubmit={string => {
                                                multiplexerName = string;
                                                multiplexerFactory();
                                            }}/>,
                                            () => {
                                                multiplexerFactory();
                                            }
                                        );
                                    });
                                    resolve(undefined);
                                })
                            }).registerCommand({
                                id: "iso-image-manager",
                                title: () => "ISO-Image-Manager",
                                executor: (ctx) => new Promise(resolve => {
                                    ctx.dialogEntry?.dialog(
                                        <ISOHubComponent/>
                                    );
                                    resolve(undefined);
                                })
                            }).registerCommand({
                                id: "upload-document-view-background-image",
                                title: () => "Upload DocumentView background image",
                                executor: (ctx) => new Promise(resolve => {
                                    ctx.dialogEntry?.dialog(
                                        <StaticDrawerMenu body={() => (
                                            <FileInput onSubmit={ctx => {
                                                HyperionAPI.hyperion(prop => prop.upstreamTransaction({
                                                    type: UpstreamTransactionType.OVERWRITE,
                                                    transactionID: v4(),
                                                    onStreamed: () => {
                                                        // TODO: Rerender
                                                    },
                                                    entry: {
                                                        id: "atlas-document-background",
                                                        value: ctx.dataURL ?? "error"
                                                    }
                                                }));
                                            }}/>
                                        )}/>
                                    );
                                    resolve(undefined);
                                })
                            })}/>
                        );
                    }}/>
                }/>
            }/>
        );
    }

    public api(): IAtlasAPI {
        return this.props.api;
    }

    public openTreeViewDialog() {
        const onClose = () => {
            console.debug("VFSFolderView onClose in AtlasMain")

            this.closeLocalDialog();
            this.local.setStateWithChannels({
                vfsFolderViewOpened: false,
                vfsFolderViewInstance: undefined
            }, ["vfs-folder-view"]);
        }

        this.dialog(
            <VFSFolderView
                onClose={() => onClose()}
                onMount={(view: VFSFolderView) => {
                    this.local.setStateWithChannels({
                        vfsFolderViewOpened: true,
                        vfsFolderViewInstance: view
                    }, ["vfs-folder-view"]);
                }}
            />
            // , () => onClose()
        );
    }

    // INTERNAL LOGIC

    private registerGloriaCommandInput() {
        document.addEventListener("keydown", ev => {
            if (ev.ctrlKey && ev.code === "KeyK") {
                AtlasMain.atlas().openGloria();
                ev.preventDefault();
            }
        });
    }

    private initKeyCommandOrchestrator() {
        let alt = false;
        const setAlt = (newAlt: boolean) => alt = newAlt;
        // const isTriggerKeyPressed = (ev: KeyboardEvent) => ev.shiftKey;
        const isTriggerKeyPressed = (ev: KeyboardEvent) => ev.ctrlKey && ev.shiftKey;

        document.addEventListener("keydown", (ev: KeyboardEvent) => {
            const o = this.ls().keyCommandOrchestrator;
            const key = ev.keyCode || ev.charCode;

            // Move option pointer
            if (o.isEngaged() && (key == 38 || key == 40)) {
                ev.preventDefault();
                switch (key) {
                    // ARROW_UP
                    case 38: {
                        o.moveOptionIndex(-1);
                        break;
                    }
                    // ARROW_DOWN
                    case 40: {
                        o.moveOptionIndex(1);
                    }
                }
            }

            // Delete last selected key entry
            if (o.isEngaged() && (key == 8 || key == 46)) {
                ev.preventDefault();
                o.deleteKey();
            }

            if (alt) return;

            if (isTriggerKeyPressed(ev)) {
                ev.preventDefault();
                ev.stopPropagation();
                o.engage();
                setAlt(true);
            }
        });

        document.addEventListener("keyup", ev => {
            const o = this.ls().keyCommandOrchestrator;
            if (!isTriggerKeyPressed(ev) && o.isEngaged()) {
                o.disengage();
            }
            if (!isTriggerKeyPressed(ev) && alt) {
                setAlt(false);
            }
        });

        document.addEventListener("keypress", ev => {
            const o = AtlasMain.atlas().ls().keyCommandOrchestrator;
            // console.warn("keypress orc", o)
            if (o.isEngaged()) {
                o.appendKey(ev.code);
                ev.preventDefault();
                ev.stopPropagation();
            }
        });

        this.ls().keyCommandOrchestrator.subscribe((fromCtx, toCtx, orchestrator, options) => {
            if (fromCtx === undefined && toCtx !== undefined) {
                // ENGAGED
                AtlasMain.atlas().ls().keyCommandDialogHOCWrapper?.dialog(
                    <KeyCommandHint/>
                );
                return;
            }
            if (fromCtx !== undefined && toCtx === undefined) {
                // DISENGAGED
                AtlasMain.atlas().ls().keyCommandDialogHOCWrapper?.closeLocalDialog();
                return;
            }

            if (options.useChannelizedRerender) {
                AtlasMain.atlas().rerender(...options.channels);
            } else {
                AtlasMain.atlas().rerender("key-command-hint");
            }
        });
    }

    private setLoadingScreen(showLoadingScreen: boolean) {
        this.local.setStateWithChannels({
            displayLoadingScreen: showLoadingScreen
        }, ["loading-display"]);
    }

    // ASSEMBLIES

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

                    <FlexRow fw padding paddingX={px(25)} gap={theme.gaps.smallGab} elements={[

                        <Tooltip noBorder title={"Open tree view"} arrow children={
                            <Button height={percent(100)} children={ <Icon icon={<AccountTreeRounded/>}/> } onClick={() => {
                                this.openTreeViewDialog();
                            }}/>
                        }/>,

                        <Button height={percent(100)} children={
                            <Icon icon={<SettingsIcon/>}/>
                        } onClick={() => {
                            this.dialog(
                                <SettingsDisplayRoot/>
                            );
                        }}/>,

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

    private loadingDisplayAssembly() {
        this.assembly.assembly("loading-display", theme => {
            if (isMobile) {
                return (
                    <Screen deactivatePadding children={
                        <Centered fullHeight children={
                            <Flex align={Align.CENTER} elements={[
                                <AtlasLogo width={vw(50)}/>,
                                <Description text={"Loading"} fontSize={px(20)} renderMarkdown={true}/>
                            ]}/>
                        }/>
                    }/>
                );
            }

            return (
                <Screen deactivatePadding children={
                    <Centered fullHeight children={
                        <Flex align={Align.CENTER} elements={[
                            <AtlasLogo width={vw(10)}/>,
                            <Description text={"Loading"} fontSize={px(20)} renderMarkdown={true}/>
                        ]}/>
                    }/>
                }/>
            );
        });
    }

    componentRender(p: any, s: any, l: any, t: Themeable.Theme, a: Assembly): JSX.Element | undefined {
        return this.component(local => {
            // Display the loading screen
            if (local.state.displayLoadingScreen) return this.a("loading-display");
            // Display the general website
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
                    }}/>,

                    // key command hint components
                    <HOCWrapper body={() => <></>} componentDidMount={wrapper => {
                        this.local.setState({
                            keyCommandDialogHOCWrapper: wrapper
                        });
                    }}/>
                ]}/>
            )
        }, "loading-display");
    }
}
