import React, {CSSProperties} from "react";
import {If} from "./If";
import {getOr} from "../logic/Utils";

export type TogglableProps = {
    initialActiveState?: boolean
    active: JSX.Element,
    inactive: JSX.Element,
    onChange?: (active: boolean) => void,
    wrapperStyle?: CSSProperties
}

export type TogglableState = {
    active: boolean
}

export class Togglable extends React.Component<TogglableProps, TogglableState> {

    constructor(params: TogglableProps) {
        super(params);
        this.state = {
            active: getOr(params.initialActiveState, false)
        };
    }

    private handleWrapperClick() {
        this.setState({
            active: !this.state.active
        }, () => this.props.onChange?.(this.state.active));
    }

    render() {
        return (
            <span style={getOr(this.props.wrapperStyle, {})} onClick={() => this.handleWrapperClick()}>
                <If condition={this.state.active} ifTrue={
                    this.props.active
                } ifFalse={
                    this.props.inactive
                }/>
            </span>

        );
    }
}
