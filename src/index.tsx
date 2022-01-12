import React from 'react';
import ReactDOM from 'react-dom';
import './index.scss';
import './fonts.scss'
import reportWebVitals from './reportWebVitals';
import {AppPage} from "./pages/app/AppPage";
import {RegexPage} from "./tests/regex/RegexPage";

// <AppPage/>
// <RegexPageFC/>
// <React.StrictMode>
//     <RegexPageFC/>
// </React.StrictMode>
ReactDOM.render(
    <RegexPage/>,
    document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
