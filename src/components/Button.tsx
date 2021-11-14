import React, {MouseEventHandler} from "react";

export type ButtonProps = {
    onClick: MouseEventHandler<HTMLButtonElement>,

}

export class Button extends React.Component<ButtonProps, any>{

    constructor(props: ButtonProps) {
        super(props);
    }


    render() {
        return (
            <button onClick={this.props.onClick} className={"button"}>
                {this.props.children}
            </button>
        );
    }
}
