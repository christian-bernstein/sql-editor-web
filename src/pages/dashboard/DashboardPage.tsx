import React from "react";
import "../../styles/pages/DashboardPage.scss";
import {ProjectInfo} from "../../components/ProjectInfo";
import {LoadState} from "../../logic/LoadState";
import {App, utilizeGlobalTheme} from "../../logic/App";
import {v4} from "uuid";
import {ProjectInfoData} from "../../logic/ProjectInfoData";
import {FlexBox} from "../../components/FlexBox";
import {PageV2} from "../../components/Page";
import {Text, TextType} from "../../components/Text";
import {Align} from "../../logic/Align";
import {Justify} from "../../logic/Justify";
import {LiteGrid} from "../../components/LiteGrid";
import {ReactComponent as MenuIcon} from "../../assets/icons/ic-20/ic20-menu.svg";
import {ReactComponent as CreateIcon} from "../../assets/icons/ic-20/ic20-plus.svg";
import {ReactComponent as SyncIcon} from "../../assets/icons/ic-20/ic20-refresh.svg";
import {Icon} from "../../components/Icon";
import {arrayFactory, getOr, Utils} from "../../logic/Utils";
import {PosInCenter} from "../../components/PosInCenter";
import {em, percent, px} from "../../logic/DimensionalMeasured";
import {DBSessionCacheShard} from "../../shards/DBSessionCacheShard";
import {Redirect} from "react-router-dom";
import {ListProjectResponsePacketData} from "../../packets/in/ListProjectResponsePacketData";
import {getMeaningfulColors, MeaningfulColors, Themeable} from "../../Themeable";
import {Box} from "../../components/Box";
import {ObjectVisualMeaning} from "../../logic/ObjectVisualMeaning";
import {CustomTooltip} from "../../components/CustomTooltip";
import {Separator} from "../../components/Separator";
import {Orientation} from "../../logic/Orientation";
import {FlexDirection} from "../../logic/FlexDirection";
import _ from "lodash";
import {Input} from "../../components/Input";
import {CloseReason, OpenReason, SpeedDial, SpeedDialAction, SpeedDialIcon, Backdrop} from "@mui/material";
import {RenderController} from "../../tests/regex/RenderController";
import {cs} from "../../logic/state/State";
import {RenderExecutor} from "../../tests/regex/RenderExecutor";
import {Constants} from "../../Constants";

export type DashboardPageProps = {
}

export type DashboardPageState = {
    redirectToEditor: boolean,
    loading: boolean,
    projects: ProjectInfoData[],
    // todo add filter type and make filter array
    filter?: string,
    debouncedFilterChange: (filter: string) => void,
}

export type DashboardPageLocalState = {
    speedDialOpen: boolean
}

export default class DashboardPage extends React.PureComponent<DashboardPageProps, DashboardPageState> {

    private readonly local = cs<DashboardPageLocalState>({
        speedDialOpen: false
    });

    private readonly controller = new RenderController();

    constructor(props: DashboardPageProps) {
        super(props);
        this.state = {
            redirectToEditor: false,
            loading: false,
            projects: [],
            debouncedFilterChange: _.debounce((filter: string) => {
                this.setState({
                    filter: filter
                });
            }, 300)
        };
        this.local.on((state, value) => {
            this.controller.rerender(...getOr(value.get("channels"), ["*"]));
        });
    }

    private getFilteredProjects(): ProjectInfoData[] {
        if (this.state.filter !== undefined) {
             const filter: string = this.state.filter;
             return this.state.projects.filter(project => project.title.match(filter));
        } else return this.state.projects;
    }

    // noinspection JSMethodCanBeStatic
    private onProjectSelect(data: ProjectInfoData) {
        App.app().shard<DBSessionCacheShard>("db-session-cache").currentInfoData = data;
        this.setState({
            redirectToEditor: true
        });
    }

    private loadProjects() {
        this.setState({
            loading: true
        }, () => {
            App.app().getConnector().call({
                protocol: "main",
                packetID: "ListProjectPacketData",
                data: {},
                callback: {
                    handle: (connector, packet) => {
                        const lpr: ListProjectResponsePacketData = packet.data;
                        this.setState({
                            projects: lpr.projects,
                            loading: false
                        });
                    }
                }
            });
        });
    }

    private async init() {
        App.app().triggerLoginIfNotLoggedIn({
            processSuccessful: () => {
                // console.log("try to load projects after successful login")
                // this.loadProjects();
            },
            processFinished: () => {
                this.loadProjects();
            }
        });
    }

    componentDidMount() {
        this.init().then(() => {});
    }

    private createProject() {
        App.app().callAction("open-main-dialog", Constants.createProjectDialog);

        if (this.local.state.speedDialOpen) {
            this.closeSpeedDial(false);
        }
    }

    private renderSubtitle(): JSX.Element {
        if (this.state.loading) {
            return (
                <Box visualMeaning={ObjectVisualMeaning.WARNING} width={percent(100)} opaque>
                    <PosInCenter>
                        {/*<CircularProgress variant={"indeterminate"} size={20} sx={{
                            color: theme.colors.warnHighlightColor.css()
                        }}/>*/}
                        <Text text={"Loading projects from database.."}/>
                    </PosInCenter>
                </Box>
            );
        } else {
            return (
                <FlexBox flexDir={FlexDirection.COLUMN} align={Align.CENTER} width={percent(100)}>
                    <Text uppercase align={Align.CENTER} type={TextType.secondaryDescription} text={"*Select a project*"} />
                    {/*<Input opaque label={"Filter"} visualMeaning={ObjectVisualMeaning.INFO}/>*/}
                </FlexBox>
            );
        }
    }

    private renderPage(): JSX.Element {
        const theme: Themeable.Theme = utilizeGlobalTheme();
        return (
            <>
                {this.renderSpeedDial()}
                <PageV2>
                    <LiteGrid columns={3}>
                        <FlexBox align={Align.START} justifyContent={Justify.CENTER}>
                            <Icon icon={(
                                <CustomTooltip title={"Toggle menu"} arrow>
                                <span>
                                    <MenuIcon/>
                                </span>
                                </CustomTooltip>
                            )} onClick={() => App.app().openMenu()}/>
                        </FlexBox>
                        <FlexBox align={Align.CENTER} justifyContent={Justify.CENTER}>
                            <Text uppercase align={Align.CENTER} type={TextType.smallHeader} text={"Dashboard"} />
                        </FlexBox>
                        <FlexBox align={Align.CENTER} justifyContent={Justify.FLEX_END} flexDir={FlexDirection.ROW}>
                            <CustomTooltip title={(
                                <Text text={"Reload the projects"}/>
                            )} arrow noBorder>
                            <span>
                                {
                                    this.state.loading ? (
                                        <Icon icon={<SyncIcon/>} visualMeaning={ObjectVisualMeaning.UI_NO_HIGHLIGHT} colored={true}/>
                                    ) : (
                                        <Icon icon={<SyncIcon/>} visualMeaning={ObjectVisualMeaning.INFO} colored={true} onClick={() => this.loadProjects()}/>
                                    )
                                }
                            </span>
                            </CustomTooltip>
                            <Separator orientation={Orientation.VERTICAL}/>
                            <CustomTooltip title={(
                                <Text text={"**Create a new project**\nBlank project or choose a template."}/>
                            )} arrow noBorder>
                            <span>
                                <Icon icon={<CreateIcon/>} visualMeaning={ObjectVisualMeaning.INFO} colored={true} onClick={() => this.createProject()}/>
                            </span>
                            </CustomTooltip>
                        </FlexBox>
                    </LiteGrid>
                    <PosInCenter>
                        {
                            // this.state.loading ? (
                            //     // todo fix progress width css bug (width maybe 1px wide..)
                            //     <FlexBox flexDir={FlexDirection.ROW} gap={theme.gaps.defaultGab}>
                            //         <CircularProgress variant={"indeterminate"} size={20} sx={{
                            //             color: theme.colors.primaryHighlightColor.css()
                            //         }}/>
                            //         <Text uppercase align={Align.CENTER} type={TextType.secondaryDescription} text={"*Loading*"} />
                            //     </FlexBox>
                            // ) : (
                            //     <>
                            //         <Text uppercase align={Align.CENTER} type={TextType.secondaryDescription} text={"*Select a project*"} />
                            //         <CircularProgress variant={"indeterminate"} size={20} sx={{
                            //             color: theme.colors.primaryHighlightColor.css()
                            //         }}/>
                            //     </>
                            // )
                            this.renderSubtitle()
                        }
                    </PosInCenter>
                    <LiteGrid responsive minResponsiveWidth={px(300)} gap={em(1)}>
                        {
                            // todo set key the right way
                            arrayFactory(() => <ProjectInfo
                                key={v4()}
                                onSelect={data => this.onProjectSelect(data)}
                                data={{
                                    creatorUserID: v4(),
                                    id: v4(),
                                    state: LoadState.OFFLINE,
                                    stator: Utils.randomBool(),
                                    edits: 10,
                                    lastEdited: new Date(),
                                    title: "SQL lesson 21",
                                    description: "This is the description you looked for a long time. It is worth reading it trough. See database workthrough [here](https://luo-darmstadt.de/sqltutorial/db_nordwind.html)."
                                }}
                            />, 0)
                        }
                        {
                            this.getFilteredProjects().map(project => <ProjectInfo
                                key={project.id}
                                onSelect={data => this.onProjectSelect(data)}
                                data={project}
                            />)
                        }
                    </LiteGrid>
                </PageV2>
            </>
        );
    }

    private closeSpeedDial(muiEventRelay: boolean, muiEventRelayData?: {event: React.SyntheticEvent<{}>, reason: CloseReason}) {
        this.local.setState({
            speedDialOpen: false
        }, new Map([["channels", ["*", "dial"]]]));
    }

    private openSpeedDial(muiEventRelay: boolean, muiEventRelayData?: {event: React.SyntheticEvent<{}>, reason: OpenReason}) {
        this.local.setState({
            speedDialOpen: true
        }, new Map([["channels", ["*", "dial"]]]));
    }

    private renderSpeedDial(): JSX.Element {
        const theme: Themeable.Theme = utilizeGlobalTheme();
        const infoVM: MeaningfulColors = getMeaningfulColors(ObjectVisualMeaning.INFO, theme);
        return (
            <RenderExecutor
                id={v4()}
                componentDidMountRelay={bridge => this.controller.register(bridge)}
                channels={["*" , "dial"]}
                componentFactory={() => (
                    <>
                        <Backdrop open={this.local.state.speedDialOpen} />
                        <SpeedDial
                            ariaLabel="SpeedDial tooltip example"
                            sx={{
                                ['& .MuiButtonBase-root']: {
                                    borderRadius: theme.radii.defaultObjectRadius.css(),
                                    borderWidth: "1px",
                                    borderStyle: "solid",
                                    borderColor: theme.colors.borderPrimaryColor.css(),
                                    backgroundColor: theme.colors.backgroundHighlightColor.css(),
                                },
                                ['& .MuiSpeedDialAction-staticTooltipLabel']: {
                                    backgroundColor: theme.colors.tooltipBackgroundColor.css(),
                                    color: theme.colors.tooltipPrimaryFontColor.css(),
                                    fontFamily: "OperatorMono !important"
                                },
                                ['& .MuiButtonBase-root:hover']: {
                                    backgroundColor: infoVM.main.css(),
                                    borderColor: infoVM.lighter.css(),
                                    boxShadow: "0 0 0 4px " + infoVM.shadowColor.css()
                                },
                                ['& svg path']: {
                                    fill: infoVM.icon.css() + " !important"
                                },
                                position: 'absolute',
                                bottom: 16,
                                right: 16,
                            }}
                            icon={<SpeedDialIcon />}
                            onClose={(event, reason) => this.closeSpeedDial(true, {
                                event: event,
                                reason: reason
                            })}
                            onOpen={(event, reason) => this.openSpeedDial(true, {
                                event: event,
                                reason: reason
                            })}
                            open={this.local.state.speedDialOpen}
                        >
                            <SpeedDialAction
                                key={"b"}
                                icon={<CreateIcon/>}
                                tooltipTitle={"Create"}
                                tooltipOpen
                                onClick={event => {}}
                            />
                            <SpeedDialAction
                                key={"c"}
                                icon={<CreateIcon/>}
                                tooltipTitle={"Template"}
                                tooltipOpen
                                onClick={event => {}}
                            />
                        </SpeedDial>
                    </>
                )}
            />
        );
    }

    render() {
        if (this.state.redirectToEditor) {
            console.log("redirect to d-editor")
            return (
                <Redirect to={"/d-editor"} push/>
            );
        } else {
            return this.renderPage();
        }
    }
}
