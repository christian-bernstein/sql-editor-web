import React from "react";
import {Box} from "../../lo/Box";
import {utilizeGlobalTheme} from "../../../logic/app/App";
import ReactApexChart from "react-apexcharts";
import {OverflowBehaviour} from "../../../logic/style/OverflowBehaviour";
import {array, getOr} from "../../../logic/Utils";
import {Dimension} from "../../../logic/style/Dimension";
import {DimensionalMeasured, percent, px} from "../../../logic/style/DimensionalMeasured";
import {Text, TextType} from "../../lo/Text";
import styled from "styled-components";
import {getMeaningfulColors, MeaningfulColors, Themeable} from "../../../logic/style/Themeable";
import {WithVisualMeaning} from "../../../logic/style/WithVisualMeaning";
import {ObjectVisualMeaning} from "../../../logic/style/ObjectVisualMeaning";

export type AreaChartComponentProps = WithVisualMeaning & {
    series: number[],
    title: string,
    numIndicator: number,
    animated?: boolean
}

export class AreaChartComponent extends React.Component<AreaChartComponentProps, any> {

    constructor(props: AreaChartComponentProps) {
        super(props);
    }

    render() {
        const theme: Themeable.Theme = utilizeGlobalTheme();
        const mc: MeaningfulColors = getMeaningfulColors(getOr(this.props.visualMeaning, ObjectVisualMeaning.INFO), theme);
        const colors: any[] = array(mc.lighter.css(), 2);


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

                 width={percent(100)}

                 paddingX={DimensionalMeasured.of(0, Dimension.em)}
                 paddingY={DimensionalMeasured.of(.25, Dimension.em)}
                 color={theme.colors.backgroundColor}>
                <FrontWrapper>
                    <Text text={String(this.props.numIndicator)} type={TextType.smallHeader} fontSize={px(20)}/>
                    <Text text={this.props.title}/>
                </FrontWrapper>
                <ReactApexChart type={"area"} height={"50"}
                                series={[
                                    {
                                        data: this.props.series
                                    },
                                ]}
                                options={{
                                    chart: {
                                        animations: {
                                            enabled: this.props.animated
                                        },
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
                                        colors: colors,
                                        gradient: {
                                            shadeIntensity: .10,
                                            opacityFrom: 0.002,
                                            opacityTo: 0.001,
                                            // stops: [50, 80, 40]
                                        }
                                    },
                                    colors: colors,
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
