import React from "react";
import "../styles/pages/AppPage.scss";
import {BrowserRouter} from "react-router-dom";

export class AppPage extends React.Component<any, any> {

    componentDidMount() {

    }

    render() {
        return (
            <div className={"app"}>
                <BrowserRouter>

                </BrowserRouter>
            </div>
        );
    }
}
