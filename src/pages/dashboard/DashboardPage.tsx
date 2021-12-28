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
import {ProjectInfoData} from "../../logic/ProjectInfoData";
import {FlexBox} from "../../components/FlexBox";
import {PageV2} from "../../components/Page";

export type DashboardPageProps = {
}

export type DashboardPageState = {
    _a: string
}

export default class DashboardPage extends React.Component<DashboardPageProps, DashboardPageState> {

    constructor(props: DashboardPageProps) {
        super(props);
        this.state = {
            _a: "none"
        };
    }

    // noinspection JSMethodCanBeStatic
    private menuIconClickHandle(event: React.MouseEvent<SVGSVGElement, MouseEvent>) {
        App.app().openMenu();
    }

    // noinspection JSMethodCanBeStatic
    private onProjectSelect(data: ProjectInfoData) {
    }

    render() {
        return (
            <PageV2>
                <FlexBox>
                    <ProjectInfo
                        onSelect={data => this.onProjectSelect(data)}
                        data={{
                            id: v4(),
                            state: LoadState.ONLINE,
                            stator: true,
                            edits: 10,
                            lastEdited: new Date(),
                            title: "SQL lesson 21"
                        }}
                    />
                    <ProjectInfo
                        onSelect={data => this.onProjectSelect(data)}
                        data={{
                            id: v4(),
                            state: LoadState.ONLINE,
                            stator: true,
                            edits: 10,
                            lastEdited: new Date(),
                            title: "SQL lesson 21"
                        }}
                    />
                    <ProjectInfo
                        onSelect={data => this.onProjectSelect(data)}
                        data={{
                            id: v4(),
                            state: LoadState.ONLINE,
                            stator: true,
                            edits: 10,
                            lastEdited: new Date(),
                            title: "SQL lesson 21"
                        }}
                    />
                </FlexBox>
            </PageV2>
            //<div className={"dashboard-page"}>
            //    {/* header */}
            //    <div className={"dashboard-header"}>
            //        <div className={"left-icons"}>
            //            <MenuIcon onClick={event => this.menuIconClickHandle(event)}/>
            //        </div>
            //        <div className={"right-icons"}>
            //            <BadgedWrapper badgeFlowDirection={"right"} badge={<Badge background={Color.ofHex("71D99E")}>20</Badge>} showBadgeInitially={true}>
            //                <InboxIcon/>
            //            </BadgedWrapper>
            //            <BadgedWrapper badgeFlowDirection={"right"} badge={<Badge background={Color.ofHex("71D99E")}>4</Badge>} showBadgeInitially={false}>
            //                <FilterIcon/>
            //            </BadgedWrapper>
            //            <BadgedWrapper badgeFlowDirection={"right"} badge={<Badge background={Color.ofHex("71D99E")}>1</Badge>} showBadgeInitially={false}>
            //                <CreateIcon/>
            //            </BadgedWrapper>
            //        </div>
            //    </div>
//
            //    {/* title */}
            //    <div className={"dashboard-title"}>
            //        <p>Hello,</p>
            //        <h2 className={"name"}>Christian Bernstein</h2>
            //        <pre>{window.localStorage.getItem("session-id")}</pre>
            //        <pre>{this.state._a}</pre>
            //    </div>
//
            //    <FlexBox>
            //        <ProjectInfo
            //            onSelect={data => this.onProjectSelect(data)}
            //            data={{
            //                id: v4(),
            //                state: LoadState.ONLINE,
            //                stator: true,
            //                edits: 10,
            //                lastEdited: new Date(),
            //                title: "SQL lesson 21"
            //            }}
            //        />
            //    </FlexBox>
            //</div>
        );
    }
}
