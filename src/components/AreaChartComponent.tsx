import React from "react";
import {Box} from "./Box";
import {utilizeGlobalTheme} from "../logic/App";
import ReactApexChart from "react-apexcharts";
import {OverflowBehaviour} from "../logic/OverflowBehaviour";
import {array, arrayFactory} from "../logic/Utils";
import {Dimension} from "../logic/Dimension";
import {DimensionalMeasured, px} from "../logic/DimensionalMeasured";
import {Text, TextType} from "./Text";
import styled from "styled-components";
import {Themeable} from "../Themeable";

export class AreaChartComponent extends React.Component<any, any> {

    render() {
        const theme: Themeable.Theme = utilizeGlobalTheme();
        const FrontWrapper = styled.div`
          z-index: 200;
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          display: flex;
          justify-content: center;
          align-items: center;
          flex-direction: row;
          gap: ${theme.gaps.defaultGab.css()};
        `;

        return (
            <Box overflowYBehaviour={OverflowBehaviour.HIDDEN}
                 paddingX={DimensionalMeasured.of(0, Dimension.em)}
                 paddingY={DimensionalMeasured.of(.25, Dimension.em)}
                 color={theme.colors.backgroundColor}>
                <FrontWrapper>
                    <Text text={String(Math.round(Math.random() * 100 * Math.random() * 10))} type={TextType.smallHeader} fontSize={px(20)}/>
                    <Text text={"Rows"}/>
                </FrontWrapper>
                <ReactApexChart type={"area"} height={"50"}
                                series={[
                                    {
                                        data: arrayFactory(() => Math.random() > .5 ? Math.random() * 100 : Math.random() * 50, 10)
                                    }
                                ]}
                                options={{
                                    chart: {
                                        toolbar: {
                                            show: false
                                        },
                                        type: 'area',
                                        height: 10,
                                        selection: {
                                            enabled: false
                                        },
                                        zoom: {
                                            enabled: false
                                        },
                                        sparkline: {
                                            enabled: true
                                        }
                                    },
                                    stroke: {
                                        width: .5
                                    },
                                    dataLabels: {
                                        enabled: false
                                    },
                                    tooltip: {
                                        enabled: false
                                    },
                                    xaxis: {
                                        axisBorder: {
                                            show: false
                                        },
                                        axisTicks: {
                                            show: false
                                        },
                                        categories: {
                                            enabled: false
                                        },
                                        labels: {
                                            show: false
                                        },
                                        tooltip: {
                                            enabled: false
                                        }
                                    },
                                    fill: {
                                        type: "gradient",
                                        colors: [utilizeGlobalTheme().colors.primaryHighlightColor.css(), utilizeGlobalTheme().colors.primaryHighlightColor.css()],
                                        gradient: {
                                            shadeIntensity: .10,
                                            opacityFrom: 0.002,
                                            opacityTo: 0.001,
                                            // stops: [50, 80, 40]
                                        }
                                    },
                                    colors: [utilizeGlobalTheme().colors.primaryHighlightColor.css(), utilizeGlobalTheme().colors.primaryHighlightColor.css()],
                                    yaxis: {
                                        max: 100,
                                        axisBorder: {
                                            show: false
                                        },

                                        axisTicks: {
                                            show: false
                                        },
                                        labels: {
                                            show: false
                                        },
                                        tooltip: {
                                            enabled: false
                                        }
                                    },
                                    grid: {
                                        show: false
                                    },
                                    series: [{
                                        name: 'sales',
                                        data: [30, 40, 35]
                                    }],
                                }}/>
            </Box>
        );
    }
}
