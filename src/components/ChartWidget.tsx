import React from "react";
import "../styles/components/ChartWidget.scss";

export type ChartWidgetProps = {
    title: string,
    value: string,
}

export class ChartWidget extends React.Component<ChartWidgetProps, any> {

    constructor(props: ChartWidgetProps) {
        super(props);
    }

    render() {
        return (
            <div className={"chart-widget"}>
                <div className={"chart-widget-foreground"}>
                    <p className={"value"}>{this.props.value}</p>
                    <p className={"title"}>{this.props.title}</p>
                </div>
            </div>
        );
    }
}
