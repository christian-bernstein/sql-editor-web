import React from "react";
import {Box} from "../../components/lo/Box";
import {Text, TextType} from "../../components/lo/Text";
import {createMargin} from "../../logic/style/Margin";
import styled, {StyledComponent} from "styled-components";
import {Themeable} from "../../logic/style/Themeable";
import {App} from "../../logic/app/App";
import {DimensionalMeasured} from "../../logic/style/DimensionalMeasured";
import {Dimension} from "../../logic/style/Dimension";
import {ReactComponent as PlayIcon} from "../../assets/icons/ic-16/ic16-play.svg";
import {TaskInformation} from "../../logic/misc/TaskInformation";
import {TaskPiece} from "../../logic/misc/TaskPiece";

export type ChartProps = {

}

export type ChartState = {
    task: TaskInformation,
    i: number
}

export class Chart extends React.Component<ChartProps, ChartState> {

    constructor(props: ChartProps) {
        super(props);
        this.state = {
            task: {
                id: "asd",
                description: "asdasd",
                attributes: new Map<string, any>(),
                title: "title",
                renderer: "default",
                pieces: [
                    {
                        title: "title 1",
                        description: "description",
                        renderer: "default",
                        attributes: new Map<string, any>()
                    },
                    {
                        title: "title 2",
                        description: "description",
                        renderer: "default",
                        attributes: new Map<string, any>()
                    },
                    {
                        title: "title 3",
                        description: "description",
                        renderer: "default",
                        attributes: new Map<string, any>()
                    },
                    {
                        title: "title 4",
                        description: "description",
                        renderer: "default",
                        attributes: new Map<string, any>()
                    },
                ]
            },
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
                }, 3000);
            })
        }, 1000);
    }

    render() {
        const theme: Themeable.Theme = App.app().getGlobalTheme();

        const Element = styled.div`
          display: grid;
          grid-template-columns: 14px 1fr;
          column-gap: 16px;
          cursor: default;  
          
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
              animation: pulsate 1.5s ease-out infinite;
              background-color: ${theme.colors.primaryColor.css()};
              // box-shadow: 0 0 0 4px ${theme.colors.borderPrimaryShadowColor.css()};
              width: 14px !important; 
              height: 14px; !important; 
              
              svg {
                visibility: visible;
              }
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
              visibility: hidden;
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

          @keyframes pulsate {
            0%   {
              box-shadow: 0 0 0 ${theme.colors.borderPrimaryShadowColor.css()};
            }
            50%  {
              box-shadow: 0 0 0 4px ${theme.colors.borderPrimaryShadowColor.css()};
            }
            100% {
              box-shadow: 0 0 0 ${theme.colors.borderPrimaryShadowColor.css()};
            }
          }
        `;

        return (
            <Box highlight={true}>
                <Text margin={createMargin(0, 0, 4, 0)} type={TextType.smallHeader} text={"Starting SQL-Editor session"}/>
                <Text type={TextType.secondaryDescription} margin={createMargin(0, 0, 20, 0)} text={"10.11.2021, 18:31"}/>

                <Element className={"completed"}>
                    <div className={"anchor"}/>
                    <div className={"title"}>
                        <Text type={TextType.smallHeader} text={"Staring server"}/>
                        <Text type={TextType.secondaryDescription} fontSize={DimensionalMeasured.of(12, Dimension.px)} text={"19:46:32"}/>
                    </div>
                    <div className={"line"}>
                        <div className={"slider"}/>
                    </div>
                    <div className={"description"}>
                        <Text type={TextType.secondaryDescription} margin={createMargin(2, 0, 0, 0)} text={""}/>
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
                    <div className={"anchor"}/>
                    <div className={"title"}>
                        <Text type={TextType.smallHeader} text={"Staring server"}/>
                        <Text type={TextType.secondaryDescription} fontSize={DimensionalMeasured.of(12, Dimension.px)} text={"19:46:32"}/>
                    </div>
                    <div className={"line"}>
                        <div className={"slider"}/>
                    </div>
                    <div className={"description"}>
                        <Text type={TextType.secondaryDescription} margin={createMargin(2, 0, 0, 0)} text={""}/>
                    </div>
                </Element>

                <Element className={"deactivated"}>
                    <div className={"anchor"}/>
                    <div className={"title"}>
                        <Text type={TextType.smallHeader} text={"Staring server"}/>
                        <Text type={TextType.secondaryDescription} fontSize={DimensionalMeasured.of(12, Dimension.px)} text={"19:46:32"}/>
                    </div>
                    <div className={"line"}>
                        <div className={"slider"}/>
                    </div>
                    <div className={"description"}>
                        <Text type={TextType.secondaryDescription} margin={createMargin(2, 0, 0, 0)} text={""}/>
                    </div>
                </Element>
            </Box>
        );
    }
}

export type ChartPieceProps = {
    initialData: TaskPiece
}

export type ChartPieceState = {
    data: TaskPiece
}

export class ChartPiece extends React.Component<ChartPieceProps, ChartPieceState> {

    constructor(props: ChartPieceProps) {
        super(props);
        this.state = {
            data: props.initialData
        };
    }

    setState<K extends keyof ChartPieceState>(state: ((prevState: Readonly<ChartPieceState>, props: Readonly<ChartPieceProps>) => (Pick<ChartPieceState, K> | ChartPieceState | null)) | Pick<ChartPieceState, K> | ChartPieceState | null, callback?: () => void) {
        super.setState(state, callback);
    }

    render() {
        const Element: StyledComponent<"div", any> = ChartPiece.getCSS();
        return (
            <Element className={"deactivated"}>
                <div className={"anchor"}/>
                <div className={"title"}>
                    <Text type={TextType.smallHeader} text={"Staring server"}/>
                    <Text type={TextType.secondaryDescription} fontSize={DimensionalMeasured.of(12, Dimension.px)} text={"19:46:32"}/>
                </div>
                <div className={"line"}>
                    <div className={"slider"}/>
                </div>
                <div className={"description"}>
                    <Text type={TextType.secondaryDescription} margin={createMargin(2, 0, 0, 0)} text={""}/>
                </div>
            </Element>
        );
    }

    private static getCSS(): StyledComponent<"div", any> {
        const theme: Themeable.Theme = App.app().getGlobalTheme();
        return styled.div`
          display: grid;
          grid-template-columns: 14px 1fr;
          column-gap: 16px;
          cursor: default;  
          
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
              animation: pulsate 1.5s ease-out infinite;
              background-color: ${theme.colors.primaryColor.css()};
              // box-shadow: 0 0 0 4px ${theme.colors.borderPrimaryShadowColor.css()};
              width: 14px !important; 
              height: 14px; !important; 
              
              svg {
                visibility: visible;
              }
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
              visibility: hidden;
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

          @keyframes pulsate {
            0%   {
              box-shadow: 0 0 0 ${theme.colors.borderPrimaryShadowColor.css()};
            }
            50%  {
              box-shadow: 0 0 0 4px ${theme.colors.borderPrimaryShadowColor.css()};
            }
            100% {
              box-shadow: 0 0 0 ${theme.colors.borderPrimaryShadowColor.css()};
            }
          }
        `;
    }
}
