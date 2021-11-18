import React from 'react';
import ReactDOM from 'react-dom';
import './index.scss';
import './fonts.scss'
import reportWebVitals from './reportWebVitals';

import {ReactComponent as Warning} from "./assets/icons/warning.svg";
import {ReactComponent as Report} from "./assets/icons/report.svg";
import {Color} from "./Color";
import {Annotation, AnnotationProps} from "./components/Annotation";
import {TitledContainer} from "./components/TitledContainer";
import {Badge} from "./components/Badge";
import {ServiceInfo} from "./tests/services/ServiceInfo";
import {ServiceLoadState} from "./tests/services/ServiceLoadState";
import {ControlPanelComponent} from "./tests/panel/ControlPanel";
import {IntercomPage} from "./tests/intercom/IntercomPage";
import {Login} from "./tests/Learning";
import {App} from "./logic/App";
import {AppPage} from "./pages/app/AppPage";
import {BoardingPage} from "./pages/boarding/BoardingPage";


// 192.168.2.102
//<ControlPanelComponent
//             address={"ws:192.168.2.102:30001"}
//             connectorID={"panel"}
//         />

// <ServiceInfo
//             serviceID={"galileo"}
//             servicePath={"/engine/"}
//             serviceLoadState={ServiceLoadState.RUNNING}
//             kv={new Map<string, Array<AnnotationProps>>([
//                 ["Annotations", [
//                     {
//                         label: "uptime",
//                         value: "12:43:12 (0d, 1h, 14m)"
//                     },
//                     {
//                         label: "node",
//                         value: "node-1"
//                     },
//                     {
//                         label: "oc",
//                         value: "oc-node-1"
//                     },
//                     {
//                         label: "errors",
//                         value: "1",
//                         badges: [
//                             <Report fill={Color.ofHex("#F0CF7B").toHex()}/>
//                         ]
//                     }
//                 ]],
//                 ["Engine Annotations", [
//                     {
//                         label: "stator",
//                         value: "yes"
//                     },
//                     {
//                         label: "monitor",
//                         value: "no",
//                         badges: [
//                             <Warning fill={Color.ofHex("#F0CF7B").toHex()}/>
//                         ]
//                     },
//                 ]],
//             ])}
//         />

// <AppPage/>
// <BoardingPage/>
ReactDOM.render(
    <React.StrictMode>
        <AppPage/>
    </React.StrictMode>,
    document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
