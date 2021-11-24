import React from "react";
import "../styles/components/SimpleErrorBadge.scss";
import {ReactComponent as ErrorIcon} from "../assets/icons/ic-16/ic16-warning.svg";

export class SimpleErrorBadge extends React.Component<any, any> {
    render() {
        return (
            <div className={"simple-error-badge"}>
                <ErrorIcon/>
                <p className={"simple-error-badge-text"}>error</p>
            </div>
        );
    }
}
