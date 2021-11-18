import React from "react";
import "../styles/pages/AppPage.scss";
import "../utils.scss";
import {BrowserRouter, Route, Link} from "react-router-dom";
import {DefaultSpecialPages} from "../logic/DefaultSpecialPages";
import {ReactComponent as InboxIcon} from "../assets/icons/ic-24/ic24-inbox.svg";
import {BoardingPage} from "./BoardingPage";
import {LoginPage} from "../tests/login/LoginPage";
import {BadgedWrapper} from "../components/BadgedWrapper";
import {Badge} from "../components/Badge";
import {Color} from "../Color";

export class AppPage extends React.Component<any, any> {

    private readonly specialPageRenderers: Map<string, () => JSX.Element> = new Map<string, () => JSX.Element>([
        [DefaultSpecialPages.BOARDING, () => <></>]
    ]);

    public renderSpecialPage(id: string): JSX.Element | undefined {
        if (this.specialPageRenderers.has(id)) {
            return (this.specialPageRenderers.get(id) as () => JSX.Element)();
        } else return undefined;
    }

    render() {
        return (
            <div className={"app"}>
                <BrowserRouter>
                    <Route path={"/boarding"} render={() => <BoardingPage/>}/>
                    <Route path={"/login"} render={() => <LoginPage/>}/>
                    <Route path={"/dashboard"} render={() => (
                        <>
                            <h3>Dashboard</h3>
                            <pre>{window.localStorage.getItem("session-id")}</pre>
                            <BadgedWrapper badgeFlowDirection={"right"} badge={<Badge background={Color.ofHex("71D99E")}>105</Badge>} showBadgeInitially={true}>
                                <InboxIcon/>
                            </BadgedWrapper>
                        </>
                    )}/>
                    <Route path={"/"} render={() => <Link to={"/boarding"}>Enter Boarding</Link>}/>
                </BrowserRouter>
            </div>
        );
    }
}
