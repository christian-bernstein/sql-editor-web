import {BC} from "../../sql/logic/BernieComponent";
import {SettingsElement} from "../../sql/components/ho/settingsElement/SettingsElement";
import {Assembly} from "../../sql/logic/assembly/Assembly";
import {Themeable} from "../../sql/logic/style/Themeable";
import {FlexRow} from "../../sql/components/lo/FlexBox";
import {Text} from "../../sql/components/lo/Text";
import {ObjectVisualMeaning, VM} from "../../sql/logic/style/ObjectVisualMeaning";
import {px} from "../../sql/logic/style/DimensionalMeasured";
import {ReactComponent as ErrorIcon} from "../../../assets/icons/ic-20/ic20-warning.svg";
import {AnomalyInfo} from "../../sql/components/ho/anomalyInfo/AnomalyInfo";
import {AnomalyLevel} from "../../sql/logic/data/AnomalyLevel";

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
