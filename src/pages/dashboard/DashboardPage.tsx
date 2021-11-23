import React from "react";
import "../../styles/pages/DashboardPage.scss";
import {BadgedWrapper} from "../../components/BadgedWrapper";
import {Badge} from "../../components/Badge";
import {Color} from "../../Color";
import {ReactComponent as InboxIcon} from "../../assets/icons/ic-24/ic24-inbox.svg";
import {ReactComponent as MenuIcon} from "../../assets/icons/ic-24/ic24-menu.svg";
import {ReactComponent as FilterIcon} from "../../assets/icons/ic-24/ic24-filter.svg";
import {ReactComponent as CreateIcon} from "../../assets/icons/ic-24/ic24-edit.svg";
import {ProjectInfo} from "../../components/ProjectInfo";
import {LoadState} from "../../logic/LoadState";
import {App} from "../../logic/App";
import {v4} from "uuid";

export type DashboardPageProps = {

}

export type DashboardPageState = {

}

export default class DashboardPage extends React.Component<DashboardPageProps, DashboardPageState> {

    constructor(props: DashboardPageProps) {
        super(props);
    }

    private menuIconClickHandle(event: React.MouseEvent<SVGSVGElement, MouseEvent>) {
        App.app().openMenu();
    }

    render() {
        return (
            <div className={"dashboard-page"}>
                {/* header */}
                <div className={"dashboard-header"}>
                    <div className={"left-icons"}>
                        <MenuIcon onClick={event => this.menuIconClickHandle(event)}/>
                    </div>
                    <div className={"right-icons"}>
                        <BadgedWrapper badgeFlowDirection={"right"} badge={<Badge background={Color.ofHex("71D99E")}>20</Badge>} showBadgeInitially={true}>
                            <InboxIcon/>
                        </BadgedWrapper>
                        <BadgedWrapper badgeFlowDirection={"right"} badge={<Badge background={Color.ofHex("71D99E")}>4</Badge>} showBadgeInitially={false}>
                            <FilterIcon/>
                        </BadgedWrapper>
                        <BadgedWrapper badgeFlowDirection={"right"} badge={<Badge background={Color.ofHex("71D99E")}>1</Badge>} showBadgeInitially={false}>
                            <CreateIcon/>
                        </BadgedWrapper>
                    </div>
                </div>

                {/* title */}
                <div className={"dashboard-title"}>
                    <p>Hello,</p>
                    <h2 className={"name"}>Christian Bernstein</h2>
                    <pre>{window.localStorage.getItem("session-id")}</pre>
                </div>

                {/* Content */}
                <div className={"dashboard-content"}>
                    {/* project view */}
                    <div className={"project-view"}>
                        <div className={"project-view-header"}>
                            <h2>SQL Projects</h2>
                            <div className={"projects"}>
                                {
                                    (() => {
                                        const arr: JSX.Element[] = [];
                                        arr.push(
                                            <ProjectInfo
                                                key={v4()}
                                                projectID={v4()}
                                                contributorIDs={["christian"]}
                                                state={LoadState.OFFLINE}
                                                stator={false}
                                                edits={10}
                                                rows={1023}
                                                lastEdited={new Date()}
                                                title={"Christian's great database"}
                                            />
                                        );
                                        arr.push(
                                            <ProjectInfo
                                                key={v4()}
                                                projectID={v4()}
                                                contributorIDs={["christian"]}
                                                state={LoadState.STOPPING}
                                                stator={false}
                                                edits={10}
                                                rows={1023}
                                                lastEdited={new Date()}
                                                title={"Christian's great database"}
                                            />
                                        );
                                        for (let i = 0; i < 20; i++) {
                                            arr.push(
                                                <ProjectInfo
                                                    key={v4()}
                                                    projectID={v4()}
                                                    contributorIDs={["christian"]}
                                                    state={LoadState.ONLINE}
                                                    stator={true}
                                                    edits={10}
                                                    rows={1023}
                                                    lastEdited={new Date()}
                                                    title={"SQL lesson 21"}
                                                />
                                            );
                                        }
                                        return arr;
                                    })()
                                }
                            </div>
                        </div>
                    </div>

                    {/* template view
                    <div className={"template-view"}>
                        <div className={"template-view-header"}>
                            <h2>SQL Templates</h2>
                            <div className={"templates"}>

                            </div>
                        </div>
                    </div>*/}
                </div>
            </div>
        );
    }
}
