import React, {Component} from "react";
import {Box} from "@mui/material";
import {privateEncrypt} from "crypto";

export interface TabPanelProps {
    children?: React.ReactNode;
    direction?: string;
    height?: string;
    index: number;
    value: number;
}

export type TabPanelState = {
    index: number
}

export class TabPanel extends React.Component<TabPanelProps, TabPanelState>{

    constructor(props: TabPanelProps) {
        super(props);
        this.setState({
            index: 0
        });
    }

    render() {
        return(
            <div
                role="tabpanel"
                hidden={this.props.value !== this.props.index}
                id={`full-width-tabpanel-${this.props.index}`}
                aria-labelledby={`full-width-tab-${this.props.index}`}
            >
                {this.props.value === this.props.index && (
                    this.props.children
                )}
            </div>
        );
    }
}

