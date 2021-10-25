import "../styles/pages/EngineServiceDashboardPage.scss";
import React from "react";
import {ReactComponent as UnfoldLess} from "../assets/icons/ic-20/ic20-unfold-less.svg";
import {ReactComponent as UnfoldMore} from "../assets/icons/ic-20/ic20-unfold-more.svg";
import {ServiceInfoProps} from "../tests/services/ServiceInfo";

export type EngineServiceDashboardProps = {
    services: ServiceInfoProps[]
}

export type EngineServiceDashboardState = {
    globalExpanded: boolean,
    services: ServiceInfoProps[]
}

export class EngineServiceDashboardPage extends React.Component<EngineServiceDashboardProps, EngineServiceDashboardState> {

    constructor(props: EngineServiceDashboardProps) {
        super(props);
        this.state = {
            globalExpanded: false,
            services: props.services
        };
    }

    private toggleGlobalExpansion(): void {
        this.setState({
            globalExpanded: !this.state.globalExpanded
        });
        if (this.state.globalExpanded) {

        } else {

        }
    }

    private updateGlobalExpanded(): void {

    }

    render() {
        return(
            <>
                <div className={"engine-service-dashboard-container"}>
                    <div className={"engine-service-dashboard-container-header"}>
                        <div className={"e-s-d-c-h-left-align"}>
                            <h2>Services</h2>
                        </div>
                        <div className={"e-s-d-c-h-right-align"}>
                            <div className={"e-s-d-c-expand-toggle"} onClick={() => this.toggleGlobalExpansion()}>
                                {
                                    this.state.globalExpanded ? <UnfoldLess/> : <UnfoldMore/>
                                }
                                <h4 className={"e-s-d-c-expand-toggle-label"}>
                                    {
                                        this.state.globalExpanded ? "Collapse" : "Expand"
                                    }
                                </h4>
                            </div>
                        </div>
                    </div>
                    <div className={"engine-service-dashboard-container-body"}>

                    </div>
                </div>
            </>
        );
    }

}
