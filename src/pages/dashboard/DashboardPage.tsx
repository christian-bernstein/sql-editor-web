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
import {Icon} from "../../components/Icon";
import {arrayFactory, Utils} from "../../logic/Utils";
import {PosInCenter} from "../../components/PosInCenter";
import {em, px} from "../../logic/DimensionalMeasured";
import {DBSessionCacheShard} from "../../shards/DBSessionCacheShard";
import {Redirect} from "react-router-dom";
import {ListProjectResponsePacketData} from "../../packets/in/ListProjectResponsePacketData";
import {Themeable} from "../../Themeable";
import {FlexDirection} from "../../logic/FlexDirection";
import {CircularProgress} from "@mui/material";

export type DashboardPageProps = {
}

export type DashboardPageState = {
    redirectToEditor: boolean,
    loading: boolean,
    projects: ProjectInfoData[]
}

export default class DashboardPage extends React.PureComponent<DashboardPageProps, DashboardPageState> {

    constructor(props: DashboardPageProps) {
        super(props);
        this.state = {
            redirectToEditor: false,
            loading: false,
            projects: []
        };
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
        });
        App.app().getConnector().call({
            protocol: "main",
            packetID: "ListProjectPacketData",
            data: {},
            callback: {
                handle: (connector, packet) => {
                    const lpr: ListProjectResponsePacketData = packet.data;
                    this.setState({
                        projects: lpr.projects
                    }, () => {
                        this.setState({
                            loading: false
                        });
                    });
                }
            }
        });
    }

    componentDidMount() {
        App.app().triggerLoginIfNotLoggedIn({
            processSuccessful: () => {
                console.log("try to load projects")
                // this.loadProjects();
            },
            processFinished: () => {
                console.log("login process finished")
            }
        });
    }

    private renderPage(): JSX.Element {
        const theme: Themeable.Theme = utilizeGlobalTheme();
        return (
            <PageV2>
                <LiteGrid columns={3}>
                    <FlexBox align={Align.START} justifyContent={Justify.CENTER}>
                        <Icon icon={<MenuIcon/>} onClick={() => App.app().openMenu()}/>
                    </FlexBox>
                    <FlexBox align={Align.CENTER} justifyContent={Justify.CENTER}>
                        <Text uppercase align={Align.CENTER} type={TextType.smallHeader} text={"Dashboard"} />
                    </FlexBox>
                </LiteGrid>
                <PosInCenter>
                    {
                        this.state.loading ? (
                            // todo fix progress width css bug (width maybe 1px wide..)
                            <FlexBox flexDir={FlexDirection.ROW} gap={theme.gaps.defaultGab}>
                                <CircularProgress variant={"indeterminate"} size={20} sx={{
                                    color: theme.colors.primaryHighlightColor.css()
                                }}/>
                                <Text uppercase align={Align.CENTER} type={TextType.secondaryDescription} text={"*Loading*"} />
                            </FlexBox>
                        ) : (
                            <Text uppercase align={Align.CENTER} type={TextType.secondaryDescription} text={"*Select a project*"} />
                        )
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
                        />, 3)
                    }
                    {
                        this.state.projects.map(project => <ProjectInfo
                            key={project.id}
                            onSelect={data => this.onProjectSelect(data)}
                            data={project}
                        />)
                    }
                </LiteGrid>
            </PageV2>
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
