import "../styles/components/ProjectTracker.scss";
import React from "react";
import {App} from "../logic/App";

export type ProgressTrackerProps = {

}

export type ProgressTrackerState = {

}

export class ProgressTracker extends React.Component<ProgressTrackerProps, ProgressTrackerState> {

    componentDidMount() {
        // App.app().progressTrackerManager
        // todo register progress event listener
    }

    componentWillUnmount() {
        // todo unmount progress event listener
    }

    constructor(props: ProgressTrackerProps) {
        super(props);
    }

}
