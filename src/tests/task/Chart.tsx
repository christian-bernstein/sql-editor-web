import React from "react";
import {Box} from "../../components/Box";
import {Text, TextType} from "../../components/Text";
import {createMargin} from "../../logic/Margin";
import styled from "styled-components";
import {Themeable} from "../../Themeable";
import {App} from "../../logic/App";
import {DimensionalMeasured} from "../../logic/DimensionalMeasured";
import {Dimension} from "../../logic/Dimension";
import {ReactComponent as PlayIcon} from "../../assets/icons/ic-16/ic16-play.svg";

export type ChartProps = {

}

export type ChartState = {
    i: number
}

export class Chart extends React.Component<ChartProps, ChartState> {

    constructor(props: ChartProps) {
        super(props);
        this.state = {
            i: 0
        }
    }

    componentDidMount() {
        setTimeout(() => {
            this.setState({
                i: this.state.i + 1
            }, () => {
                setTimeout(() => {
                    this.setState({
                        i: this.state.i + 1
                    }, () => {
                        setTimeout(() => {
                            this.setState({
                                i: this.state.i + 1
                            })
                        }, 3000);
                    })
                }, 3000)
            })
        }, 1000);
    }

    render() {
        const theme: Themeable.Theme = App.app().getGlobalTheme();

        const Element = styled.div`
          display: grid;
          grid-template-columns: 14px 1fr;
          column-gap: 16px;
          
          &.completed {
            
            .anchor {
              width: 8px !important;
              height: 8px !important;
              background-color: ${theme.colors.primaryColor.css()};
              box-shadow: 0 0 0 4px ${theme.colors.borderPrimaryShadowColor.css()};
            }
            
            .line {
              .slider {
                height: 100%;
              }
            }
          }
          
          &.active {
            
            .anchor {
              background-color: ${theme.colors.primaryColor.css()};
              box-shadow: 0 0 0 4px ${theme.colors.borderPrimaryShadowColor.css()};
              width: 14px !important; 
              height: 14px; !important; 
            }
            
            .line {
              .slider {
                height: 0;
              }
            }
          }
          
          &.deactivated {
            
            .anchor {
              width: 8px !important;
              height: 8px !important;
            }
          }
          
          .anchor {
            justify-self: center;
            align-self: center;
            
            border-radius: 50px;
            background-color: ${theme.colors.backgroundDeactivatedColor.css()};
            display: flex;
            justify-content: center;
            align-items: center;
            
            svg {
              transform: scale(.9);
              justify-content: center;
              align-items: center;
              
              path {
                fill: ${theme.colors.iconColor.css()};
              }
            }            
          }

          .title {
            display: flex;
            gap: 10px;
            align-items: center;
            flex-direction: row;
          }

          .line {
            justify-self: center;
            align-self: center;
            width: 2px !important;
            min-height: 50px;
            height: 100%;
            border-radius: 50px;
            background-color: ${theme.colors.backgroundDeactivatedColor.css()};
            position: relative;
            overflow: hidden;
            
            .slider {
              transition: all 500ms;
              height: 0;
              position: absolute;
              top: 0;
              width: 100%;
              background-color: ${theme.colors.primaryColor.css()};
              border-radius: 50px;
            }
          }
          
          .center {
            width: 100%;
            max-width: 100%;
            display: flex;
            justify-content: center;
            align-items: center;
          }
          
          p {
            text-overflow: ellipsis;
            margin: 0;
          }
        `;

        return (
            <Box highlight={true}>
                <Text margin={createMargin(0, 0, 4, 0)} type={TextType.smallHeader}>Starting SQL-Editor session</Text>
                <Text type={TextType.secondaryDescription} margin={createMargin(0, 0, 20, 0)}>10.11.2021, 18:31</Text>

                <Element className={"completed"}>
                    <div className={"anchor"}/>
                    <div className={"title"}>
                        <Text type={TextType.smallHeader}>Staring server</Text>
                        <Text type={TextType.secondaryDescription} fontSize={DimensionalMeasured.of(12, Dimension.px)}>19:46:32</Text>
                    </div>
                    <div className={"line"}>
                        <div className={"slider"}/>
                    </div>
                    <div className={"description"}>
                        <Text type={TextType.secondaryDescription} margin={createMargin(2, 0, 0, 0)}/>

                    </div>
                </Element>

                <Element className={"completed"}>
                    <div className={"anchor"}/>
                    <div className={"title"}>
                        <Text type={TextType.smallHeader}>Load template data archive</Text>
                        <Text type={TextType.secondaryDescription} fontSize={DimensionalMeasured.of(12, Dimension.px)}>19:46:32</Text>
                    </div>
                    <div className={"line"}>
                        <div className={"slider"}/>
                    </div>
                    <div className={"description"}>
                        <Text type={TextType.secondaryDescription} margin={createMargin(2, 0, 0, 0)}/>
                    </div>
                </Element>

                <Element className={(() => {
                    if (this.state.i === 0) {
                        return "deactivated";
                    } else if (this.state.i === 1) {
                        return "active";
                    } else {
                        return "completed";
                    }
                })()}>
                    <div className={"anchor"}>
                        <PlayIcon/>
                    </div>
                    <div className={"title"}>
                        <Text type={TextType.smallHeader}>Transferring 1943322 rows</Text>
                        <Text type={TextType.secondaryDescription} fontSize={DimensionalMeasured.of(12, Dimension.px)}>19:46:32</Text>
                    </div>
                    <div className={"line"}>
                        <div className={"slider"}/>
                    </div>
                    <div className={"description"}>
                        <Text type={TextType.secondaryDescription} margin={createMargin(2, 0, 0, 0)}>2/6 blobs processed</Text>

                    </div>
                </Element>

                <Element className={"deactivated"}>
                    <div className={"anchor"}/>
                    <div className={"title"}>
                        <Text type={TextType.smallHeader}>Freeing resources</Text>
                        <Text type={TextType.secondaryDescription} fontSize={DimensionalMeasured.of(12, Dimension.px)}>19:46:32</Text>
                    </div>
                    <div className={"line"}>
                        <div className={"slider"}/>
                    </div>
                    <div className={"description"}>
                        <Text type={TextType.secondaryDescription} margin={createMargin(2, 0, 0, 0)}/>
                    </div>
                </Element>
            </Box>
        );
    }
}
