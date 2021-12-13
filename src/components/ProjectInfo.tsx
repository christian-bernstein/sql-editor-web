import "../styles/components/ProjectInfo.scss";
import React from "react";
import {ReactComponent as ChainIcon} from "../assets/icons/ic-20/ic20-link.svg";
import {LoadState} from "../logic/LoadState";
import {ChartWidget} from "./ChartWidget";
import {ProjectInfoData} from "../logic/ProjectInfoData";

export type ProjectInfoProps = {
    data: ProjectInfoData,
    onSelect?: (data: ProjectInfoData) => void
}

export class ProjectInfo extends React.Component<ProjectInfoProps, any> {

    constructor(props: ProjectInfoProps) {
        super(props);
    }

    private onClick(event: React.MouseEvent<HTMLDivElement, MouseEvent>) {
        if (this.props.onSelect !== undefined) {
            this.props.onSelect(this.props.data);
        }
    }

    render() {
        return (
            <div className={"project-info"} onClick={event => this.onClick(event)}>
                <div className={"project-header"}>
                    <div className={[
                        "project-badge",
                        this.props.data.state === LoadState.STOPPING ? "error" : "",
                        this.props.data.state === LoadState.STARTING ? "warn" : "",
                        this.props.data.state === LoadState.ONLINE ? "online" : "",
                        this.props.data.state === LoadState.OFFLINE ? "offline" : "",
                    ].join(" ").trim()}>
                        {this.props.data.stator ? <ChainIcon/> : <></>}
                    </div>
                    <div className={"project-contributors"}>

                    </div>
                </div>
                <h3 className={"project-title"}>{this.props.data.title}</h3>
                <div className={"project-charts"}>
                    {/*<ChartWidget title={"Rows"} value={"200"}/>*/}
                    <ChartWidget title={"Edits"} value={"24"}/>
                    <ChartWidget title={"Last edited"} value={"32min"}/>
                </div>
            </div>
        );
    }
}
