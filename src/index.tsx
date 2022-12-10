import React from 'react';
import ReactDOM from 'react-dom';
import './styles/index.scss';
import './styles/fonts.scss'
import {AppPage} from "./pages/app/AppPage";
import {AppPageMode} from "./pages/app/AppPageMode";
import {getOr} from "./logic/Utils";
// import reportWebVitals from './reportWebVitals';

let mode: AppPageMode = Number(getOr(window.localStorage.getItem("app-page-mode"), AppPageMode.UNIT_TEST.toString()))

mode = AppPageMode.UNIT_TEST;

ReactDOM.render(
    <AppPage
        mode={mode}
    />,
    document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
// reportWebVitals(console.log);
