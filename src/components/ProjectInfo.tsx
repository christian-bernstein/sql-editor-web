// import "../styles/components/ProjectInfo.scss";
import React from "react";
import {ReactComponent as ProjectIcon} from "../assets/icons/ic-20/ic20-file.svg";
import {ReactComponent as LoadIcon} from "../assets/icons/ic-20/ic20-arrow-right.svg";
import {ReactComponent as ContextIcon} from "../assets/icons/ic-20/ic20-more-ver.svg";
import {ReactComponent as DeleteIcon} from "../assets/icons/ic-20/ic20-delete.svg";
import {ProjectInfoData} from "../logic/ProjectInfoData";
import {Box} from "./Box";
import {Text, TextType} from "./Text";
import {percent, px} from "../logic/DimensionalMeasured";
import {Icon} from "./Icon";
import {Button} from "./Button";
import {ObjectVisualMeaning} from "../logic/ObjectVisualMeaning";
import {FlexBox} from "./FlexBox";
import {FlexDirection} from "../logic/FlexDirection";
import {AreaChartComponent} from "./AreaChartComponent";
import styled from "styled-components";
import {Themeable} from "../Themeable";
import {App, utilizeGlobalTheme} from "../logic/App";
import {Justify} from "../logic/Justify";
import {ProjectInfoOnlineIcon} from "./ProjectInfoOnlineIcon";
import {arrayFactory} from "../logic/Utils";
import {Zoom} from "@mui/material";
import {CustomTooltip} from "./CustomTooltip";
import {ObjectJSONDisplay} from "./ObjectJSONDisplay";
import {Separator} from "./Separator";
import {Orientation} from "../logic/Orientation";
import {ContextCompound} from "./ContextCompound";
import {If} from "./If";
import {Constants} from "../Constants";
import dateFormat from "dateformat";

export type ProjectInfoProps = {
    data: ProjectInfoData,
    onSelect?: (data: ProjectInfoData) => void
}

export class ProjectInfo extends React.Component<ProjectInfoProps, any> {

    constructor(props: ProjectInfoProps) {
        super(props);
    }

    private onSelect(event: React.MouseEvent<HTMLDivElement, MouseEvent>) {
        if (this.props.onSelect !== undefined) {
            this.props.onSelect(this.props.data);
        }
    }

    private toggleProjectDeleteDialog() {
        App.app().callAction(Constants.openMainDialogWithParamsAction, {
            dialog: Constants.deleteProjectDialog,
            parameters: this.props.data
        })
    }

    private renderContextMenuContent(): JSX.Element {
        return (
            <Button visualMeaning={ObjectVisualMeaning.ERROR} opaque width={percent(100)} onClick={() => this.toggleProjectDeleteDialog()}>
                <FlexBox flexDir={FlexDirection.ROW} justifyContent={Justify.SPACE_BETWEEN}>
                    <Icon icon={<DeleteIcon/>}/>
                    <Text text={`Delete`}/>
                </FlexBox>
            </Button>
        );
    }

    private renderContextMenu(): JSX.Element {
        return (
            <ContextCompound menu={this.renderContextMenuContent()}>
                <Icon icon={<ContextIcon/>}/>
            </ContextCompound>
        );
    }

    renderHeader() {
        const theme = utilizeGlobalTheme();
        return (
            <FlexBox flexDir={FlexDirection.ROW} justifyContent={Justify.SPACE_BETWEEN}>
                <FlexBox flexDir={FlexDirection.ROW} gap={theme.gaps.smallGab}>
                    <Icon icon={(
                        <CustomTooltip noBorder noPadding arrow title={(
                            <ObjectJSONDisplay object={this.props.data} title={"**[DEBUG]** Project JSON Representation"} pure={false} showControls={true}/>
                        )} TransitionComponent={Zoom}>
                                <span>
                                    <Icon icon={<ProjectIcon/>}/>
                                </span>
                        </CustomTooltip>
                    )}/>

                    <FlexBox flexDir={FlexDirection.ROW} gap={px(1)}>
                        <Text text={`${"root"}/`}/>
                        <Text text={`${this.props.data.title}`} bold/>
                    </FlexBox>
                </FlexBox>

                <FlexBox flexDir={FlexDirection.ROW} height={percent(100)} gap={theme.gaps.smallGab}>
                    <CustomTooltip noBorder title={(
                        <Text text={
                            `**Stator**: ${this.props.data.stator}\n**State**: ${this.props.data.state}\n`
                        }/>
                    )} TransitionComponent={Zoom} arrow>
                        <span>
                            <ProjectInfoOnlineIcon static={this.props.data.stator} state={this.props.data.state}/>
                        </span>
                    </CustomTooltip>
                    <Separator orientation={Orientation.VERTICAL}/>

                    {this.renderContextMenu()}
                </FlexBox>
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
                <If condition={this.props.data.description !== null} ifTrue={
                    <>
                        {/*<Text text={"**Description**:"}/>*/}
                        <Text text={this.props.data.description}/>
                    </>
                }/>
                <FlexBox flexDir={FlexDirection.ROW}>
                    <Text text={"Lase edited: "} type={TextType.secondaryDescription}/>
                    <Text text={String(this.props.data.lastEdited)}/>
                </FlexBox>
                {/* todo replace with flexbox handling */}
                <div style={{
                    height: "100%"
                }}> </div>
                <ChartGrid>
                    <AreaChartComponent
                        title={"rows"}
                        numIndicator={10}
                        series={arrayFactory((i) => Math.abs(Math.sin(i) * 100), 15)}/>
                    <AreaChartComponent title={"rows"} numIndicator={10} series={arrayFactory(() => Math.random() > .5 ? Math.random() * 100 : Math.random() * 50, 10)}/>
                </ChartGrid>
                <Button visualMeaning={ObjectVisualMeaning.INFO} opaque={true} shrinkOnClick={true} onClick={event => this.onSelect(event)}>
                    <FlexBox flexDir={FlexDirection.ROW} gap={px(10)}>
                        <Text text={"**Load**"}/>
                        <Icon icon={<LoadIcon/>}/>
                    </FlexBox>
                </Button>
            </Box>
        );
    }
}
