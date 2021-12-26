import React from "react";
import {App} from "../../logic/App";
import {Themeable} from "../../Themeable";
import {Environment} from "../../logic/Environment";
import {BrowserRouter, Redirect, Route} from "react-router-dom";

export type CustodianPageProps = {
    appTitle: string
    specialLinks: {
        generalContactLink: string
    }
}

export type CustodianPageState = {}

export class CustodianPage extends React.Component<CustodianPageProps, CustodianPageState> {

    constructor(props: CustodianPageProps) {
        super(props);
        initApp();
    }

    render() {
        return (
            <div className={"custodian-page"}>
                <BrowserRouter>
                    <Route path={"/"} render={props => <Redirect push to={App.app().config.defaultAppRoute}/>}/>
                    <Route path={"/select"} render={props => <>choose subject</>}/>
                    <Route path={"/select/:subject"} render={props => <>choose course</>}/>
                    <Route path={"/:subject/:course"} render={props => <>choose course</>}/>
                </BrowserRouter>
            </div>
        );
    }
}

export function initApp() {
    // noinspection DuplicatedCode
    App.appOrCreate({
        appTitle: "Mutam",
        debugMode: true,
        defaultAppRoute: "select",
        logInterceptors: [],
        // todo implement
        rootRerenderHook: () => {},
        defaultDebugAppRoute: "/chart",
        themes: new Map<string, Themeable.Theme>([["dark-green", Themeable.defaultTheme]]),
        defaultTheme: "dark-green",
        logSaveSize: 250,
        connectorConfig: {
            protocol: "login",
            address: "ws:192.168.2.100:80",
            id: "ton",
            maxConnectAttempts: 50,
            connectionRetryDelayFunc: (i => 0.1 * (i) ** 2 * 1e3 - 10 * 1e3),
            packetInterceptor: (packet: Environment.Packet) => {
                console.log(packet);
            }
        }
    });
}

export function createCustodianPage(): JSX.Element {
    return <CustodianPage
        appTitle={"Mutam"}
        specialLinks={{
            generalContactLink: "https://mutam.de/kontakt.php?kurs=inf13&jahr=2021"
        }}
    />
}
