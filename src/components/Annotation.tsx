import "../styles/components/Annotation.scss";
import React from "react";

export type AnnotationProps = {
    label: string,
    value: string,
    badges?: JSX.Element[]
}

export type AnnotationState = {

}

export class Annotation extends React.Component<AnnotationProps, AnnotationState> {

    constructor(props: AnnotationProps) {
        super(props);
    }

    render() {
        return(
            <div className={"annotation"}>
                <p>{this.props.label}</p>
                <p className={"annotation-separator"}>:</p>
                <p>{this.props.value}</p>
                <div className={"annotation-badge-container"}>
                    {
                        this.props.badges ? this.props.badges.map(val => (
                            <div className={"annotation-badge"}>{val}</div>
                        )) : <></>
                    }
                </div>
            </div>
        );
    }
}
