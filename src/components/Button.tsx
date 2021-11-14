import React, {CSSProperties, MouseEventHandler} from "react";
import "../styles/components/Button.scss";

export type ButtonProps = {
    onClick?: MouseEventHandler<HTMLButtonElement>,
    style?: CSSProperties,
    internalStyling?: boolean,
    theme: "default" | "primary"
}

export type ButtonState = {
    theme: "default" | "primary"
}

export class Button extends React.Component<ButtonProps, ButtonState>{

    constructor(props: ButtonProps) {
        super(props);
        this.setState({
            theme: props.theme === undefined ? "default" : this.props.theme
        });
    }

    render() {
        return (
            <button onClick={this.props.onClick}
                    className={["button", this.props.internalStyling ? ["internally-styled", this.state.theme !== undefined ? this.state.theme : ""] : ""].join(" ")}
                    style={this.props.style}>
                {this.props.children}
            </button>
        );
    }
}
