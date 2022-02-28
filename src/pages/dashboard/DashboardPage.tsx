import React from "react";
import "../../styles/pages/DashboardPage.scss";
import {ProjectInfo} from "../../components/ProjectInfo";
import {App, utilizeGlobalTheme} from "../../logic/App";
import {ProjectInfoData} from "../../logic/ProjectInfoData";
import {FlexBox} from "../../components/FlexBox";
import {PageV2} from "../../components/Page";
import {Text, TextType} from "../../components/Text";
import {Align} from "../../logic/Align";
import {Justify} from "../../logic/style/Justify";
import {LiteGrid} from "../../components/LiteGrid";
import {ReactComponent as MenuIcon} from "../../assets/icons/ic-20/ic20-menu.svg";
import {ReactComponent as CreateIcon} from "../../assets/icons/ic-20/ic20-plus.svg";
import {ReactComponent as SyncIcon} from "../../assets/icons/ic-20/ic20-refresh.svg";
import {Icon} from "../../components/Icon";
import {getOr} from "../../logic/Utils";
import {PosInCenter} from "../../components/PosInCenter";
import {em, percent, px} from "../../logic/style/DimensionalMeasured";
import {DBSessionCacheShard} from "../../shards/DBSessionCacheShard";
import {Redirect} from "react-router-dom";
import {ListProjectResponsePacketData} from "../../packets/in/ListProjectResponsePacketData";
import {getMeaningfulColors, MeaningfulColors, Themeable} from "../../Themeable";
import {ObjectVisualMeaning} from "../../logic/ObjectVisualMeaning";
import {CustomTooltip} from "../../components/CustomTooltip";
import {FlexDirection} from "../../logic/style/FlexDirection";
import _ from "lodash";
import {Backdrop, CloseReason, OpenReason, SpeedDial, SpeedDialAction, SpeedDialIcon} from "@mui/material";
import {Constants} from "../../Constants";
import {OverflowBehaviour} from "../../logic/style/OverflowBehaviour";
import {Input} from "../../components/Input";
import {ProfilePicture} from "../../components/ProfilePicture";
import {Badge} from "../../components/Badge";
import {PuffLoader} from "react-spinners";
import {If} from "../../components/If";
import {CockpitButton} from "../../components/cockpitButton/CockpitButton";
import {CockpitButtonType} from "../../components/cockpitButton/CockpitButtonType";
import {ProjectFilter} from "./ProjectFilter";
import {BernieComponent} from "../../logic/BernieComponent";

export type DashboardPageProps = {
}

export type DashboardPageState = {
    redirectToEditor: boolean,
    loading: boolean,
    projects: ProjectInfoData[],
    filters: Array<ProjectFilter>
}

export type DashboardPageLocalState = {
    speedDialOpen: boolean,
    filter?: string,
    debouncedFilterChange: (filter: string) => void,
}

/**
 * <CircularProgress variant={"indeterminate"} size={20} sx={{
 *     color: theme.colors.primaryHighlightColor.css()
 * }}/>
 */
export default class DashboardPage extends BernieComponent<DashboardPageProps, DashboardPageState, DashboardPageLocalState> {

    constructor(props: DashboardPageProps) {
        super(props, {
            redirectToEditor: false,
            loading: false,
            projects: [],
            filters: DashboardPage.createFilters()
        }, {
            speedDialOpen: false,
            debouncedFilterChange: _.debounce((filter: string) => {
                this.local.setStateWithChannels({
                    filter: filter
                }, ["filter", "project"]);
            }, 700)
        });
    }

    private static async init() {
        App.app().triggerLoginIfNotLoggedIn({
            processSuccessful: () => {
                // console.log("try to load projects after successful login")
                // this.loadProjects();
            },
            processFinished: () => {
                // loading moved to promise of this function. At the current state of development it is assumed
                // that when accessing this screen a websocket connection in main-protocol is present.
                // this.loadProjects();
            }
        });
    }

    private static createFilters(): Array<ProjectFilter> {
        return [
            {
                name: "all",
                active: true,
                filterProps: new Map<string, any>(),
                filter: (page, projects) => projects,
                shortName: "all",
                visualMeaning: ObjectVisualMeaning.UI_NO_HIGHLIGHT,
                index: 0
            },
            {
                name: "name",
                active: false,
                filterProps: new Map<string, any>(),
                filter: (page, projects) => {
                    const regex = page.local.state.filter;
                    if (regex === undefined || regex.length === 0) {
                        return [];
                    }
                    return projects.filter(p => p.title.match(regex as string));
                },
                shortName: "name",
                visualMeaning: ObjectVisualMeaning.UI_NO_HIGHLIGHT,
                index: 1
            },
            {
                name: "stator",
                active: false,
                filterProps: new Map<string, any>(),
                filter: (page, projects) => projects.filter(p => p.stator),
                shortName: "stat",
                visualMeaning: ObjectVisualMeaning.UI_NO_HIGHLIGHT,
                index: 2
            }
        ];
    }

    private getFilteredProjects(): ProjectInfoData[] {
        // If 'all' is active, just return all
        if (this.getFilter("all").active) {
            return this.state.projects;
        }

        // If no filter selected, return empty array
        const activeFilters = this.state.filters.filter(f => f.active);
        if (activeFilters.length === 0) {
            return [];
        }
        let projects = this.state.projects;
        activeFilters.forEach(f => {
            projects = f.filter(this, projects);
        });
        return projects;
    }

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

    private createProject() {
        App.app().callAction("open-main-dialog", Constants.createProjectDialog);
        if (this.local.state.speedDialOpen) {
            this.closeSpeedDial(false);
        }
    }

    private getFilter(name: string): ProjectFilter {
        let filters = this.state.filters.filter(f => f.name === name);
        if (filters.length !== 1) {
            throw new Error(`Error filter ${name} wasn't found on dashboard's filter list. (${filters})`);
        }
        return filters[0] as ProjectFilter;
    }

    private updateFilter(name: string, updater: (f: ProjectFilter) => ProjectFilter, rerender: boolean = true) {
        let f = this.getFilter(name);
        const indexOf = this.state.filters.indexOf(f);
        this.state.filters.splice(indexOf, 1);
        f = updater(f);
        this.state.filters.push(f);
        this.state.filters.sort((a, b) => a.index - b.index);
        if (rerender) {
            this.controller.rerender("*", "project", "filter");
        }
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

    private renderFilterButtons(): JSX.Element {
        const theme = utilizeGlobalTheme();

        return this.component(state => (
            <LiteGrid columns={6} gap={theme.gaps.smallGab}>{
                this.state.filters.map(filter => {
                    let cbBtnVal: string;
                    try {
                        cbBtnVal = String(filter.filter(this, this.state.projects).length);
                    } catch (e) {
                        cbBtnVal = "ERR";
                    }

                    return (
                        <CockpitButton
                            visualMeaning={getOr(filter.visualMeaning, ObjectVisualMeaning.UI_NO_HIGHLIGHT)}
                            variant={CockpitButtonType.KEY_VAL}
                            initialActiveState={filter.active}
                            title={filter.shortName}
                            value={cbBtnVal}
                            multiColorMode={false}
                            onActiveChange={(props, active) => {
                                this.updateFilter(filter.name, f => {
                                    f.active = active;
                                    return f;
                                })
                            }}
                        />
                    );
                })
            }</LiteGrid>
        ), "*", "filter");
    }

    private renderProjects(): JSX.Element {
        return this.component(state => {
            const filtered = this.getFilteredProjects();
            const projectsSize = this.state.projects.length;

            return (
                <If condition={filtered.length === 0} ifTrue={
                    <If condition={projectsSize > 0} ifTrue={
                        <PosInCenter fullHeight>
                            <Text text={"No projects to show, select filter option '**ALL**' to see all projects"} align={Align.CENTER}/>
                        </PosInCenter>
                    } ifFalse={
                        <PosInCenter fullHeight>
                            <Text text={"No project created yet."} align={Align.CENTER}/>
                        </PosInCenter>
                    }/>
                } ifFalse={
                    <LiteGrid responsive minResponsiveWidth={px(300)} gap={em(1)}>{
                        this.getFilteredProjects().map(project => <ProjectInfo
                            key={project.id}
                            onSelect={data => this.onProjectSelect(data)}
                            data={project}
                        />)
                    }</LiteGrid>
                }/>
            );
        }, "project");
    }

    private renderSubtitle(): JSX.Element {
        return (
            <If condition={this.state.loading} ifFalse={
                <FlexBox flexDir={FlexDirection.COLUMN} align={Align.CENTER} width={percent(100)}>
                    {this.renderFilterButtons()}
                    {this.component(() => (
                        <If condition={this.getFilter("name").active && !this.getFilter("all").active} ifTrue={
                            <Input opaque label={"Search for name"} visualMeaning={ObjectVisualMeaning.UI_NO_HIGHLIGHT} onChange={ev => {
                                this.local.state.debouncedFilterChange(ev.target.value);
                            }}/>
                        }/>
                    ), "filter")}
                </FlexBox>
            }/>
        );
    }

    private renderPage(): JSX.Element {
        const theme: Themeable.Theme = utilizeGlobalTheme();

        const profile = App.app().userData;

        return (
            <>
                <If condition={this.state.loading} ifFalse={this.renderSpeedDial()}/>
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
                                            <Icon icon={<SyncIcon/>} visualMeaning={ObjectVisualMeaning.UI_NO_HIGHLIGHT} colored/>
                                        ) : (
                                            <Icon icon={<SyncIcon/>} onClick={() => this.loadProjects()}/>
                                        )
                                    }
                                </span>
                            </CustomTooltip>
                            {/*<Separator orientation={Orientation.VERTICAL}/>
                            <CustomTooltip title={(
                                <Text text={"**Create a new project**\nBlank project or choose a template."}/>
                            )} arrow noBorder>
                                <span>
                                    <Icon icon={<CreateIcon/>} visualMeaning={ObjectVisualMeaning.INFO} colored={true} onClick={() => this.createProject()}/>
                                </span>
                            </CustomTooltip>*/}
                            <CustomTooltip title={(
                                <Text text={"Implement.."} rightAppendix={Badge.beta()} enableRightAppendix/>
                            )} arrow noBorder>
                                <span>
                                    <ProfilePicture name={"username"}/>
                                </span>
                            </CustomTooltip>
                        </FlexBox>
                    </LiteGrid>
                    <PosInCenter>
                        {this.renderSubtitle()}
                    </PosInCenter>

                    <If condition={this.state.loading} ifTrue={
                        <PosInCenter fullHeight>
                            <FlexBox gap={theme.gaps.defaultGab} align={Align.CENTER} justifyContent={Justify.CENTER}>
                                <PuffLoader color={theme.colors.warnHighlightColor.css()}/>
                                <Text text={"Loading from server"} bold uppercase coloredText visualMeaning={ObjectVisualMeaning.WARNING}/>
                            </FlexBox>
                        </PosInCenter>
                    } ifFalse={
                        <FlexBox height={percent(100)} width={percent(100)} overflowYBehaviour={OverflowBehaviour.SCROLL}>
                            {this.renderProjects()}
                        </FlexBox>
                    }/>
                </PageV2>
            </>
        );
    }

    private renderSpeedDial(): JSX.Element {
        const theme: Themeable.Theme = utilizeGlobalTheme();
        const infoVM: MeaningfulColors = getMeaningfulColors(ObjectVisualMeaning.INFO, theme);

        return this.component(state => (
            <>
                <Backdrop open={this.local.state.speedDialOpen} style={{
                    zIndex: 1000
                }}/>
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
                            backgroundColor: infoVM.main.withAlpha(.2).css(),
                            borderColor: infoVM.lighter.css(),
                            boxShadow: "0 0 0 4px " + infoVM.shadowColor.css()
                        },
                        ['& svg path']: {
                            fill: infoVM.icon.css() + " !important"
                        },
                        zIndex: 1100,
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
                        key={"create-empty-action"}
                        icon={<CreateIcon/>}
                        tooltipTitle={"Create empty"}
                        tooltipOpen
                        style={{
                            whiteSpace: "nowrap"
                        }}
                        onClick={event => {
                            this.createProject()
                        }}
                    />
                    <SpeedDialAction
                        key={"create-from-template-action"}
                        icon={<CreateIcon/>}
                        tooltipTitle={"Create from Template"}
                        style={{
                            whiteSpace: "nowrap"
                        }}
                        tooltipOpen
                        onClick={event => {}}
                    />
                </SpeedDial>
            </>
        ), "*", "dial")
    }

    componentDidMount() {
        DashboardPage.init().then(() => {
            if (this.state.projects === undefined || this.state.projects.length === 0 && !this.state.loading) {
                this.loadProjects();
            }
        });
    }

    render() {
        if (this.state.redirectToEditor) {
            console.log("redirect to editor")
            return (
                <Redirect to={"/editor"} push/>
            );
        } else {
            return this.renderPage();
        }
    }
}
