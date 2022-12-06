import {BC} from "../../../logic/BernieComponent";
import {Folder} from "../data/Folder";
import {Themeable} from "../../../logic/style/Themeable";
import {Assembly} from "../../../logic/assembly/Assembly";
import {Text, TextType} from "../../../components/lo/Text";
import {getOr} from "../../../logic/Utils";
import {SettingsElement} from "../../../components/ho/settingsElement/SettingsElement";
import {ReactComponent as FolderIcon} from "../../../assets/icons/ic-20/ic20-folder.svg";
import {FlexRow} from "../../../components/lo/FlexBox";
import {Badge} from "../../../components/lo/Badge";
import {ObjectVisualMeaning, VM} from "../../../logic/style/ObjectVisualMeaning";
import {Color} from "../../../logic/style/Color";
import {percent, px} from "../../../logic/style/DimensionalMeasured";
import {Align} from "../../../logic/style/Align";
import {If} from "../../../components/logic/If";
import {Icon} from "../../../components/lo/Icon";
import {StarRounded} from "@mui/icons-material";
import React from "react";
import {StaticDrawerMenu} from "../../../components/lo/StaticDrawerMenu";
import {DocumentPreview} from "./DocumentPreview";
import {AtlasDocument} from "../data/AtlasDocument";
import {AtlasMain} from "../AtlasMain";

export type FolderProps = {
    data: Folder,
    onSelect: (component: FolderComponent, data: Folder) => Promise<any>,
    renderDetails?: boolean
}

export class FolderComponent extends BC<FolderProps, any, any> {

    init() {
        super.init();
        this.appendixAssembly();
        this.pinnedAssembly();
    }

    private onClickTogglePinnedFlagIcon(event: React.MouseEvent<HTMLDivElement>) {
        event.preventDefault();
        event.stopPropagation();
        this.togglePinnedFlag();
    }

    private togglePinnedFlag() {
        AtlasMain.atlas(atlas => {
            atlas.api()?.updateFolder(this.props.data.id, folder => {
                folder.pinned = folder.pinned === undefined ? true : !folder.pinned
                return folder;
            });

            atlas.useVFSFolderView(view => {
                view.rerender("folder-view");
            }, () => {
                // TODO: VFS not opened
                console.error("Cannot rerender 'folder-view' in VFSFolderView, because VFSFolderView isn't opened.");
            })
        });
    }

    private pinnedAssembly() {
        this.assembly.assembly("pinned", (theme, element: SettingsElement) => {
            const isPinned = this.props.data.pinned ?? false;
            return (
                <FlexRow align={Align.CENTER} elements={[
                    <If condition={isPinned} ifTrue={
                        <Icon
                            // tooltip={"Unpin"}
                            icon={<StarRounded/>}
                            onClick={(event) => this.onClickTogglePinnedFlagIcon(event)}
                        />
                    } ifFalse={
                        <Icon
                            // tooltip={"Pin"}
                            icon={<StarRounded/>}
                            uiNoHighlightOnDefault
                            coloredOnDefault={false}
                            onClick={(event) => this.onClickTogglePinnedFlagIcon(event)}
                        />
                    }/>
                ]}/>
            );
        })
    }

    private appendixAssembly() {
        this.assembly.assembly("appendix", (theme, element: SettingsElement) => {
            const renderDetails = this.props.renderDetails ?? true;

            return (
                <FlexRow align={Align.CENTER} gap={theme.gaps.smallGab} elements={[
                    (() => {
                        if (renderDetails) {
                            return (
                                <FlexRow gap={theme.gaps.smallGab} elements={[
                                    <Text
                                        type={TextType.secondaryDescription}
                                        text={getOr(this.props.data.creator, "N/A")}
                                        fontSize={px(11)}
                                    />,
                                    <Text
                                        bold
                                        text={"@"}
                                        coloredText
                                        visualMeaning={VM.UI_NO_HIGHLIGHT}
                                        type={TextType.secondaryDescription}
                                        fontSize={px(11)}
                                    />,
                                    <Text
                                        type={TextType.secondaryDescription}
                                        text={this.props.data.creationDate === undefined ? "N/A" : new Date(this.props.data.creationDate).toLocaleDateString()}
                                        fontSize={px(11)}
                                    />
                                ]}/>
                            );
                        } else return <></>
                    })(),
                    this.a("pinned")
                ]}/>
            );
        })
    }

    componentRender(p: FolderProps, s: any, l: any, t: Themeable.Theme, a: Assembly): JSX.Element | undefined {
        return (
            <SettingsElement
                forceRenderSubpageIcon
                groupDisplayMode
                title={getOr(p.data.title, "N/A")}
                iconConfig={{
                    enable: true,
                    color: p.data.iconColorHEX === undefined ? undefined : Color.ofHex(p.data.iconColorHEX),
                    iconGenerator: element => (
                        <FolderIcon/>
                    )
                }}
                appendixGenerator={element => this.a("appendix")}
                promiseBasedOnClick={element => p.onSelect(this, p.data)}
            />
        );
    }
}
