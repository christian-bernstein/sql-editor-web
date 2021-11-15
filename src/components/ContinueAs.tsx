import React from "react";
import {SessionHistoryEntry} from "../logic/SessionHistoryEntry";
import {ReactComponent as ArrowRight} from "../assets/icons/ic-20/ic20-arrow-right.svg";
import {Img} from "react-image";
import {PuffLoader} from "react-spinners";
import "../styles/components/ContinueAs.scss";

export type ContinueAsProps = {
    sessionHistoryEntry: SessionHistoryEntry
}

export class ContinueAs extends React.Component<ContinueAsProps, any> {

    constructor(props: ContinueAsProps) {
        super(props);
    }

    render() {
        return (
            <div className={"session-history-entry"}>
                <div className={"name-container"}>
                    <p>Continue as {<span className={"name"}>{this.props.sessionHistoryEntry.userDisplayName}</span>}</p>
                    <Img className={"avatar"}
                         alt={"avatar"}
                         src={this.props.sessionHistoryEntry.userAvatarURL}
                         loader={<div className={"avatar-loader"}><PuffLoader color={"#A9E5C3"} size={"10px"}/></div>}/>
                </div>
                <div className={"icon"}>
                    <ArrowRight/>
                </div>
            </div>
        );
    }
}
