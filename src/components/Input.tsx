import "../styles/components/Input.scss";
import React, {ChangeEvent} from "react";
import {v4} from "uuid";

export type InputProps = {
    defaultValue?: string,
    label: string,
    onChange: (ev: ChangeEvent<HTMLInputElement>) => void
}

export type InputState = {
    value: string,
    id: string
}

export class Input extends React.Component<InputProps, InputState> {

    constructor(props: InputProps) {
        super(props);
        this.state = {
            value: props.defaultValue === undefined ? "" : this.props.defaultValue as string,
            id: v4()
        };
    }

    private onInputChange(ev: ChangeEvent<HTMLInputElement>) {
        this.props.onChange(ev);
        this.setState({
            value: ev.target.value
        });
    }

    private toggleFocus(event: React.FocusEvent<HTMLInputElement>) {
        console.log("asd");
    }

    render() {
        return (
            <div className={"input-container"}>
                <input id={this.state.id}
                       spellCheck={false}
                       onChange={event => this.onInputChange(event)}
                       value={this.state.value}
                       onFocus={event => this.toggleFocus(event)}
                       placeholder={" "}
                />
                <label htmlFor={this.state.id}>{this.props.label}</label>
            </div>
        );
    }
}
