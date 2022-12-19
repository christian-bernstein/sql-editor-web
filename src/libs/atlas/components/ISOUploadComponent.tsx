import {BC, GenericBC} from "../../sql/logic/BernieComponent";
import {Assembly} from "../../sql/logic/assembly/Assembly";
import {Themeable} from "../../sql/logic/style/Themeable";
import {Input} from "../../sql/components/lo/Input";
import {StaticDrawerMenu} from "../../sql/components/lo/StaticDrawerMenu";
import React from "react";
import {Flex} from "../../sql/components/lo/FlexBox";
import {DrawerHeader} from "../../sql/components/lo/DrawerHeader";
import {ObjectVisualMeaning, VM} from "../../sql/logic/style/ObjectVisualMeaning";
import {DimensionalMeasured, percent, px} from "../../sql/logic/style/DimensionalMeasured";
import {Button} from "../../sql/components/lo/Button";
import {Align} from "../../sql/logic/style/Align";
import {createMargin} from "../../sql/logic/style/Margin";
import {Badge} from "../../sql/components/lo/Badge";
import {Text, TextType} from "../../sql/components/lo/Text";
import {Folder} from "../data/Folder";
import {Category} from "../data/Category";
import {AtlasDocument} from "../data/AtlasDocument";
import {AtlasMain} from "../AtlasMain";
import {ISOInstaller} from "../data/ISOInstaller";
import moment, {Duration} from "moment";
import {ISOBase} from "../iso/ISOBase";
import {ISOInstallMethod} from "../iso/ISOInstallMethod";
import {ISOBasePreview} from "./ISOBasePreview";
import {If} from "../../sql/components/logic/If";
import {Group} from "../../sql/components/lo/Group";
import {Orientation} from "../../sql/logic/style/Orientation";
import {AF} from "../../sql/components/logic/ArrayFragment";
import {Separator} from "../../sql/components/lo/Separator";
import {Dimension} from "../../sql/logic/style/Dimension";
import {OverflowWithHeader} from "../../sql/components/lo/OverflowWithHeader";
import {FlexDirection} from "../../sql/logic/style/FlexDirection";
import {HOCWrapper} from "../../sql/components/HOCWrapper";

export type ISOUploadComponentLocalState = {
    iso?: File,
    isoBase?: ISOBase,
    isoInstallAlgorithms: Map<string, ISOInstaller<ISOUploadComponent>>,
    installationDuration?: Duration,

    dialogDOMEntry?: GenericBC
}

export class ISOUploadComponent extends BC<any, any, ISOUploadComponentLocalState> {

    constructor() {
        super(undefined, undefined, {
            isoInstallAlgorithms: new Map<string, ISOInstaller<ISOUploadComponent>>([
                ["merge", {
                    install: (iso: File, controller: ISOUploadComponent): boolean => {
                        const reader: FileReader = new FileReader();
                        reader.onload = async (event: ProgressEvent<FileReader>) => {
                            const isoRaw = event.target?.result;
                            const base: ISOBase = JSON.parse(isoRaw as string);
                            AtlasMain.atlas().api().isoAdapter("v1").install(ISOInstallMethod.MERGE, base, this.ls().dialogDOMEntry as GenericBC);
                        }
                        reader.readAsText(iso);
                        return true;
                    }
                }],
                ["replace", {
                    install: (iso: File, controller: ISOUploadComponent): boolean => {
                        const reader: FileReader = new FileReader();
                        reader.onload = async (event: ProgressEvent<FileReader>) => {
                            const isoRaw = event.target?.result;
                            const base: ISOBase = JSON.parse(isoRaw as string);
                            AtlasMain.atlas().api().isoAdapter("v1").install(ISOInstallMethod.REPLACE, base, this.ls().dialogDOMEntry as GenericBC);
                        }
                        reader.readAsText(iso);
                        return true;
                    }
                }],
            ])
        });
    }

    private onInstallationFinished(success: boolean) {
        this.dialog(
            <StaticDrawerMenu body={() => {
                return (
                    <Flex elements={[
                        <DrawerHeader
                            header={"ISO-image installation completed"}
                            enableBadge
                            badgeVM={VM.UI_NO_HIGHLIGHT}
                            badgeText={"VFS-ISO"}
                            description={"Upload and installation of the Atlas™-ISO-image finished with success."}
                            margin={createMargin(0, 0, 40, 0)}
                        />,

                        <Text
                            align={Align.CENTER}
                            coloredText
                            text={`Installation of the Atlas™-ISO-image was completed successfully.`}
                            visualMeaning={ObjectVisualMeaning.SUCCESS_DEFAULT}
                            texts={[
                                "",
                                `**Installation took ${this.local.state.installationDuration?.humanize()}**`,
                                `*(${moment.utc(this.local.state.installationDuration?.asMilliseconds()).format('HH:mm:SS')})*`,
                            ]}
                        />,

                        <Flex fw padding paddingX={px(25)} elements={[
                            <Button
                                width={percent(100)}
                                onClick={() => this.closeLocalDialog()}
                                text={"OK"}
                            />,
                        ]}/>,
                    ]}/>
                );
            }}/>
        );

        AtlasMain.atlas().rerender("folders");
    }

    private installIso(algorithm: string | "merge" | "replace") {
        if (this.local.state.iso === undefined) {
            return;
        }
        const installer = this.local.state.isoInstallAlgorithms.get(algorithm);

        if (installer !== undefined) {
            const start = moment(new Date()).unix();
            const success = installer.install(this.local.state.iso, this);
            const end = moment(new Date()).unix();
            const diff = end - start;

            console.log("start", start, "end", end, "diff", diff);

            this.local.setState({
                installationDuration: moment.duration(diff)
            });
            this.onInstallationFinished(success);
        }
    }

    private installIsoEntries(isoEntries: [{ key: string, value: any[] }]) {
        AtlasMain.atlas(atlas => {
            const api = atlas.api();

            isoEntries.forEach(entry => {
                switch (entry.key) {
                    case "folders": {
                        const folders = entry.value as Array<Folder>;
                        folders.forEach(folder => api.createFolder(folder));
                        break;
                    }
                    case "categories": {
                        const categories = entry.value as Array<Category>;
                        categories.forEach(category => api.createCategory(category));
                        break;
                    }
                    case "documents": {
                        const documents = entry.value as Array<AtlasDocument>;
                        documents.forEach(document => api.createDocument(document));
                        break;
                    }
                }
            });
        });
    }

    private merge() {
        if (this.local.state.iso === undefined) {
            return;
        }
        const reader: FileReader = new FileReader();
        reader.onload = async (event: ProgressEvent<FileReader>) => {
            const isoRaw = event.target?.result;
            const isoEntries: [{ key: string, value: any[] }] = JSON.parse(isoRaw as string);
            this.installIsoEntries(isoEntries);
        }
        reader.readAsText(this.local.state.iso);
    }

    private replace() {
        if (this.local.state.iso === undefined) {
            return;
        }
        AtlasMain.atlas().api().clear();
        const reader: FileReader = new FileReader();
        reader.onload = async (event: ProgressEvent<FileReader>) => {
            const isoRaw = event.target?.result;
            const isoEntries: [{ key: string, value: any[] }] = JSON.parse(isoRaw as string);
            this.installIsoEntries(isoEntries);
        }
        reader.readAsText(this.local.state.iso);
    }

    componentRender(p: any, s: any, l: any, t: Themeable.Theme, a: Assembly): JSX.Element | undefined {
        return (
            <HOCWrapper body={wrapper => {
                this.ls().dialogDOMEntry = wrapper;

                return (
                    <StaticDrawerMenu maxHeight={DimensionalMeasured.of(85, Dimension.vh)} body={() => {
                        return (
                            <OverflowWithHeader height={percent(100)} dir={FlexDirection.COLUMN_REVERSE} staticContainer={{
                                elements: [
                                    <DrawerHeader
                                        header={"ISO-image installer"}
                                        enableBadge
                                        badgeVM={VM.UI_NO_HIGHLIGHT}
                                        badgeText={"VFS-ISO"}
                                        description={"Upload and install Atlas™-ISO-images.\n\n*Tip: Atlas-ISO-Images are in JSON-format, which makes them human-readable & easily processable. You can for example inspect the ISO by opening it in a browser window.*"}
                                        margin={createMargin(0, 0, 40, 0)}
                                    />
                                ]
                            }} overflowContainer={{
                                gap: t.gaps.smallGab,
                                elements: [
                                    <Flex fw gap={px()} elements={[
                                        <Text text={"Step 1"} bold/>,
                                        <Text text={"Select an Atlas™-ISO-image-file"} type={TextType.secondaryDescription} fontSize={px(11)}/>
                                    ]}/>,

                                    <Group enableSeparators={false} width={percent(100)} orientation={Orientation.VERTICAL} elements={[
                                        <Input autoFocus type={"file"} onChange={ev => {
                                            if (ev.target.files !== null) {
                                                const file: File = ev.target.files[0];
                                                const reader: FileReader = new FileReader();
                                                reader.onload = async (event: ProgressEvent<FileReader>) => {
                                                    const isoBase: ISOBase = JSON.parse(event.target?.result as string);
                                                    this.local.setStateWithChannels({
                                                        isoBase: isoBase,
                                                        iso: file
                                                    }, ["iso"]);
                                                }
                                                reader.readAsText(file);
                                            }
                                        }}/>,

                                        this.component((local) => (
                                            <If condition={local.state.iso !== undefined} ifTrue={
                                                <AF elements={[
                                                    <Separator/>,
                                                    <ISOBasePreview
                                                        iso={local.state.isoBase as ISOBase}
                                                    />
                                                ]}/>
                                            }/>
                                        ), "iso")
                                    ]}/>,

                                    <Flex fw gap={px()} elements={[
                                        <Text text={"Step 2"} bold/>,
                                        <Text text={"Choose a method for installation"} type={TextType.secondaryDescription} fontSize={px(11)}/>
                                    ]}/>,

                                    <Flex fw padding={false} paddingX={px(25)} gap={t.gaps.smallGab} elements={[
                                        <Button
                                            width={percent(100)}
                                            onClick={() => this.installIso("merge")}
                                            children={
                                                <Flex gap={px(0)} align={Align.CENTER} fw elements={[
                                                    <Flex fw align={Align.CENTER} margin={createMargin(0, 0, t.gaps.smallGab.measurand, 0)} elements={[
                                                        Badge.badge("Recommended", {
                                                            visualMeaning: ObjectVisualMeaning.INFO
                                                        }),
                                                    ]}/>,
                                                    <Text
                                                        bold
                                                        text={"Merge"}
                                                    />,
                                                    <Text
                                                        text={`Merge into current Atlas™-state`}
                                                        type={TextType.secondaryDescription}
                                                        fontSize={px(11)}
                                                        align={Align.CENTER}
                                                    />
                                                ]}/>
                                            }
                                        />,
                                        <Button
                                            width={percent(100)}
                                            onClick={() => this.installIso("replace")}
                                            children={
                                                <Flex gap={px(0)} align={Align.CENTER} fw elements={[
                                                    <Flex fw align={Align.CENTER} margin={createMargin(0, 0, t.gaps.smallGab.measurand, 0)} elements={[
                                                        Badge.badge("Affects data-integrity", {
                                                            visualMeaning: ObjectVisualMeaning.WARNING
                                                        }),
                                                    ]}/>,
                                                    <Text
                                                        bold
                                                        text={"Replace"}
                                                    />,
                                                    <Text
                                                        text={`Replace Atlas™-state with ISO-data`}
                                                        type={TextType.secondaryDescription}
                                                        fontSize={px(11)}
                                                        align={Align.CENTER}
                                                    />
                                                ]}/>
                                            }
                                        />,
                                    ]}/>,
                                ]
                            }}/>
                        );
                    }}/>
                );
            }}/>
        );
    }
}
