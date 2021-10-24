import "../styles/components/Annotation.scss";
import React from "react";

export type AnnotationProps = {
    label: string,
    value: string,

}

export type AnnotationState = {

}

export class Annotation extends React.Component<AnnotationProps, AnnotationState> {

    constructor(props: AnnotationProps) {
        super(props);

    }


    render() {
        return(
            <>
            </>
        );
    }

}
