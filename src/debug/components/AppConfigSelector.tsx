import React from "react";
import {Box} from "../../components/Box";
import {AppConfig} from "../../logic/AppConfig";
import {Text, TextType} from "../../components/Text";
import {ObjectJSONDisplay} from "../../components/ObjectJSONDisplay";
import {Button} from "../../components/Button";
import {Dimension} from "../../logic/Dimension";
import {dimension, DimensionalMeasured} from "../../logic/DimensionalMeasured";
import {ObjectVisualMeaning} from "../../logic/ObjectVisualMeaning";
import {ReactComponent as ConfigIcon} from "../../assets/icons/ic-20/ic20-dns.svg";

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
        return (
            <Box width={DimensionalMeasured.of(100, Dimension.percentage)}
                 gapY={DimensionalMeasured.of(10, Dimension.px)}>
                <Text visualMeaning={ObjectVisualMeaning.INFO}
                      enableLeftAppendix
                      leftAppendix={<ConfigIcon/>}
                      type={TextType.smallHeader}
                      text={this.props.data.title}
                />
                <Text type={TextType.secondaryDescription} visualMeaning={ObjectVisualMeaning.INFO} text={this.props.data.description}/>
                <ObjectJSONDisplay object={this.props.data.config}/>
                <Button opaque={true}
                        shrinkOnClick={true}
                        visualMeaning={ObjectVisualMeaning.INFO}
                        onClick={() => this.props.onSelection(this.props.data)}>
                    <Text type={TextType.smallHeader} fontSize={dimension(14, Dimension.px)} text={"Select"}/>
                </Button>
            </Box>
        );
    }
}
