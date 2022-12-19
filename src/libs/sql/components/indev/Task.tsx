import React from "react";
import {Box} from "../lo/Box";
import {TaskInformation} from "../../logic/data/TaskInformation";
import {Text, TextType} from "../lo/Text";
import {Step, StepConnector, stepConnectorClasses, StepContent, StepIconProps, StepLabel, Stepper} from "@mui/material";
import {v4} from "uuid";
import {Themeable} from "../../logic/style/Themeable";
import {utilizeGlobalTheme} from "../../logic/app/App";
import {styled} from "@mui/material/styles";
import {Check} from "@mui/icons-material";
import {px} from "../../logic/style/DimensionalMeasured";

export type TaskProps = {
    task: TaskInformation
}

export class Task extends React.Component<TaskProps, any> {

    constructor(props: TaskProps) {
        super(props);
    }

    render() {
        const globalTheme: Themeable.Theme = utilizeGlobalTheme();

        const QontoConnector = styled(StepConnector)(({ theme }) => ({

            [`&.${stepConnectorClasses.root}`]: {
                // marginLeft: '0px'
                marginLeft: '10px',
                width: "2px",
            },

            [`&.${stepConnectorClasses.alternativeLabel}`]: {
                top: 10,
                left: 'calc(-50% + 16px)',
                right: 'calc(50% + 16px)',
            },
            [`&.${stepConnectorClasses.active}`]: {
                [`& .${stepConnectorClasses.line}`]: {
                    borderColor: globalTheme.colors.primaryHighlightColor.css(),
                },
            },
            [`&.${stepConnectorClasses.completed}`]: {
                [`& .${stepConnectorClasses.line}`]: {
                    borderColor: globalTheme.colors.primaryHighlightColor.css(),
                },
            },
            [`& .${stepConnectorClasses.line}`]: {
                borderColor: theme.palette.mode === 'dark' ? theme.palette.grey[800] : '#eaeaf0',
                borderTopWidth: 3,
                left: '100px',
                // borderRadius: 1,
                marginLeft: '0px'
            },
        }));

        const QontoStepIconRoot = styled('div')<{ ownerState: { active?: boolean } }>(({ theme, ownerState }) => ({
                color: theme.palette.mode === 'dark' ? theme.palette.grey[700] : '#eaeaf0',
                display: 'flex',
                height: 22,
                width: 22,
                justifyContent: "center",
                alignItems: 'center',
                ...(ownerState.active && {
                    color: globalTheme.colors.primaryHighlightColor.css(),
                }),
                '& .QontoStepIcon-completedIcon': {
                    color: globalTheme.colors.primaryHighlightColor.css(),
                    zIndex: 1,
                    fontSize: 18,
                },
                '& .QontoStepIcon-circle': {
                    width: 8,
                    height: 8,
                    borderRadius: '50%',
                    backgroundColor: 'currentColor',
                },
            }),
        );

        function QontoStepIcon(props: StepIconProps) {
            const { active, completed, className } = props;

            return (
                <QontoStepIconRoot ownerState={{ active }} className={className}>
                    {completed ? (
                        <Check className="QontoStepIcon-completedIcon" />
                    ) : (
                        <div className="QontoStepIcon-circle" />
                    )}
                </QontoStepIconRoot>
            );
        }

        return (
            <Box gapY={globalTheme.gaps.defaultGab}>
                <Text text={"Populate initial template data"}/>
                <Text text={"Learn SQL in our interactive editor and create powerful projects"}/>
                <Text text={"10.11.2021, 18:31"} type={TextType.secondaryDescription}/>
                <Stepper alternativeLabel={false} orientation={"vertical"} activeStep={1} connector={<QontoConnector/>}>
                    {['Select campaign settings', 'Create an ad group', 'Create an ad'].map(value => (
                        <Step key={v4()}>
                            <StepLabel StepIconComponent={QontoStepIcon}>
                                <Text text={value}/>
                            </StepLabel>
                            <StepContent style={{marginLeft: "10px"}}>
                                <Text text={value} type={TextType.secondaryDescription} fontSize={px(10)}/>
                            </StepContent>
                        </Step>
                    ))}
                </Stepper>
            </Box>
        );
    }
}
