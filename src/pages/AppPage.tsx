import React from "react";
import "../styles/pages/AppPage.scss";
import {BrowserRouter, Route} from "react-router-dom";
import {DefaultSpecialPages} from "../logic/DefaultSpecialPages";
import {BoardingPage} from "./BoardingPage";

export class AppPage extends React.Component<any, any> {

    private readonly specialPageRenderers: Map<string, () => JSX.Element> = new Map<string, () => JSX.Element>([
        [DefaultSpecialPages.BOARDING, () => <></>]
    ]);

    public renderSpecialPage(id: string): JSX.Element | undefined {
        if (this.specialPageRenderers.has(id)) {
            return (this.specialPageRenderers.get(id) as () => JSX.Element)();
        } else return undefined;
    }

    componentDidMount() {

    }

    render() {
        return (
            <div className={"app"}>
                <BrowserRouter>
                    <Route path={"/boarding"} render={() => <BoardingPage/>}/>
                </BrowserRouter>
            </div>
        );
    }
}
