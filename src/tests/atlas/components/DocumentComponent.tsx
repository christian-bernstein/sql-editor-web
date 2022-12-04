import {BC} from "../../../logic/BernieComponent";
import {Themeable} from "../../../logic/style/Themeable";
import {Assembly} from "../../../logic/assembly/Assembly";
import {AtlasDocument} from "../data/AtlasDocument";
import {SettingsElement} from "../../../components/ho/settingsElement/SettingsElement";
import {getOr} from "../../../logic/Utils";
import {StaticDrawerMenu} from "../../../components/lo/StaticDrawerMenu";
import {DocumentPreview} from "./DocumentPreview";
import {AtlasMain} from "../AtlasMain";
import {percent} from "../../../logic/style/DimensionalMeasured";
import {Color} from "../../../logic/style/Color";
import {FlexRow} from "../../../components/lo/FlexBox";
import {Align} from "../../../logic/style/Align";
import {If} from "../../../components/logic/If";
import {Icon} from "../../../components/lo/Icon";
import {FiberPinRounded, PinDropRounded, PinRounded, StarRounded} from "@mui/icons-material";
import {BadgeMark} from "@mui/material";

export type DocumentComponentProps = {
    data: AtlasDocument
    onSelect?: (element: SettingsElement, data: AtlasDocument) => "break" | "open-local-document-view",
    appendix?: ((element: SettingsElement) => JSX.Element) | undefined
}

export type DocumentComponentLocalState = {
    data: AtlasDocument
}

export class DocumentComponent extends BC<DocumentComponentProps, any, DocumentComponentLocalState> {

    constructor(props: DocumentComponentProps) {
        super(props, undefined, {
            data: props.data
        });
    }

    init() {
        super.init();
        this.appendixAssembly();
        this.pinnedAssembly();
    }

    private getDocumentData(refresh: boolean = false): AtlasDocument {
        if (refresh) {
            AtlasMain.atlas(atlas => {
                this.local.setStateWithChannels({
                    data: atlas.api().getDocument(this.props.data.id)
                }, ["document-data-refresh"]);
            });
        }
        return this.local.state.data;
    }

    private onClick(element: SettingsElement): Promise<void> {
        return new Promise<void>((resolve, reject) => {
            try {
                const refreshedData = this.getDocumentData(true);
                if (this.props.onSelect?.(element, refreshedData) === "open-local-document-view") {
                    this.dialog(
                        <StaticDrawerMenu maxHeight={percent(85)} body={() => (
                            <DocumentPreview data={refreshedData}/>
                        )}/>
                    );
                }
                resolve();
            } catch (e) {
                reject(e);
            }
        })
    }

    private togglePinnedFlag() {
        // TODO: Implement
    }

    private pinnedAssembly() {
        this.assembly.assembly("pinned", (theme, element: SettingsElement) => {
            const isPinned = this.ls().data.pinned ?? false;
            return (
                <FlexRow align={Align.CENTER} elements={[
                    <If condition={isPinned} ifTrue={
                        <Icon
                            tooltip={"Unpin"}
                            icon={<StarRounded/>}
                            onClick={() => this.togglePinnedFlag()}
                        />
                    } ifFalse={
                        <Icon
                            tooltip={"Pin"}
                            icon={<StarRounded/>}
                            uiNoHighlightOnDefault
                            coloredOnDefault={false}
                            onClick={() => this.togglePinnedFlag()}
                        />
                    }/>
                ]}/>
            );
        })
    }

    private appendixAssembly() {
        this.assembly.assembly("appendix", (theme, element: SettingsElement) => {
            return (
                <FlexRow align={Align.CENTER} gap={theme.gaps.smallGab} elements={[
                    this.props.appendix?.(element) ?? <></>,
                    this.a("pinned")
                ]}/>
            );
        })
    }

    // TODO: Replace with own implementation -> No SettingsElement -> Something with the icon hit box is off while using SettingsElement appendix
    componentRender(p: DocumentComponentProps, s: any, l: any, t: Themeable.Theme, a: Assembly): JSX.Element | undefined {
        return (
            <SettingsElement
                groupDisplayMode
                forceRenderSubpageIcon
                title={getOr(p.data.title, "N/A")}
                iconConfig={{
                    enable: true,
                    color: p.data.iconColorHEX === undefined ? undefined : Color.ofHex(p.data.iconColorHEX),
                    iconGenerator: element => AtlasMain.atlas().getIconFromLookup(p.data.icon ?? { dict: "atlas", id: "generic-file" })
                }}
                promiseBasedOnClick={element => this.onClick(element)}
                appendixGenerator={element => this.a("appendix", element)}
            />
        );
    }
}
