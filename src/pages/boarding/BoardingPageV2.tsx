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
import {Step as MUIStep, StepContent, StepLabel, Stepper} from "@mui/material";
import {Cursor} from "../../logic/style/Cursor";
import {arrayFactory} from "../../logic/Utils";
import {Box} from "../../components/lo/Box";
import {Default, Mobile} from "../../components/logic/Media";
import {utilizeGlobalTheme} from "../../logic/app/App";
import {AppHeader} from "../../components/lo/AppHeader";
import {ConfirmationBox} from "../../components/ho/confirmationBox/ConfirmationBox";
import {Justify} from "../../logic/style/Justify";
import {Align} from "../../logic/style/Align";
import {AF} from "../../components/logic/ArrayFragment";
import {Environment} from "../../logic/Environment";

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

        this._openLocalDialog(
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
        this.onClick();
    }

    componentRender(p: any, s: any, l: any, t: Themeable.Theme, a: Assembly): JSX.Element | undefined {
        const ConnectorComponent: React.FC = props => {
            const [state, setState] = useState<string | undefined>(undefined);

            useEffect(() => {
                Environment.Connector.useConnector("desktop-server", () => new Environment.Connector({
                    id: "desktop-server",
                    ssl: false,
                    address: "ws://192.168.178.20:25565",
                    connectionRetryDelayFunc: i => 0,
                    maxConnectAttempts: 1,
                    onError: () => {},
                    onConnectionFailed: () => {},
                    protocol: "base",
                    packetInterceptor: packet => {}
                })).registerProtocolPacketHandler("base", "StringPacketData", {
                    handle: (connector, packet) => {
                        console.log(".");
                        setState(packet.data.string);
                    }
                }).connect();
            });

            return (
                <Text text={`${state}%`} type={TextType.secondaryDescription}/>
            );
        }

        return (
            <Screen children={
                <Centered fullHeight children={
                    <FlexBox align={Align.CENTER} justifyContent={Justify.CENTER}>
                        <Button vibrateOnClick onClick={() => this.onClick()} highlight shrinkOnClick opaque visualMeaning={ObjectVisualMeaning.BETA} children={
                            <Text text={"Open dialog"}/>
                        }/>

                        <ConnectorComponent/>
                    </FlexBox>
                }/>
            }/>
        );
    }
}
