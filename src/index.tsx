import React from 'react';
import ReactDOM from 'react-dom';
import './index.scss';
import './fonts.scss'
import {DriverReactBridge} from "./driver/DriverReactBridge";
import reportWebVitals from "./reportWebVitals";
import {driver, Driver, withDriver} from "./driver/Driver";
import {FacetReportHealth} from "./driver/FacetReportHealth";

withDriver(d => {
    d.analyticsManager.registerFacet({
        id: "test",
        value: 1,
        display: "Sin",
        valueHistory: [],
        valueToTextGenerator: value => ({
            main: (value as number).toFixed(2),
        }),
        healthAnalyzer: (value, facet) => {
            const number: number = value as number;
            const target = 0;
            const lastNumber = facet.valueHistory[facet.valueHistory.length - 1];
            const change = number - lastNumber;
            const delta = Math.abs(change);
            const up = change > 0;
            const significanceThreshold = 1;
            const overThreshold = delta >= significanceThreshold;

            console.log(overThreshold, delta)

            return {
                health: FacetReportHealth.GOOD,
                developmentRanking: Math.abs(number - target) > Math.abs(lastNumber - target) ? "BAD" : "GOOD",
                valueChangeType: overThreshold ? (up ? "UP" : "DOWN") : "SAME"
            }
        }
    });
})

let x = 0;
setInterval(() => {
    driver().analyticsManager.updateFacet("test", Math.sin(x += .1) * 20)
}, 2e3)

Driver.boot();

ReactDOM.render(<DriverReactBridge/>, document.getElementById('root'));

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals(console.log);
