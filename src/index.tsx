import React from 'react';
import ReactDOM from 'react-dom';
import './index.scss';
import './fonts.scss'
import {DriverReactBridge} from "./driver/DriverReactBridge";
import reportWebVitals from "./reportWebVitals";
import {Driver} from "./driver/Driver";

Driver.boot();

ReactDOM.render(<DriverReactBridge/>, document.getElementById('root'));

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals(console.log);
