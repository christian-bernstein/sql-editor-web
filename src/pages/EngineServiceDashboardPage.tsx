import "../styles/pages/EngineServiceDashboardPage.scss";
import React from "react";

export type EngineServiceDashboardProps = {

}

export type EngineServiceDashboardState = {

}

export class EngineServiceDashboardPage extends React.Component<EngineServiceDashboardProps, EngineServiceDashboardState> {

    constructor(props: EngineServiceDashboardProps) {
        super(props);
        // todo set state
    }

    private toggleGlobalExpansion(): void {

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

                            </div>
                        </div>
                    </div>
                </div>
            </>
        );
    }

}
