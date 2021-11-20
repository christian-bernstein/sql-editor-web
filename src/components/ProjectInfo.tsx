import "../styles/components/ProjectInfo.scss";
import React from "react";
import {ReactComponent as ChainIcon} from "../assets/icons/ic-20/ic20-link.svg";
import {LoadState} from "../logic/LoadState";

export type ProjectInfoProps = {
    stator: boolean,
    contributorIDs: Array<string>,
    edits: number,
    rows: number,
    lastEdited: Date,
    title: string,
    state: LoadState
}

export class ProjectInfo extends React.Component<ProjectInfoProps, any> {

    constructor(props: ProjectInfoProps) {
        super(props);
    }

    render() {
        return (
            <div className={"project-info"}>
                <div className={"project-header"}>
                    <div className={"project-badge"}>
                        {this.props.stator ? <ChainIcon/> : <></>}
                    </div>
                    <div className={"project-contributors"}>

                    </div>
                </div>
                <h3 className={"project-title"}>{this.props.title}</h3>
                <div className={"project-charts"}>

                </div>
            </div>
        );
    }
}
