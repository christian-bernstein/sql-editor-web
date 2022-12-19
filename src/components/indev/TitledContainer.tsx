import React from "react";
import "../../libs/sql/styles/components/TitledContainer.scss";

export type TitledContainerProps = {
    header: JSX.Element,
    body: JSX.Element
}

export class TitledContainer extends React.Component<TitledContainerProps, any> {

    constructor(props: TitledContainerProps) {
        super(props);
    }

    render() {
        return(
            <div className={"titled-container"}>
                <div className={"container-header"}>
                    {this.props.header}
                </div>
                <div className={"container-body"}>
                    {this.props.body}
                </div>
            </div>
        );
    }
}
