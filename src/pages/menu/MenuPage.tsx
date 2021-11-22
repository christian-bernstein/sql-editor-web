import React from "react";
import "../../styles/pages/MenuPage.scss";
import {App} from "../../logic/App";

export type MenuPageProps = {
    showMenuInitially?: boolean
}

export type MenuPageState = {
    showMenu: boolean
}

export default class MenuPage extends React.Component<MenuPageProps, MenuPageState> {

    constructor(props: MenuPageProps) {
        super(props);
        this.state = {
            showMenu: (this.props.showMenuInitially) ? this.props.showMenuInitially : false
        };
    }

    // todo investigate bug!
    componentDidMount() {
        App.app().registerAction("show-menu", () => {
            this.setState({
                showMenu: true
            });
        });
    }

    private handleWrapperClick(event: React.MouseEvent<HTMLDivElement, MouseEvent>) {
        event.preventDefault();
        this.setState({
            showMenu: false
        });
    }

    render() {
        return (
            <div className={"menu-wrapper"}>
                <div
                    onClick={event => this.handleWrapperClick(event)}
                    className={["wrapper", this.state.showMenu ? "menu-showing" : ""].join(" ").trim()}>
                    {this.props.children}
                </div>
                <div className={["menu", this.state.showMenu ? "menu-showing" : ""].join(" ").trim()}>
                    <h3>Hello world</h3>
                </div>
            </div>
        );
    }
}
