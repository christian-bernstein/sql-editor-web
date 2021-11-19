import React from "react";
import "../../styles/pages/AppPage.scss";
import "../../utils.scss";
import {BrowserRouter, Route, Link, Redirect} from "react-router-dom";
import {DefaultSpecialPages} from "../../logic/DefaultSpecialPages";
import {ReactComponent as InboxIcon} from "../../assets/icons/ic-24/ic24-inbox.svg";
import {BoardingPage} from "../boarding/BoardingPage";
import {LoginPage} from "../login/LoginPage";
import {BadgedWrapper} from "../../components/BadgedWrapper";
import {Badge} from "../../components/Badge";
import {Color} from "../../Color";
import DashboardPage from "../dashboard/DashboardPage";
import MenuPage from "../menu/MenuPage";

export type AppPageProps = {
}

export type AppPageState = {
    showMenu: boolean
}

export class AppPage extends React.Component<AppPageProps, AppPageState> {

    private readonly specialPageRenderers: Map<string, () => JSX.Element> = new Map<string, () => JSX.Element>([
        [DefaultSpecialPages.BOARDING, () => <></>]
    ]);

    constructor(props: AppPageProps) {
        super(props);
        this.state = {
            showMenu: false
        };
    }

    public renderSpecialPage(id: string): JSX.Element | undefined {
        if (this.specialPageRenderers.has(id)) {
            return (this.specialPageRenderers.get(id) as () => JSX.Element)();
        } else return undefined;
    }

    render() {
        return (
            <div className={"app"}>
                <BrowserRouter>
                    <MenuPage>
                        <Route path={"/boarding"} render={() => <BoardingPage/>}/>
                        <Route path={"/login"} render={() => <LoginPage/>}/>
                        <Route path={"/dashboard"} render={() => <DashboardPage/>}/>
                        <Route path={"/"} render={() => <Redirect push to={"/dashboard"}/>}/>
                    </MenuPage>
                </BrowserRouter>
            </div>
        );
    }
}
