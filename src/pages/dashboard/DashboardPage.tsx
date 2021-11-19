import React from "react";
import "../../styles/pages/DashboardPage.scss";
import {BadgedWrapper} from "../../components/BadgedWrapper";
import {Badge} from "../../components/Badge";
import {Color} from "../../Color";
import {ReactComponent as InboxIcon} from "../../assets/icons/ic-24/ic24-inbox.svg";
import {ReactComponent as MenuIcon} from "../../assets/icons/ic-24/ic24-menu.svg";
import {ReactComponent as FilterIcon} from "../../assets/icons/ic-24/ic24-filter.svg";

export type DashboardPageProps = {

}

export type DashboardPageState = {

}

export default class DashboardPage extends React.Component<DashboardPageProps, DashboardPageState> {

    constructor(props: DashboardPageProps) {
        super(props);
    }

    render() {
        return (
            <div className={"dashboard-page"}>
                {/* header */}
                <div className={"dashboard-header"}>
                    <div className={"left-icons"}>
                        <MenuIcon/>
                    </div>
                    <div className={"right-icons"}>
                        <BadgedWrapper badgeFlowDirection={"right"} badge={<Badge background={Color.ofHex("71D99E")}>20</Badge>} showBadgeInitially={true}>
                            <InboxIcon/>
                        </BadgedWrapper>
                        <BadgedWrapper badgeFlowDirection={"right"} badge={<Badge background={Color.ofHex("71D99E")}>4</Badge>} showBadgeInitially={false}>
                            <FilterIcon/>
                        </BadgedWrapper>
                    </div>
                </div>

                {/* title */}
                <div className={"dashboard-title"}>
                    <p>Hello,</p>
                    <h2 className={"name"}>Christian Bernstein</h2>
                    <pre>{window.localStorage.getItem("session-id")}</pre>

                    {/* project view */}
                    <div className={"project-view"}>
                        <div className={"project-view-header"}>
                            <h2>SQL Projects</h2>
                        </div>
                    </div>

                    {/* template view */}
                    <div className={"template-view"}>
                        <div className={"template-view-header"}>
                            <h2>SQL Templates</h2>
                        </div>
                    </div>
                </div>
                {/* Content */}
                <div className={"dashboard-content"}>

                </div>
            </div>
        );
    }
}
