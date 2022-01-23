// import "../styles/components/ProjectInfo.scss";
import React from "react";
import {ReactComponent as ProjectIcon} from "../assets/icons/ic-20/ic20-file.svg";
import {ReactComponent as LoadIcon} from "../assets/icons/ic-20/ic20-arrow-right.svg";
import {ProjectInfoData} from "../logic/ProjectInfoData";
import {Box} from "./Box";
import {Text} from "./Text";
import {percent, px} from "../logic/DimensionalMeasured";
import {Icon} from "./Icon";
import {Button} from "./Button";
import {ObjectVisualMeaning} from "../logic/ObjectVisualMeaning";
import {FlexBox} from "./FlexBox";
import {FlexDirection} from "../logic/FlexDirection";
import {AreaChartComponent} from "./AreaChartComponent";
import styled from "styled-components";
import {Themeable} from "../Themeable";
import {utilizeGlobalTheme} from "../logic/App";
import {Justify} from "../logic/Justify";
import {ProjectInfoOnlineIcon} from "./ProjectInfoOnlineIcon";
import {Utils} from "../logic/Utils";
import {Tooltip, Zoom} from "@mui/material";
import {CustomTooltip} from "./CustomTooltip";
import {ObjectJSONDisplay} from "./ObjectJSONDisplay";

export type ProjectInfoProps = {
    data: ProjectInfoData,
    onSelect?: (data: ProjectInfoData) => void
}

export class ProjectInfo extends React.Component<ProjectInfoProps, any> {

    constructor(props: ProjectInfoProps) {
        super(props);
    }

    private onSelect(event: React.MouseEvent<HTMLButtonElement, MouseEvent>) {
        if (this.props.onSelect !== undefined) {
            this.props.onSelect(this.props.data);
        }
    }

    renderHeader() {
        return (
            <FlexBox flexDir={FlexDirection.ROW} justifyContent={Justify.SPACE_BETWEEN}>
                <Text
                    text={Utils.format("**{0}**", this.props.data.title)}
                    enableLeftAppendix={true}
                    leftAppendix={(
                        <CustomTooltip noBorder noPadding arrow title={(
                            <ObjectJSONDisplay object={this.props.data} title={"**[DEBUG]** Project JSON Representation"} pure={false} showControls={true}/>
                        )} TransitionComponent={Zoom}>
                                <span>
                                    <Icon icon={<ProjectIcon/>}/>
                                </span>
                        </CustomTooltip>
                    )}
                />
                <CustomTooltip noBorder title={(
                    <Text text={
                        `**Stator**: ${this.props.data.stator}\n**State**: ${this.props.data.state}\n`
                    }/>
                )} TransitionComponent={Zoom} arrow>
                        <span>
                            <ProjectInfoOnlineIcon static={this.props.data.stator} state={this.props.data.state}/>
                        </span>
                </CustomTooltip>
            </FlexBox>
        );
    }

    render() {
        const theme: Themeable.Theme = utilizeGlobalTheme();
        const ChartGrid = styled.div`
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: ${theme.gaps.defaultGab.css()};
        `;
        return (
            <Box width={percent(100)} gapY={px(10)}>
                {this.renderHeader()}
                <Text text={Utils.format("**Description**: {0}", this.props.data.description)}/>
                <ChartGrid>
                    <AreaChartComponent/>
                    <AreaChartComponent/>
                </ChartGrid>
                <Button visualMeaning={ObjectVisualMeaning.INFO} opaque={true} onClick={event => this.onSelect(event)}>
                    <FlexBox flexDir={FlexDirection.ROW} gap={px(10)}>
                        <Text text={"Load"}/>
                        <Icon icon={<LoadIcon/>}/>
                    </FlexBox>
                </Button>
            </Box>
        );
    }
}
