import React from 'react';
import ReactDOM from 'react-dom';
import './index.scss';
import './fonts.scss'
import reportWebVitals from './reportWebVitals';

import {ReactComponent as Warning} from "./assets/icons/warning.svg";
import {Color} from "./Color";
import {Annotation} from "./components/Annotation";
import {TitledContainer} from "./components/TitledContainer";
import {Badge} from "./components/Badge";

//import {ControlPanelComponent} from "./tests/panel/ControlPanel";
//<ControlPanelComponent
//    address={"ws:192.168.2.102:30001"}
//    connectorID={"panel"}
//>

// 192.168.2.102
ReactDOM.render(
    <React.StrictMode>
        <TitledContainer
            header={<>
                <p style={{margin: 0}}>/infrastructure/</p>
                <Badge background={Color.ofHex("#F0CF7B")}><p style={{fontWeight: "bold", margin: 0}}>deimos</p></Badge>
            </>}
            body={<Annotation
                label={"uptime"}
                value={"12:43:12 (0d, 1h, 14m)"}
                badges={[
                    <Warning fill={Color.ofHex("#F0CF7B").toHex()}/>
                ]}
            />}
        />


    </React.StrictMode>,
    document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
