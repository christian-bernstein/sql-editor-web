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
import {LiteGrid} from "../../components/lo/LiteGrid";
import {Separator} from "../../components/lo/Separator";
import {Orientation} from "../../logic/style/Orientation";

export class BoardingPageV2 extends BernieComponent<any, any, any> {

    constructor() {
        super(undefined, undefined, undefined, {
            deviceRenderSeparation: false,
            enableLocalDialog: true
        });
    }

    private onClick() {
        const theme: Themeable.Theme = utilizeGlobalTheme();

        const StepperComponent: React.FC<{ stepCount: number, onComplete: () => void }> = props => {
            const [step, setStep] = useState(0);

            useEffect(() => {
                const interval = setInterval(() => {
                    if (step === props.stepCount) {
                        props.onComplete();
                    } else {
                        setStep(step + 1);
                    }
                }, 2500);

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

                                    <Box width={percent(100)}>
                                        <FlexBox gap={theme.gaps.smallGab} width={percent(100)}>
                                            <Text text={"Confirm action"} type={TextType.smallHeader}/>
                                            <Text text={"By confirming, all tables will undergo a deep reset. All data *(including metadata)* will be deleted. **This action cannot be undone.**"} type={TextType.secondaryDescription}/>
                                            <LiteGrid columns={2} gap={theme.gaps.smallGab}>
                                                <Button opaque visualMeaning={ObjectVisualMeaning.INFO} width={percent(100)} children={
                                                    <Text text={"yes"} uppercase/>
                                                }/>
                                                <Button width={percent(100)} children={
                                                    <Text text={"no"} uppercase/>
                                                }/>
                                            </LiteGrid>
                                        </FlexBox>
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
                                <StepperComponent stepCount={2} onComplete={() => this.closeLocalDialog()}/>
                            }/>
                        }/>
                    }/>
                </Centered>
            </Screen>
        ));
    }

    componentDidMount() {
        super.componentDidMount();
        this.onClick()
    }

    componentRender(p: any, s: any, l: any, t: Themeable.Theme, a: Assembly): JSX.Element | undefined {
        return (
            <Screen children={
                <Centered fullHeight children={
                    <Button onClick={() => this.onClick()} highlight shrinkOnClick opaque visualMeaning={ObjectVisualMeaning.BETA} children={
                        <Text text={"Open dialog"}/>
                    }/>
                }/>
            }/>
        );
    }
}
