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

export type ProjectInfoProps = {
    data: ProjectInfoData,
    onSelect?: (data: ProjectInfoData) => void
}

export class ProjectInfo extends React.Component<ProjectInfoProps, any> {

    constructor(props: ProjectInfoProps) {
        super(props);
    }

    private onClick(event: React.MouseEvent<HTMLDivElement, MouseEvent>) {
        if (this.props.onSelect !== undefined) {
            this.props.onSelect(this.props.data);
        }
    }

    /*
     <div className={"project-info"} onClick={event => this.onClick(event)}>
     <div className={"project-header"}>
     <div className={[
                        "project-badge",
                        this.props.data.state === LoadState.STOPPING ? "error" : "",
                        this.props.data.state === LoadState.STARTING ? "warn" : "",
                        this.props.data.state === LoadState.ONLINE ? "online" : "",
                        this.props.data.state === LoadState.OFFLINE ? "offline" : "",
                    ].join(" ").trim()}>
     {this.props.data.stator ? <ChainIcon/> : <></>}
     </div>
     <div className={"project-contributors"}>

     </div>
     </div>
     <h3 className={"project-title"}>{this.props.data.title}</h3>
     <div className={"project-charts"}>
     <ChartWidget title={"Rows"} value={"200"}/>
    <ChartWidget title={"Edits"} value={"24"}/>
    <ChartWidget title={"Last edited"} value={"32min"}/>
    </div>
    </div>
     */

    render() {
        const theme: Themeable.Theme = utilizeGlobalTheme();

        const ChartGrid = styled.div`
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: ${theme.gaps.defaultGab.css()};
        `;

        return (
            <Box width={percent(100)} gapY={px(10)}>
                <Text text={"**Nordwind-Database**"} leftAppendix={<Icon icon={<ProjectIcon/>}/>} enableLeftAppendix={true}/>
                <Text text={"**Load-type**: STATIC"}/>
                <Text text={"**Status**: ONLINE"}/>
                <Text text={"**Description**: This is the description you looked for a long time. It is worth reading it trough. See database workthrough [here](https://luo-darmstadt.de/sqltutorial/db_nordwind.html)."}/>

                <ChartGrid>
                    <AreaChartComponent/>
                    <AreaChartComponent/>
                </ChartGrid>

                <Button visualMeaning={ObjectVisualMeaning.INFO} opaque={true}>
                    <FlexBox flexDir={FlexDirection.ROW} gap={px(10)}>
                        <Text text={"Load"}/>
                        <Icon icon={<LoadIcon/>}/>
                    </FlexBox>
                </Button>
            </Box>
        );
    }
}
