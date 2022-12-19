import {BernieComponent} from "../../logic/BernieComponent";
import {Themeable} from "../../logic/style/Themeable";
import {Assembly} from "../../logic/assembly/Assembly";
import {Screen} from "../../components/lo/Page";
import {AppHeader} from "../../components/lo/AppHeader";
import {FlexBox} from "../../components/lo/FlexBox";
import {FlexDirection} from "../../logic/style/FlexDirection";
import {Icon} from "../../components/lo/Icon";
import {ReactComponent as CloseIcon} from "../../../../assets/icons/ic-20/ic20-close.svg";
import {ReactComponent as LatencyIcon} from "../../../../assets/icons/ic-20/ic20-transaction.svg";
import React from "react";
import {App} from "../../logic/app/App";
import {percent, px} from "../../logic/style/DimensionalMeasured";
import {ElementHeader} from "../../components/lo/ElementHeader";
import {ReactComponent as ServerIcon} from "../../../../assets/icons/ic-20/ic20-dns.svg";
import {Box} from "../../components/lo/Box";
import {ObjectVisualMeaning} from "../../logic/style/ObjectVisualMeaning";
import {Text, TextType} from "../../components/lo/Text";
import {Separator} from "../../components/lo/Separator";
import {ReactComponent as ProtocolIcon} from "../../../../assets/icons/ic-20/ic20-chat.svg";
import {ReactComponent as SSLIcon} from "../../../../assets/icons/ic-20/ic20-protect.svg";
import {LatencyDisplay} from "../../../../tests/chart/LatencyDisplay";
import {Align} from "../../logic/style/Align";
import {If} from "../../components/logic/If";
import {SocketHeartbeat} from "../../components/ho/socketHeartbeat/SocketHeartbeat";
import {OverflowBehaviour} from "../../logic/style/OverflowBehaviour";
import {LiteGrid} from "../../components/lo/LiteGrid";
import {Group} from "../../components/lo/Group";
import {Orientation} from "../../logic/style/Orientation";
import {Button} from "../../components/lo/Button";
import {ReactComponent as LessIcon} from "../../../../assets/icons/ic-20/ic20-chevron-left.svg";
import {Justify} from "../../logic/style/Justify";
import {ReactComponent as MoreIcon} from "../../../../assets/icons/ic-20/ic20-chevron-right.svg";

export class ServerInfoDialog extends BernieComponent<any, any, any> {

    componentDidMount() {
        super.componentDidMount();
        App.app().getConnector().latencyCacheUpdateCallbacks.push(con => {
            this.controller.rerender("latency");
        });
    }

    componentRender(p: any, s: any, l: any, t: Themeable.Theme, a: Assembly): JSX.Element | undefined {
        const con = App.app().getConnector();

        return (
            <Screen>
                <AppHeader title={"Server telemetry"} right={
                    <FlexBox flexDir={FlexDirection.ROW}>
                        <Icon icon={<CloseIcon/>} onClick={() => App.app().callAction("close-main-dialog")}/>
                    </FlexBox>
                }/>



                <FlexBox width={percent(100)} overflowYBehaviour={OverflowBehaviour.SCROLL}>
                    <FlexBox width={percent(100)}>
                        <SocketHeartbeat/>

                        <ElementHeader title={"Telemetry summary"} appendix={
                            <Box opaque visualMeaning={ObjectVisualMeaning.INFO} paddingX={t.paddings.defaultButtonPadding} paddingY={t.paddings.defaultBadgePadding} children={
                                <Text text={"healthy"} uppercase bold fontSize={px(12)}/>
                            }/>
                        }/>

                        <Separator/>

                        <ElementHeader title={"General information"} boldHeader appendix={
                            <Box opaque visualMeaning={ObjectVisualMeaning.INFO} paddingX={t.paddings.defaultButtonPadding} paddingY={t.paddings.defaultBadgePadding} children={
                                <Text text={"ok"} uppercase bold fontSize={px(10)}/>
                            }/>
                        }/>

                        <FlexBox flexDir={FlexDirection.ROW} gap={t.gaps.smallGab}>
                            <Icon icon={<ProtocolIcon/>}/>
                            <Text text={"Current protocol: "} type={TextType.secondaryDescription}/>
                            <Text text={con.currentProtocol}/>
                        </FlexBox>

                        <FlexBox flexDir={FlexDirection.ROW} gap={t.gaps.smallGab}>
                            <Icon icon={<ServerIcon/>}/>
                            <Text text={"Address: "} type={TextType.secondaryDescription}/>
                            <Text text={con.config.address}/>
                        </FlexBox>

                        <FlexBox flexDir={FlexDirection.ROW} align={Align.CENTER} gap={t.gaps.smallGab}>
                            <Icon icon={<SSLIcon/>}/>
                            <Text text={"SSL: "} type={TextType.secondaryDescription}/>
                            <If condition={con.config.ssl} ifTrue={
                                <Text text={"YES"} bold coloredText visualMeaning={ObjectVisualMeaning.SUCCESS}/>
                            } ifFalse={
                                <Text text={"NO"} bold coloredText visualMeaning={ObjectVisualMeaning.WARNING}/>
                            }/>

                        </FlexBox>

                        <Separator/>

                        {this.component(local => {
                            const latencyRecord = con.getLatestLatencyRecord();
                            let avg = 0;
                            con.latencyRecords.map(rec => rec.latency).forEach(lat => avg += lat);
                            avg = avg / con.latencyRecords.length;
                            const ok = latencyRecord !== undefined && latencyRecord.latency < 150 && avg < 150;
                            return (
                                <>
                                    <ElementHeader title={"Latency"} boldHeader appendix={
                                        <If condition={ok} ifFalse={
                                            <Box opaque visualMeaning={ObjectVisualMeaning.WARNING} paddingX={t.paddings.defaultButtonPadding} paddingY={t.paddings.defaultBadgePadding} children={
                                                <Text text={"Within parameters"} uppercase bold fontSize={px(10)}/>
                                            }/>
                                        } ifTrue={
                                            <Box opaque visualMeaning={ObjectVisualMeaning.SUCCESS} paddingX={t.paddings.defaultButtonPadding} paddingY={t.paddings.defaultBadgePadding} children={
                                                <Text text={"ok"} uppercase bold fontSize={px(10)}/>
                                            }/>
                                        }/>
                                    }/>

                                    <FlexBox flexDir={FlexDirection.ROW} gap={t.gaps.smallGab}>
                                        <Icon icon={<LatencyIcon/>}/>
                                        <Text text={"Avg. latency: "} type={TextType.secondaryDescription}/>
                                        <Text text={`${avg.toFixed(2)} ms`}/>
                                    </FlexBox>

                                    <FlexBox flexDir={FlexDirection.ROW} gap={t.gaps.smallGab}>
                                        <Icon icon={<LatencyIcon/>}/>
                                        <Text text={"Latency: "} type={TextType.secondaryDescription}/>
                                        <If condition={latencyRecord === undefined} ifTrue={
                                            <Text text={"N/A"} bold coloredText visualMeaning={ObjectVisualMeaning.WARNING}/>
                                        } ifFalse={
                                            <Text text={`${latencyRecord?.latency} ms`}/>
                                        }/>
                                    </FlexBox>
                                </>
                            );
                        }, "latency")}



                        <LatencyDisplay/>
                    </FlexBox>
                </FlexBox>


            </Screen>
        );
    }
}
