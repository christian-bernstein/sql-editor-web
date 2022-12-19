import React from "react";
import {Box} from "../../components/lo/Box";
import {AppConfig} from "../../logic/app/AppConfig";
import {Text, TextType} from "../../components/lo/Text";
import {ObjectJSONDisplay} from "../../components/ho/objectJSONDisplay/ObjectJSONDisplay";
import {Button} from "../../components/lo/Button";
import {Dimension} from "../../logic/style/Dimension";
import {dimension, DimensionalMeasured, percent, px} from "../../logic/style/DimensionalMeasured";
import {ObjectVisualMeaning} from "../../logic/style/ObjectVisualMeaning";
import {ReactComponent as ConfigIcon} from "../../../../assets/icons/ic-20/ic20-dns.svg";
import {ReactComponent as ExpandIcon} from "../../../../assets/icons/ic-20/ic20-chevron-down.svg";
import {InformationBox} from "../../components/ho/informationBox/InformationBox";
import {FlexBox} from "../../components/lo/FlexBox";
import {FlexDirection} from "../../logic/style/FlexDirection";
import {Justify} from "../../logic/style/Justify";
import {Icon} from "../../components/lo/Icon";
import {utilizeGlobalTheme} from "../../logic/app/App";
import {Align} from "../../logic/style/Align";
import {Separator} from "../../components/lo/Separator";
import {Orientation} from "../../logic/style/Orientation";
import {OverflowBehaviour} from "../../logic/style/OverflowBehaviour";
import {Accordion, AccordionDetails, AccordionSummary} from "@mui/material";

export type AppConfigSelectionData = {
    config: AppConfig,
    title: string,
    description: string,
}

export type AppConfigSelectorProps = {
    data: AppConfigSelectionData,
    onSelection: (data: AppConfigSelectionData) => void
}

export class AppConfigSelector extends React.Component<AppConfigSelectorProps, any> {

    private static circle(): JSX.Element {
        return (
            <svg viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                <circle cx="10" cy="10" r="5"/>
            </svg>
        );
    }

    render() {
        const visualMeaning: ObjectVisualMeaning = ObjectVisualMeaning.INFO;
        const theme = utilizeGlobalTheme();
        return (
            <Box width={DimensionalMeasured.of(100, Dimension.percentage)} gapY={px(10)}>
                <FlexBox justifyContent={Justify.SPACE_BETWEEN} width={percent(100)} flexDir={FlexDirection.COLUMN} height={percent(100)}>
                    <FlexBox flexDir={FlexDirection.COLUMN} width={percent(100)}>
                        <FlexBox width={percent(100)} gap={theme.gaps.smallGab} flexDir={FlexDirection.ROW}>
                            <Icon icon={<ConfigIcon/>}/>
                            <FlexBox overflowXBehaviour={OverflowBehaviour.SCROLL} width={percent(100)}>
                                <FlexBox flexDir={FlexDirection.ROW} style={{justifyContent: "space-between"}}>
                                    <Text visualMeaning={visualMeaning}
                                          type={TextType.smallHeader}
                                          text={this.props.data.title}
                                          whitespace={"nowrap"}
                                    />
                                </FlexBox>
                            </FlexBox>
                        </FlexBox>
                        {this.renderSSLChecker()}
                        <Text type={TextType.secondaryDescription} visualMeaning={visualMeaning} text={this.props.data.description}/>
                    </FlexBox>

                    <FlexBox flexDir={FlexDirection.COLUMN} gap={theme.gaps.smallGab} width={percent(100)}>
                        {this.renderDebuggingHint()}
                        <Button
                            opaque={true}
                            width={percent(100)}
                            shrinkOnClick={true}
                            visualMeaning={visualMeaning}
                            onClick={() => this.props.onSelection(this.props.data)}
                            children={<Text type={TextType.smallHeader} uppercase bold fontSize={dimension(14, Dimension.px)} text={"Select"}/>}
                        />
                    </FlexBox>
                </FlexBox>
            </Box>
        );
    }

    private renderSSLChecker(): JSX.Element {
        const theme = utilizeGlobalTheme();

        return (
            <Box noPadding overflowYBehaviour={OverflowBehaviour.HIDDEN} overflowXBehaviour={OverflowBehaviour.HIDDEN} width={percent(100)}>
                <Accordion sx={{
                    background: theme.colors.backgroundHighlightColor200.css(),
                    '& .MuiAccordionSummary-root': {
                        minHeight: "0 !important",
                        paddingY: theme.paddings.defaultObjectPadding.css()
                    }
                }}>
                    <AccordionSummary
                        expandIcon={<Icon icon={<ExpandIcon/>} size={px(16)}/>}
                        aria-controls="panel1a-content"
                        id="panel1a-header"
                        children={<Text text={"Config details"} uppercase bold fontSize={px(12)}/>}
                        sx={{
                            '.MuiAccordionSummary-content': {
                                margin: "0 !important",
                            }
                        }}
                    />
                    <AccordionDetails>
                        <FlexBox flexDir={FlexDirection.COLUMN} gap={theme.gaps.smallGab} width={percent(100)}>
                            <FlexBox flexDir={FlexDirection.ROW} align={Align.CENTER} gap={theme.gaps.smallGab}>
                                <Icon icon={AppConfigSelector.circle()} colored visualMeaning={this.props.data.config.connectorConfig.ssl ? ObjectVisualMeaning.INFO : ObjectVisualMeaning.ERROR}/>
                                <Separator orientation={Orientation.VERTICAL}/>
                                <Text text={"SSL"} bold/>
                            </FlexBox>
                            <FlexBox flexDir={FlexDirection.ROW} align={Align.CENTER} gap={theme.gaps.smallGab}>
                                <Icon icon={<ConfigIcon/>}/>
                                <Separator orientation={Orientation.VERTICAL}/>
                                <Text text={this.props.data.config.connectorConfig.address}/>
                            </FlexBox>
                            <ObjectJSONDisplay title={"Data display"} pure={false} showControls={true} object={this.props.data.config}/>
                        </FlexBox>
                    </AccordionDetails>
                </Accordion>
            </Box>
        );
    }

    renderDebuggingHint(): JSX.Element {
        if (this.props.data.config.debugMode) {
            return (
                <InformationBox visualMeaning={ObjectVisualMeaning.WARNING}>
                    <Text text={"The config uses debugging mode, extensive metrics & logs get recorded. **Potentially vulnerable**"}/>
                </InformationBox>
            );
        } else return <></>
    }
}
