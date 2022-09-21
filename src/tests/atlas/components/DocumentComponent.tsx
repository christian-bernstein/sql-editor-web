import {BC} from "../../../logic/BernieComponent";
import {Themeable} from "../../../logic/style/Themeable";
import {Assembly} from "../../../logic/assembly/Assembly";
import {AtlasDocument} from "../data/AtlasDocument";
import {SettingsElement} from "../../../components/ho/settingsElement/SettingsElement";
import {getOr} from "../../../logic/Utils";
import {ReactComponent as DocumentIcon} from "../../../assets/icons/ic-20/ic20-file.svg";
import {StaticDrawerMenu} from "../../../components/lo/StaticDrawerMenu";
import {DocumentPreview} from "./DocumentPreview";
import {AtlasMain} from "../AtlasMain";
import {percent} from "../../../logic/style/DimensionalMeasured";
import {Color} from "../../../logic/style/Color";

export type DocumentComponentProps = {
    data: AtlasDocument
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
                this.dialog(
                    <StaticDrawerMenu maxHeight={percent(85)} body={() => (
                        <DocumentPreview data={refreshedData}/>
                    )}/>
                );
                resolve();
            } catch (e) {
                reject(e);
            }
        })
    }

    componentRender(p: DocumentComponentProps, s: any, l: any, t: Themeable.Theme, a: Assembly): JSX.Element | undefined {
        return (
            <SettingsElement
                groupDisplayMode
                forceRenderSubpageIcon
                title={getOr(p.data.title, "N/A")}
                iconConfig={{
                    enable: true,
                    color: p.data.iconColorHEX === undefined ? undefined : Color.ofHex(p.data.iconColorHEX),
                    iconGenerator: element => (
                        <DocumentIcon/>
                    )
                }}
                promiseBasedOnClick={element => this.onClick(element)}
            />
        );
    }
}
