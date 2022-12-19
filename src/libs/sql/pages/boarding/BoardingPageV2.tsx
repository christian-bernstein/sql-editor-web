import {BernieComponent} from "../../logic/BernieComponent";
import {Themeable} from "../../logic/style/Themeable";
import {Assembly} from "../../logic/assembly/Assembly";
import {Screen} from "../../components/lo/Page";
import {Centered} from "../../components/lo/PosInCenter";
import {Button} from "../../components/lo/Button";
import {Text, TextType} from "../../components/lo/Text";
import {ObjectVisualMeaning} from "../../logic/style/ObjectVisualMeaning";
import {FlexBox} from "../../components/lo/FlexBox";
import React, {useEffect, useState} from "react";
import {Dimension} from "../../logic/style/Dimension";
import {DimensionalMeasured, percent, px} from "../../logic/style/DimensionalMeasured";
import {LinearProgress, Step as MUIStep, StepContent, StepLabel, Stepper} from "@mui/material";
import {Cursor} from "../../logic/style/Cursor";
import {arrayFactory, Utils} from "../../logic/Utils";
import {Default, Mobile} from "../../components/logic/Media";
import {utilizeGlobalTheme} from "../../logic/app/App";
import {AppHeader} from "../../components/lo/AppHeader";
import {ConfirmationBox} from "../../components/ho/confirmationBox/ConfirmationBox";
import {Justify} from "../../logic/style/Justify";
import {Align} from "../../logic/style/Align";
import {AF} from "../../components/logic/ArrayFragment";
import {Environment} from "../../logic/Environment";
import {FlexDirection} from "../../logic/style/FlexDirection";
import {Box} from "../../components/lo/Box";
import {Separator} from "../../components/lo/Separator";
import {Orientation} from "../../logic/style/Orientation";
import {LiteGrid} from "../../components/lo/LiteGrid";
import styled from "styled-components";
import {OverflowBehaviour} from "../../logic/style/OverflowBehaviour";
import {If} from "../../components/logic/If";

export type SysVolumeChangePacketData = {
    toggleMute: boolean,
    mute: boolean,
    soundOffset: number,
}

export type PerformanceStats = {
    cpuLoad: number,
    physicalRam: number,
    freeRam: number,
    gpuPowerDraw: number,
    gpuPowerLimit: number,
    gpuPowerMaxLimit: number,
    gpuPowerMinLimit: number,
    gpuFanSpeedPercentage: number,
    gpuUtilization: number,
    avgFPS: number,
    gpuCoreTemp: number,
    outputAudioVolume: number,
    outputAudioMute: number
}
export const NoConnectionDialog: React.FC = props => {
    return (
        <Screen style={{
            backgroundColor: "transparent",
        }} children={
            <Centered fullHeight children={
                <Text text={"No connection"}/>
            }/>
        }/>
    );
}

export const PerformanceContext = React.createContext<PerformanceStats | undefined>(undefined);

export class BoardingPageV2 extends BernieComponent<any, any, any> {

    constructor() {
        super(undefined, undefined, undefined, {
            deviceRenderSeparation: false,
            enableLocalDialog: true
        });
    }

    private onClick() {
        const theme: Themeable.Theme = utilizeGlobalTheme();

        const confBox = (
            <ConfirmationBox fullSize title={"Open loading screen"} description={"Cool description!"} confirmationVM={ObjectVisualMeaning.ERROR} onSubmit={checked => {
                this.closeLocalDialog();
                if (checked) {
                    setTimeout(() => {
                        const StepperComponent: React.FC<{ stepCount: number, onComplete: () => void }> = props => {
                            const [step, setStep] = useState(0);

                            useEffect(() => {
                                const interval = setInterval(() => {
                                    if (step === props.stepCount) {
                                        props.onComplete();
                                    } else {
                                        setStep(step + 1);
                                    }
                                }, 1000);

                                return () => {
                                    clearInterval(interval);
                                }
                            }, [step, setStep]);

                            return (
                                <Stepper activeStep={step} orientation={"vertical"} sx={{width: "100%"}} children={
                                    arrayFactory(i => (
                                        <MUIStep key={String(i)}>
                                            <StepLabel optional={
                                                <Text fontSize={px(11)} text={"success"} uppercase visualMeaning={ObjectVisualMeaning.SUCCESS} coloredText/>
                                            } children={
                                                <Text bold fontSize={px(13)} text={"step.title"} cursor={Cursor.pointer}/>
                                            }/>
                                            <StepContent children={
                                                <FlexBox width={percent(100)}>
                                                    <Box arrow={{bgColor: theme.colors.backgroundHighlightColor, enable: true}} height={px(200)} width={percent(100)}>

                                                    </Box>
                                                </FlexBox>
                                            }/>
                                        </MUIStep>
                                    ), props.stepCount)
                                }/>
                            );
                        }

                        this.openLocalDialog(component => (
                            <Screen style={{backgroundColor: "transparent"}}>
                                <AppHeader title={"Loading.."}/>
                                <Centered fullHeight>
                                    <Default children={
                                        <FlexBox width={percent(25)} height={DimensionalMeasured.of(100, Dimension.vh)} children={
                                            <Centered fullHeight children={
                                                <StepperComponent stepCount={2} onComplete={() => this.closeLocalDialog()}/>
                                            }/>
                                        }/>
                                    }/>
                                    <Mobile children={
                                        <FlexBox width={percent(100)} padding paddingX={theme.gaps.defaultGab} height={DimensionalMeasured.of(100, Dimension.vh)} children={
                                            <Centered fullHeight children={
                                                <StepperComponent stepCount={2} onComplete={() => {
                                                    this.closeLocalDialog();
                                                }}/>
                                            }/>
                                        }/>
                                    }/>
                                </Centered>
                            </Screen>
                        ));
                    }, 100);
                }
            }}/>
        );

        this.dialog(
            <FlexBox width={percent(100)} padding justifyContent={Justify.CENTER} align={Align.CENTER} children={
                <AF elements={[
                    <Default children={
                        <FlexBox width={percent(70)} children={confBox}/>
                    }/>,
                    <Mobile children={confBox}/>
                ]}/>
            }/>
        );
    }

    componentDidMount() {
        super.componentDidMount();
    }

    private server(): Environment.Connector {
        return Environment.Connector.useConnector("desktop-server", () => new Environment.Connector({
            id: "desktop-server",
            ssl: false,
            address: "ws://192.168.178.20:25565",
            connectionRetryDelayFunc: i => 0,
            maxConnectAttempts: 10,
            onError: () => {},
            onConnectionFailed: () => {
                this.dialog(
                    <NoConnectionDialog/>
                );
            },
            protocol: "base",
            packetInterceptor: () => {}
        })).registerSocketEventHandler(Environment.SocketEventTypes.ON_OPEN, {
            stator: true,
            handle: () => {
                this.closeLocalDialog();
            }
        })
    }

    componentRender(p: any, s: any, l: any, t: Themeable.Theme, a: Assembly): JSX.Element | undefined {


        const ConnectorComponent: React.FC = props => {
            const [state, setState] = useState<PerformanceStats | undefined>(undefined);

            useEffect(() => {
                this.server().registerProtocolPacketHandler("base", "PerformanceStatsPacketData", {
                    handle: (connector, packet) => {
                        setState(packet.data as PerformanceStats);
                    }
                }).connect();
            });

            const Grid = styled.div`
              box-sizing: border-box;
              width: 100%;
              height: 100vh;
              display: grid;
              grid-gap: ${t.gaps.smallGab.css()};
              grid-template-columns: repeat(4, minmax(auto, 25%));
              grid-template-rows: repeat(2, minmax(auto, 50%));
              overflow: hidden;
            `;

            if (state !== undefined) {
                const usedRam = state.physicalRam - state.freeRam;
                const ramPercentage = (usedRam / state.physicalRam) * 100;
                const gpuPowerPercentage = (state.gpuPowerDraw / state.gpuPowerLimit) * 100;
                return (
                    <PerformanceContext.Provider value={state}>
                        <Grid>
                            <Button vibrateOnClick onClick={() => this.onClick()} highlight shrinkOnClick opaque visualMeaning={ObjectVisualMeaning.BETA} children={
                                <Text text={"Open dialog"}/>
                            }/>

                            <Box>
                                <FlexBox>
                                    <FlexBox width={percent(100)} flexDir={FlexDirection.ROW} justifyContent={Justify.SPACE_BETWEEN} align={Align.CENTER}>
                                        <Text text={"CPU"} bold/>
                                        <Text text={`${state.cpuLoad}%`} type={TextType.secondaryDescription}/>
                                    </FlexBox>
                                    <LinearProgress key={"cpu"} variant={"determinate"} color={(() => {
                                        if (state.cpuLoad >= 70 && state.cpuLoad < 90) {
                                            return "warning";
                                        } else if (state.cpuLoad >= 90) {
                                            return "error";
                                        } else {
                                            return "primary";
                                        }
                                    })()} sx={{width: "100%"}} value={state.cpuLoad}/>
                                </FlexBox>
                            </Box>

                            <Box>
                                <FlexBox>
                                    <FlexBox width={percent(100)} flexDir={FlexDirection.ROW} justifyContent={Justify.SPACE_BETWEEN} align={Align.CENTER}>
                                        <Text text={"RAM"} bold/>
                                        <Text text={`(*${Utils.humanFileSize(state.physicalRam)}*) ${ramPercentage.toFixed(1)}%`} type={TextType.secondaryDescription}/>
                                    </FlexBox>
                                    <LinearProgress variant={"determinate"} color={"info"} sx={{width: "100%"}} value={ramPercentage}/>
                                    <FlexBox width={percent(100)} flexDir={FlexDirection.ROW} justifyContent={Justify.SPACE_BETWEEN} align={Align.CENTER}>
                                        <Text text={`${Utils.humanFileSize(usedRam)} used`} whitespace={"nowrap"} type={TextType.secondaryDescription}/>
                                        <Separator orientation={Orientation.HORIZONTAL}/>
                                        <Text text={`*${ramPercentage.toFixed(2)}%*`} whitespace={"nowrap"} type={TextType.secondaryDescription}/>
                                        <Separator orientation={Orientation.HORIZONTAL}/>
                                        <Text text={`${Utils.humanFileSize(state.freeRam)} free`} whitespace={"nowrap"} type={TextType.secondaryDescription}/>
                                    </FlexBox>
                                </FlexBox>
                            </Box>


                            <Box>
                                <FlexBox>
                                    <FlexBox width={percent(100)} flexDir={FlexDirection.ROW} justifyContent={Justify.SPACE_BETWEEN} align={Align.CENTER}>
                                        <Text text={"GPU"} bold/>
                                        <Text text={`${state.gpuUtilization.toFixed(1)}%`} type={TextType.secondaryDescription}/>
                                    </FlexBox>
                                    <LinearProgress variant={"determinate"} color={"info"} sx={{width: "100%"}} value={state.gpuUtilization}/>
                                </FlexBox>
                            </Box>

                            <Box>
                                <FlexBox>
                                    <FlexBox width={percent(100)} flexDir={FlexDirection.ROW} justifyContent={Justify.SPACE_BETWEEN} align={Align.CENTER}>
                                        <Text text={"GPU fan"} bold/>
                                        {
                                            state.gpuFanSpeedPercentage === 0 ? (
                                                <Text text={`off`} uppercase bold coloredText visualMeaning={ObjectVisualMeaning.ERROR} type={TextType.secondaryDescription}/>
                                            ) : (
                                                <Text text={`${state.gpuFanSpeedPercentage.toFixed(1)}%`} type={TextType.secondaryDescription}/>
                                            )
                                        }
                                    </FlexBox>
                                    <LinearProgress variant={"determinate"} color={state.gpuFanSpeedPercentage === 0 ? "inherit" : "info"} sx={{width: "100%"}} value={state.gpuFanSpeedPercentage}/>

                                </FlexBox>
                            </Box>

                            <Box overflowXBehaviour={OverflowBehaviour.HIDDEN}>
                                <FlexBox>
                                    <FlexBox width={percent(100)} flexDir={FlexDirection.ROW} justifyContent={Justify.SPACE_BETWEEN} align={Align.CENTER}>
                                        <Text text={"GPU power"} bold/>
                                        <Text text={`(*${state.gpuPowerDraw}W*) ${gpuPowerPercentage.toFixed(1)}%`} type={TextType.secondaryDescription}/>
                                    </FlexBox>
                                    <LinearProgress variant={"determinate"} color={"info"} sx={{width: "100%"}} value={gpuPowerPercentage}/>
                                    <FlexBox width={percent(100)} flexDir={FlexDirection.ROW} justifyContent={Justify.SPACE_BETWEEN} align={Align.CENTER}>
                                        <Text text={`**${state.gpuPowerDraw.toFixed(2)}W**`} whitespace={"nowrap"} type={TextType.secondaryDescription}/>
                                        <Separator orientation={Orientation.HORIZONTAL}/>
                                        <Text text={`*${gpuPowerPercentage.toFixed(2)}%*`} whitespace={"nowrap"} type={TextType.secondaryDescription}/>
                                        <Separator orientation={Orientation.HORIZONTAL}/>
                                        <Text text={`**${state.gpuPowerLimit}W**`} whitespace={"nowrap"} type={TextType.secondaryDescription}/>
                                    </FlexBox>
                                </FlexBox>
                            </Box>

                            {(() => {
                                const muted = state.outputAudioMute === 1;

                                return (
                                    <Box>
                                        <LiteGrid height={percent(100)} rows={2}>
                                            <FlexBox width={percent(100)}>
                                                <FlexBox width={percent(100)} flexDir={FlexDirection.ROW} justifyContent={Justify.SPACE_BETWEEN}>
                                                    <Text text={"Volume"} bold/>
                                                    <FlexBox flexDir={FlexDirection.ROW} align={Align.CENTER}>
                                                        <If condition={muted} ifTrue={
                                                            <Text text={"muted"} coloredText visualMeaning={ObjectVisualMeaning.ERROR} bold uppercase type={TextType.secondaryDescription}/>
                                                        }/>
                                                        <Text text={`${state.outputAudioVolume}%`} type={TextType.secondaryDescription}/>
                                                    </FlexBox>

                                                </FlexBox>
                                                <LinearProgress variant={"determinate"} color={muted ? "error" : "info"} sx={{width: "100%"}} value={state.outputAudioVolume}/>
                                            </FlexBox>

                                            <LiteGrid gap={t.gaps.smallGab} columns={3}>
                                                <Button onClick={() => {
                                                    this.server().singleton({
                                                        protocol: "main",
                                                        packetID: "SysVolumeChangePacketData",
                                                        data: {
                                                            mute: false,
                                                            toggleMute: false,
                                                            soundOffset: -1
                                                        } as SysVolumeChangePacketData
                                                    });
                                                }} children={
                                                    <Text text={"-1"}/>
                                                }/>
                                                <Button onClick={() => {
                                                    this.server().singleton({
                                                        protocol: "main",
                                                        packetID: "SysVolumeChangePacketData",
                                                        data: {
                                                            mute: true,
                                                            toggleMute: false,
                                                            soundOffset: 0
                                                        } as SysVolumeChangePacketData
                                                    });
                                                }} children={
                                                    <Text text={"mute"}/>
                                                }/>
                                                <Button onClick={() => {
                                                    this.server().singleton({
                                                        protocol: "main",
                                                        packetID: "SysVolumeChangePacketData",
                                                        data: {
                                                            mute: false,
                                                            toggleMute: false,
                                                            soundOffset: +1
                                                        } as SysVolumeChangePacketData
                                                    });
                                                }} children={
                                                    <Text text={"+1"}/>
                                                }/>
                                            </LiteGrid>
                                        </LiteGrid>
                                    </Box>
                                );
                            })()}
                        </Grid>
                    </PerformanceContext.Provider>
                );
            } else return (
                <></>
            )
        }

        return (
            <Screen children={
                <Centered fullHeight children={
                    <FlexBox align={Align.CENTER} padding={false} height={percent(100)} width={percent(100)} justifyContent={Justify.CENTER}>
                        <ConnectorComponent/>
                    </FlexBox>
                }/>
            }/>
        );
    }
}
