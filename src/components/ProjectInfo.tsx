import "../styles/components/ProjectInfo.scss";
import React from "react";
import {ProjectInfoData} from "../logic/ProjectInfoData";

export type ProjectInfoProps = {
    data: ProjectInfoData
}

export class ProjectInfo extends React.Component<ProjectInfoProps, any> {

    constructor(props: ProjectInfoProps) {
        super(props);
    }

    render() {
        return (
            <div className={"project-info"}>

            </div>
        );
    }
}
