import React from "react";
import "./IntercomButton.scss";
import {ButtonActiveState} from "./ButtonActiveState";
import {ButtonStyle} from "./ButtonStyle";

export type IntercomButtonProps = {
    title: string,
    types: Map<ButtonActiveState, ButtonStyle>,
    defButtonStyle: ButtonStyle,
    initialState: ButtonActiveState
}

export type IntercomButtonState = {
    activeState: ButtonActiveState
}

export class IntercomButton extends React.Component<IntercomButtonProps, IntercomButtonState> {

    constructor(props: IntercomButtonProps) {
        super(props);
        this.state = {
            activeState: props.initialState
        };
    }

    private getIcon(): JSX.Element {
        const style: ButtonStyle | undefined = this.props.types.get(this.state.activeState);
        if (style === undefined) {
            return this.props.defButtonStyle.icon;
        } else {
            return style.icon;
        }
    }

    private getDescription(): string {
        const style: ButtonStyle | undefined = this.props.types.get(this.state.activeState);
        if (style === undefined) {
            return this.props.defButtonStyle.description;
        } else {
            return style.description;
        }
    }

    render() {
        return (
            <div className={["button", this.state.activeState].join(" ")}>
                <div className={"button-background"}>
                </div>
                <div className={"button-body"}>
                    <div className={"button-title-container"}>
                        <h3 className={"button-title"}>{this.props.title}</h3>
                    </div>
                    <div className={"button-appendix"}>
                        <h3 className={"button-icon"}>{this.getIcon()}</h3>
                        <h3 className={"button-description"}>{this.getDescription()}</h3>
                    </div>
                </div>
            </div>
        );
    }
}
