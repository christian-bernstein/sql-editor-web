import "./IntercomPage.scss";
import React from "react";
import {IntercomButton} from "./IntercomButton";
import {ButtonActiveState} from "./ButtonActiveState";
import {ReactComponent as MicOnIcon} from "../../assets/icons/ic-24/ic24-mic.svg";
import {ButtonStyle} from "./ButtonStyle";

export type IntercomPageProps = {

}

export type IntercomPageState = {
    date: string,
    time: string
}

export class IntercomPage extends React.Component<IntercomPageProps, IntercomPageState> {

    constructor(props: IntercomPageProps) {
        super(props);
        this.state = {
            date: IntercomPage.clock("date"),
            time: IntercomPage.clock("time")
        }
    }

    componentDidMount() {
        setInterval(() => {
            this.setState({
                date: IntercomPage.clock("date"),
                time: IntercomPage.clock("time")
            })
        }, 1000);
    }

    render() {
        return(
            <div className={"intercom"}>
                <div className={"bar"}>
                    <p className={"date"}>{this.state.date}</p>
                    <p className={"time"}>{this.state.time}</p>
                </div>
                <div className={"floors"}>
                    <div className={"floor"}>
                        <div className={"floor-title"}>
                            <h3>2. Floor</h3>
                        </div>
                        <div className={"floor-actions"}>
                            <IntercomButton
                                title={"Freisprechanlage 2. Etage"}
                                types={new Map<ButtonActiveState, ButtonStyle>([
                                    [ButtonActiveState.ACTIVATED, {
                                        icon: <MicOnIcon/>,
                                        description: "Ein"
                                    }]
                                ])}
                                 defButtonStyle={{
                                     icon: <MicOnIcon/>,
                                     description: "Ein"
                                 }}
                                initialState={ButtonActiveState.ACTIVATED}
                            />
                            <IntercomButton
                                title={"1. Etage rufen"}
                                types={new Map<ButtonActiveState, ButtonStyle>([
                                    [ButtonActiveState.ACTIVATED, {
                                        icon: <MicOnIcon/>,
                                        description: ""
                                    }]
                                ])}
                                defButtonStyle={{
                                    icon: <MicOnIcon/>,
                                    description: ""
                                }}
                                initialState={ButtonActiveState.DEACTIVATED}
                            />
                        </div>
                    </div>
                </div>
            </div>

        );
    }

    private static clock(dateTime: "date" | "time"): string {
        const date: Date = new Date();
        if (dateTime === "time") {
            return date.toLocaleTimeString();
        } else {
            return date.toDateString();
        }
    }
}
