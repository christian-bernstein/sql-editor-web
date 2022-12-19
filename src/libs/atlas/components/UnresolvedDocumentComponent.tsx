import {BC} from "../../../logic/BernieComponent";
import {SettingsElement} from "../../../components/ho/settingsElement/SettingsElement";
import {Assembly} from "../../../logic/assembly/Assembly";
import {Themeable} from "../../../logic/style/Themeable";
import {FlexRow} from "../../../components/lo/FlexBox";
import {Text} from "../../../components/lo/Text";
import {ObjectVisualMeaning, VM} from "../../../logic/style/ObjectVisualMeaning";
import {px} from "../../../logic/style/DimensionalMeasured";
import {ReactComponent as ErrorIcon} from "../../../assets/icons/ic-20/ic20-warning.svg";
import {AnomalyInfo} from "../../../components/ho/anomalyInfo/AnomalyInfo";
import {AnomalyLevel} from "../../../logic/data/AnomalyLevel";

export type UnresolvedDocumentComponentProps = {
    id: string,
    error: any
}

export class UnresolvedDocumentComponent extends BC<UnresolvedDocumentComponentProps, any, any> {

    componentRender(p: UnresolvedDocumentComponentProps, s: any, l: any, t: Themeable.Theme, a: Assembly): JSX.Element | undefined {
        return (
            <SettingsElement
                forceRenderSubpageIcon
                groupDisplayMode
                visualMeaning={ObjectVisualMeaning.ERROR}
                title={"Unresolved"}
                appendixGenerator={element => (
                    <FlexRow elements={[
                        <Text text={`ID: **${p.id}**`} coloredText visualMeaning={VM.ERROR} fontSize={px(11)}/>
                    ]}/>
                )}
                iconConfig={{
                    enable: true,
                    color: t.colors.errorHighlightColor,
                    iconGenerator: element => (
                        <ErrorIcon/>
                    )
                }}
                promiseBasedOnClick={element => new Promise<void>((resolve, reject) => {
                    this.dialog(
                        <AnomalyInfo anomaly={{
                            level: AnomalyLevel.ERROR,
                            description: `provide a description\n\n${p.error}`,
                            data: p.error
                        }}/>
                    );
                    resolve();
                })}
            />
        );
    }
}
