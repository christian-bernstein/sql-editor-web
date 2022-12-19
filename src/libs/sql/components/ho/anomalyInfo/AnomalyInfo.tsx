import {BernieComponent} from "../../../logic/BernieComponent";
import {Themeable} from "../../../logic/style/Themeable";
import {Assembly} from "../../../logic/assembly/Assembly";
import {Flex} from "../../lo/FlexBox";
import {percent, px} from "../../../logic/style/DimensionalMeasured";
import {Align} from "../../../logic/style/Align";
import {Badge} from "../../lo/Badge";
import {ObjectVisualMeaning, VM} from "../../../logic/style/ObjectVisualMeaning";
import {Text, TextType} from "../../lo/Text";
import {createMargin} from "../../../logic/style/Margin";
import {FlexDirection} from "../../../logic/style/FlexDirection";
import {HOCWrapper} from "../../HOCWrapper";
import {AF} from "../../logic/ArrayFragment";
import {Cursor} from "../../../logic/style/Cursor";
import {StaticDrawerMenu} from "../../lo/StaticDrawerMenu";
import {Dot} from "../../lo/Dot";
import {Console} from "console-feed";
import React from "react";
import {AppAnomalyData} from "../../../logic/data/AppAnomalyData";
import {If} from "../../logic/If";
import {AnomalyLevel} from "../../../logic/data/AnomalyLevel";
import {getOr} from "../../../logic/Utils";

export type AnomalyInfoProps = {
    anomaly: AppAnomalyData,
    mapDescriptionVMToAnomalyLevel?: boolean
}

export class AnomalyInfo extends BernieComponent<AnomalyInfoProps, any, any> {

    init() {
        super.init();
        this.badgeAssembly();
    }

    private badgeAssembly() {
        this.assembly.assembly("badge", (theme, level: AnomalyLevel) => {
            switch (level) {
                case AnomalyLevel.DEBUG:
                    return Badge.badge("debug", {
                        visualMeaning: ObjectVisualMeaning.BETA
                    });
                case AnomalyLevel.INFO:
                    return Badge.badge("info", {
                        visualMeaning: ObjectVisualMeaning.UI_NO_HIGHLIGHT
                    });
                case AnomalyLevel.WARN:
                    return Badge.badge("warn", {
                        visualMeaning: ObjectVisualMeaning.WARNING
                    });
                case AnomalyLevel.ERROR:
                    return Badge.badge("error", {
                        visualMeaning: ObjectVisualMeaning.ERROR
                    });
                case AnomalyLevel.CRITICAL:
                    return Badge.badge("critical", {
                        visualMeaning: ObjectVisualMeaning.ERROR
                    });
            }
        });
    }

    private anomalyLevelToVisualMeaning(level: AnomalyLevel): VM {
        switch (level) {
            case AnomalyLevel.DEBUG:
                return VM.BETA;
            case AnomalyLevel.INFO:
                return VM.UI_NO_HIGHLIGHT;
            case AnomalyLevel.WARN:
                return VM.WARNING;
            case AnomalyLevel.ERROR:
                return VM.ERROR;
            case AnomalyLevel.CRITICAL:
                return VM.ERROR;
        }
    }

    componentRender(p: AnomalyInfoProps, s: any, l: any, t: Themeable.Theme, a: Assembly): JSX.Element | undefined {
        return (
            <StaticDrawerMenu body={props => {
                return (
                    <Flex width={percent(100)} align={Align.CENTER}>
                        {this.a("badge", p.anomaly.level)}

                        <Flex width={percent(100)} align={Align.CENTER} gap={t.gaps.smallGab}>
                            <Text text={"Anomaly detected"} type={TextType.smallHeader}/>
                            <Text text={"The system detected an anomaly\nA detailed description is provided below"} fontSize={px(11)} type={TextType.secondaryDescription} align={Align.CENTER}/>
                        </Flex>

                        <If condition={p.anomaly.description !== undefined} ifTrue={
                            <Text
                                align={Align.CENTER}
                                margin={createMargin(40, 0, 40, 0)}
                                text={p.anomaly.description as string}
                                visualMeaning={getOr(p.mapDescriptionVMToAnomalyLevel, false) ? this.anomalyLevelToVisualMeaning(getOr(p.anomaly.level, AnomalyLevel.INFO)) : VM.ERROR}
                                coloredText={getOr(p.anomaly.level, AnomalyLevel.INFO) !== AnomalyLevel.INFO}
                            />
                        } ifFalse={
                            <Text
                                align={Align.CENTER}
                                margin={createMargin(40, 0, 40, 0)}
                                text={"// No description provided"}
                                visualMeaning={ObjectVisualMeaning.UI_NO_HIGHLIGHT}
                                coloredText
                            />
                        }/>

                        <Flex flexDir={FlexDirection.ROW} align={Align.CENTER} children={
                            <HOCWrapper body={wrapper => (
                                <AF elements={[
                                    <Text text={"Report issue"} cursor={Cursor.pointer} bold coloredText visualMeaning={ObjectVisualMeaning.UI_NO_HIGHLIGHT} highlight align={Align.CENTER} onClick={() => {

                                        // todo implement report function
                                        wrapper.dialog(
                                            <StaticDrawerMenu body={p => (
                                                <>report...</>
                                            )}/>
                                        );
                                    }}/>,

                                    <Dot/>,

                                    <Text text={"Stacktrace"} cursor={Cursor.pointer} bold coloredText visualMeaning={ObjectVisualMeaning.UI_NO_HIGHLIGHT} highlight align={Align.CENTER} onClick={() => {
                                        wrapper.dialog(
                                            <Console logs={[{
                                                data: [new Error().stack],
                                                method: "error",
                                                id: "error"
                                            }]}/>
                                        );
                                    }}/>,
                                ]}/>
                            )}/>
                        }/>
                    </Flex>
                );
            }}/>
        );
    }

}
