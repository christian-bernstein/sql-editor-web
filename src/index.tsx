import React from 'react';
import ReactDOM from 'react-dom';
import './index.scss';
import reportWebVitals from './reportWebVitals';
import {ControlPanelComponent} from "./tests/panel/ControlPanel";

// 192.168.2.102
ReactDOM.render(
  <React.StrictMode>
      <ControlPanelComponent
          address={"ws:127.0.0.1:30001"}
          connectorID={"panel"}
      />
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals(console.info);
