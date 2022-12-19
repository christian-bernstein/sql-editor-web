import React, {CSSProperties, MouseEventHandler} from "react";
import "../../styles/components/Button.scss";
import {ComponentStyle} from "../../logic/style/ComponentStyle";

export type ButtonProps = {
    onClick?: MouseEventHandler<HTMLButtonElement>,
    style?: CSSProperties;
    internalStyling?: boolean;
    theme?: ComponentStyle;
}

export type ButtonState = {
    theme: ComponentStyle
}

export class _Button extends React.Component<ButtonProps, ButtonState>{

    constructor(props: ButtonProps) {
        super(props);
        this.state = {
            theme: props.theme === undefined ? ComponentStyle.DEFAULT : this.props.theme as ComponentStyle
        }
    }

    render() {
        return (
            <button onClick={this.props.onClick}
                    className={["button", this.props.internalStyling ? ["internally-styled", this.state.theme].join(" ") : ""].join(" ")}
                    style={this.props.style}>
                {this.props.children}
            </button>
        );
    }
}
