// import "../styles/components/ProjectInfo.scss";
import React from "react";
import {ReactComponent as LoadIcon} from "../assets/icons/ic-20/ic20-arrow-right.svg";
import {ReactComponent as ContextIcon} from "../assets/icons/ic-20/ic20-more-ver.svg";
import {ReactComponent as DeleteIcon} from "../assets/icons/ic-20/ic20-delete.svg";
import {ProjectInfoData} from "../logic/ProjectInfoData";
import {Box} from "./Box";
import {Text, TextType} from "./Text";
import {percent, px} from "../logic/style/DimensionalMeasured";
import {Icon} from "./Icon";
import {Button} from "./Button";
import {ObjectVisualMeaning} from "../logic/ObjectVisualMeaning";
import {FlexBox} from "./FlexBox";
import {FlexDirection} from "../logic/style/FlexDirection";
import {AreaChartComponent} from "./AreaChartComponent";
import styled from "styled-components";
import {Themeable} from "../Themeable";
import {App, utilizeGlobalTheme} from "../logic/App";
import {Justify} from "../logic/style/Justify";
import {ProjectInfoOnlineIcon} from "./ProjectInfoOnlineIcon";
import {arrayFactory} from "../logic/Utils";
import {Zoom} from "@mui/material";
import {CustomTooltip} from "./CustomTooltip";
import {ObjectJSONDisplay} from "./ObjectJSONDisplay";
import {Separator} from "./Separator";
import {Orientation} from "../logic/style/Orientation";
import {ContextCompound} from "./ContextCompound";
import {If} from "./If";
import {Constants} from "../Constants";
import {Align} from "../logic/Align";
import {OverflowBehaviour} from "../logic/style/OverflowBehaviour";
import {Debug} from "./Debug";
import {Collapsible} from "./Collapsible";
import {SVG} from "../SVG";
import {ReactComponent as ConfigIcon} from "../assets/icons/ic-20/ic20-dns.svg";
import {LoadState} from "../logic/LoadState";

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
        const theme = utilizeGlobalTheme();

        return (
            <FlexBox gap={theme.gaps.smallGab}>
                <Button visualMeaning={ObjectVisualMeaning.ERROR} opaque width={percent(100)} onClick={() => this.toggleProjectDeleteDialog()}>
                    <FlexBox flexDir={FlexDirection.ROW} justifyContent={Justify.FLEX_START} width={percent(100)}>
                        <Icon icon={<DeleteIcon/>}/>
                        <Text text={`Delete`}/>
                    </FlexBox>
                </Button>
            </FlexBox>
        );
        // return (
        //     <FlexBox gap={theme.gaps.smallGab}>
        //         <ElementHeader title={"Options…"} boldHeader icon={<MenuIcon/>}/>
        //         <Separator/>
        //         <Button visualMeaning={ObjectVisualMeaning.ERROR} opaque width={percent(100)} onClick={() => this.toggleProjectDeleteDialog()}>
        //             <FlexBox flexDir={FlexDirection.ROW} justifyContent={Justify.FLEX_START} width={percent(100)}>
        //                 <Icon icon={<DeleteIcon/>}/>
        //                 <Text text={`Delete`}/>
        //             </FlexBox>
        //         </Button>
        //         <Debug>
        //             <ObjectJSONDisplay object={this.props.data} title={"Project representation"} pure={false} showControls={true}/>
        //         </Debug>
        //     </FlexBox>
        // );
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
            <FlexBox flexDir={FlexDirection.ROW} justifyContent={Justify.SPACE_BETWEEN} width={percent(100)}>
                <FlexBox flexDir={FlexDirection.ROW} gap={theme.gaps.smallGab} overflowXBehaviour={OverflowBehaviour.SCROLL}>
                    {/*<Icon icon={(
                        <CustomTooltip noBorder noPadding arrow title={(
                            <ObjectJSONDisplay object={this.props.data} title={"**[DEBUG]** Project JSON Representation"} pure={false} showControls={true}/>
                        )} TransitionComponent={Zoom}>
                                <span>
                                    <Icon icon={<ProjectIcon/>}/>
                                </span>
                        </CustomTooltip>
                    )}/>*/}

                    <FlexBox flexDir={FlexDirection.ROW} align={Align.CENTER} gap={px(1)} overflowXBehaviour={OverflowBehaviour.SCROLL}>
                        {/* todo put username here */}
                        {/*<Text text={`${this.props.data.creatorUserID}/`}/>*/}
                        {/*<ClientDisplay enableClientBadge={false}/>
                        <Text text={"/"} type={TextType.secondaryDescription}/>*/}
                        <Text whitespace={"nowrap"} text={`${this.props.data.title}`} bold/>
                    </FlexBox>
                </FlexBox>

                <FlexBox flexDir={FlexDirection.ROW} height={percent(100)} gap={theme.gaps.smallGab}>
                    <CustomTooltip noBorder title={(
                        <FlexBox>
                            <Text text={
                                `**Stator**: ${this.props.data.stator}\n**State**: ${this.props.data.state}\n`
                            }/>
                            <ObjectJSONDisplay object={this.props.data} title={"**[DEBUG]** Project JSON Representation"} pure={false} showControls={true}/>
                        </FlexBox>
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

    private renderDetails(): JSX.Element {
        const vm: ObjectVisualMeaning = (() => {
            switch (this.props.data.state) {
                case LoadState.ONLINE: return ObjectVisualMeaning.SUCCESS;
                case LoadState.OFFLINE: return ObjectVisualMeaning.UI_NO_HIGHLIGHT;
                case LoadState.STOPPING: return ObjectVisualMeaning.ERROR;
                case LoadState.STARTING: return ObjectVisualMeaning.WARNING;
                case undefined: return ObjectVisualMeaning.UI_NO_HIGHLIGHT;
            }
        })();

        return (
            <Collapsible header={(t, a) => (
                <Text text={"Project details"} whitespace={"nowrap"} uppercase bold fontSize={px(12)}/>
            )} content={(t, a) => (
                <>
                    <FlexBox height={percent(100)} flexDir={FlexDirection.ROW} width={percent(100)} align={Align.CENTER} gap={t.gaps.smallGab}>
                        <Icon icon={SVG.circle()} colored visualMeaning={vm}/>
                        <Separator orientation={Orientation.VERTICAL}/>
                        <Text text={"online state"}/>
                    </FlexBox>
                    <FlexBox flexDir={FlexDirection.ROW} gap={t.gaps.smallGab}>
                        <Text text={"Last edited: "} type={TextType.secondaryDescription}/>
                        <Text text={String(this.props.data.lastEdited)}/>
                    </FlexBox>
                </>
            )}/>
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

                <FlexBox padding={false} gap={theme.gaps.defaultGab} flexDir={FlexDirection.COLUMN} justifyContent={Justify.SPACE_BETWEEN} width={percent(100)} height={percent(100)}>
                    <FlexBox width={percent(100)} gap={theme.gaps.defaultGab}>
                        {this.renderHeader()}
                        {this.renderDetails()}
                        <If condition={this.props.data.description !== null} ifTrue={
                            <>
                                {/*<Text text={"**Description**:"}/>*/}
                                <Text text={this.props.data.description}/>
                            </>
                        }/>
                    </FlexBox>

                    <FlexBox width={percent(100)} gap={theme.gaps.smallGab}>
                        <Debug>
                            <ChartGrid>
                                <AreaChartComponent
                                    title={"rows"}
                                    numIndicator={10}
                                    series={arrayFactory((i) => Math.abs(Math.sin(i) * 100), 15)}/>
                                <AreaChartComponent title={"rows"} numIndicator={10} series={arrayFactory(() => Math.random() > .5 ? Math.random() * 100 : Math.random() * 50, 10)}/>
                            </ChartGrid>
                        </Debug>
                        <Button width={percent(100)} visualMeaning={ObjectVisualMeaning.INFO} opaque={true} shrinkOnClick={true} onClick={event => this.onSelect(event)}>
                            <FlexBox flexDir={FlexDirection.ROW} gap={px(10)}>
                                <Text text={"**Load**"}/>
                                <Icon icon={<LoadIcon/>}/>
                            </FlexBox>
                        </Button>
                    </FlexBox>
                </FlexBox>




            </Box>
        );
    }
}
