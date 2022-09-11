import {BC} from "../../../logic/BernieComponent";
import {Themeable} from "../../../logic/style/Themeable";
import {Assembly} from "../../../logic/assembly/Assembly";
import {AtlasDocument} from "../data/AtlasDocument";
import {SettingsElement} from "../../../components/ho/settingsElement/SettingsElement";
import {getOr} from "../../../logic/Utils";
import {ReactComponent as DocumentIcon} from "../../../assets/icons/ic-20/ic20-file.svg";

export type DocumentComponentProps = {
    data: AtlasDocument
}

export class DocumentComponent extends BC<DocumentComponentProps, any, any> {

    componentRender(p: DocumentComponentProps, s: any, l: any, t: Themeable.Theme, a: Assembly): JSX.Element | undefined {
        return (
            <SettingsElement
                groupDisplayMode
                forceRenderSubpageIcon
                title={getOr(p.data.title, "N/A")}
                iconConfig={{
                    enable: true,
                    iconGenerator: element => (
                        <DocumentIcon/>
                    )
                }}
            />
        );
    }
}
