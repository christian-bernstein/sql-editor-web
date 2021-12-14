import "../styles/components/ProjectTracker.scss";
import React from "react";
import {App} from "../logic/App";
import {TaskInformation} from "../logic/TaskInformation";

export type ProgressTrackerProps = {
    taskID: string
}

export type ProgressTrackerState = {
    trackerID?: string
    task?: TaskInformation
}

export class ProgressTracker extends React.Component<ProgressTrackerProps, ProgressTrackerState> {

    constructor(props: ProgressTrackerProps) {
        super(props);
        this.state = {
            trackerID: undefined,
            task: undefined
        };
    }

    componentDidMount() {
        this.setState({
            trackerID: App.app().progressTrackerManager.mountProgressTracker(this.props.taskID, {

            })
        });
    }

    componentWillUnmount() {
        if (this.state.trackerID !== undefined) {
            App.app().progressTrackerManager.unmountProgressTracker(this.props.taskID, this.state.trackerID);
        }
    }
}
