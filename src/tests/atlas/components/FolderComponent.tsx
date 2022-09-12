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

export type FolderProps = {
    data: Folder,
    onSelect: (component: FolderComponent, data: Folder) => Promise<any>
}

export class FolderComponent extends BC<FolderProps, any, any> {

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
                appendixGenerator={element => (
                    <FlexRow gap={t.gaps.smallGab} elements={[
                        <Text
                            type={TextType.secondaryDescription}
                            text={getOr(p.data.creator, "N/A")}
                        />,
                        <Text
                            bold
                            text={"@"}
                            coloredText
                            visualMeaning={VM.UI_NO_HIGHLIGHT}
                            type={TextType.secondaryDescription}
                        />,
                        <Text
                            type={TextType.secondaryDescription}
                            text={p.data.creationDate === undefined ? "N/A" : new Date(p.data.creationDate).toLocaleDateString()}
                        />
                    ]}/>
                )}
                promiseBasedOnClick={element => p.onSelect(this, p.data)}
            />
        );
    }
}
