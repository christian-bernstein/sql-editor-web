import React from "react";
import {Box} from "../../components/Box";
import {AppConfig} from "../../logic/AppConfig";
import {Text, TextType} from "../../components/Text";
import {ObjectJSONDisplay} from "../../components/ObjectJSONDisplay";
import {Button} from "../../components/Button";
import {Dimension} from "../../logic/Dimension";
import {dimension, DimensionalMeasured, px} from "../../logic/DimensionalMeasured";
import {ObjectVisualMeaning} from "../../logic/ObjectVisualMeaning";
import {ReactComponent as ConfigIcon} from "../../assets/icons/ic-20/ic20-dns.svg";
import {ReactComponent as DebugIcon} from "../../assets/icons/ic-16/ic16-bug.svg";
import {InformationBox} from "../../components/InformationBox";
import {FlexBox} from "../../components/FlexBox";
import {FlexDirection} from "../../logic/FlexDirection";
import {Icon} from "../../components/Icon";
import {Align} from "../../logic/Align";

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

    render() {
        const visualMeaning: ObjectVisualMeaning = ObjectVisualMeaning.INFO;
        return (
            <Box width={DimensionalMeasured.of(100, Dimension.percentage)} gapY={px(10)}>
                <FlexBox flexDir={FlexDirection.ROW} style={{justifyContent: "space-between"}}>
                    <Text visualMeaning={visualMeaning}
                          enableLeftAppendix
                          leftAppendix={<ConfigIcon/>}
                          type={TextType.smallHeader}
                          text={this.props.data.title}
                    />
                </FlexBox>
                <Text type={TextType.secondaryDescription} visualMeaning={visualMeaning} text={this.props.data.description}/>
                <ObjectJSONDisplay object={this.props.data.config}/>
                {this.renderDebuggingHint()}
                <Button opaque={true}
                        shrinkOnClick={true}
                        visualMeaning={visualMeaning}
                        onClick={() => this.props.onSelection(this.props.data)}>
                    <Text type={TextType.smallHeader} fontSize={dimension(14, Dimension.px)} text={"Select"}/>
                </Button>
            </Box>
        );
    }

    renderDebuggingHint(): JSX.Element {
        if (this.props.data.config.debugMode) {
            return (
                <InformationBox visualMeaning={ObjectVisualMeaning.WARNING}>
                    <Text text={"The config uses debugging mode, extensive metrics & log gets recorded. **Potentially vulnerable**"}/>
                </InformationBox>
            );
        } else return <></>
    }
}
