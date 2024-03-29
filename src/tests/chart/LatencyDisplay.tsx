import {BernieComponent} from "../../libs/sql/logic/BernieComponent";
import {Themeable} from "../../libs/sql/logic/style/Themeable";
import {Assembly} from "../../libs/sql/logic/assembly/Assembly";
import {Centered} from "../../libs/sql/components/lo/PosInCenter";
import {AreaChartComponent} from "../../libs/sql/components/ho/areaChart/AreaChartComponent";
import {Screen} from "../../libs/sql/components/lo/Page";
import React from "react";
import {ObjectVisualMeaning} from "../../libs/sql/logic/style/ObjectVisualMeaning";
import {App} from "../../libs/sql/logic/app/App";
import {PingPacketData} from "../../libs/sql/packets/out/PingPacketData";
import {PongPacketData} from "../../libs/sql/packets/in/PongPacketData";
import {array, getOr} from "../../libs/sql/logic/Utils";

export class LatencyDisplay extends BernieComponent<any, any, {
    series: number[],
}> {

    private static readonly cacheSize: number = 20;

    private interval?: any

    constructor() {
        super(undefined, undefined, {
            series: array(0, LatencyDisplay.cacheSize)
        });
    }

    componentWillUnmount() {
        super.componentWillUnmount();
        if (this.interval !== undefined) {
            clearInterval(this.interval);
        }
    }

    componentDidMount() {
        super.componentDidMount();
        App.app().getConnector().latencyCacheUpdateCallbacks.push(con => {
            this.controller.rerender("chart-data");
        });
    }

    componentRender(p: any, s: any, l: any, t: Themeable.Theme, a: Assembly): JSX.Element | undefined {
        return this.component(local => {
            const records = App.app().getConnector().latencyRecords;
            const latency = records.length > 0 ? records[records.length - 1].latency : 0;

            return (
                <AreaChartComponent
                    series={records.map(rec => rec.latency)}
                    title={"ms"}
                    visualMeaning={latency > 50 ? ObjectVisualMeaning.WARNING : ObjectVisualMeaning.SUCCESS}
                    numIndicator={latency}
                />
            )
        }, "chart-data");
    }
}
