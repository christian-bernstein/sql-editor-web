import React from "react";
import {TitledContainer} from "../../libs/sql/components/indev/TitledContainer";
import {ReactComponent as Server} from "../../assets/icons/server.svg";
import {ReactComponent as Chevron} from "../../assets/icons/chevron-up.svg";
import {Badge} from "../../libs/sql/components/lo/Badge";
import {Color} from "../../libs/sql/logic/style/Color";
import {ServiceLoadState} from "./ServiceLoadState";
import "./ServiceInfo.scss";
import {Annotation, AnnotationProps} from "../../libs/sql/components/lo/Annotation";

export type ServiceInfoProps = {
    servicePath?: string,
    serviceID: string,
    serviceLoadState: ServiceLoadState,
    kv: Map<string, AnnotationProps[]>
}

export type ServiceInfoState = {
    expanded: boolean
}

export class ServiceInfo extends React.Component<ServiceInfoProps, ServiceInfoState> {

    constructor(props: ServiceInfoProps) {
        super(props);
        this.state = {
            expanded: false
        }
    }

    render() {
        return(
            <>
                <TitledContainer
                    header={
                        <div className={"service-container-header"}>
                            <Server className={"icon"}/>
                            <div className={"service-path"}>
                                <p style={{margin: 0}}>{this.props.servicePath != undefined ? this.props.servicePath : "/"}</p>
                                <Badge background={Color.ofHex("#F0CF7B")}><p style={{fontWeight: "bold", margin: 0}}>{this.props.serviceID}</p></Badge>
                            </div>
                        </div>
                    }
                    body={
                        <>
                            <div className={["service-container-body", this.state.expanded ? "expanded" : "collapsed"].join(" ").trim()}>
                                {
                                    Array.from(this.props.kv.keys()).map(k => {
                                        return(
                                            <div className={"service-annotation-container"}>
                                                <p className={"annotation-container-header"}>{k}</p>
                                                {(this.props.kv.get(k) as AnnotationProps[]).map(annotation => {
                                                    return(
                                                        <Annotation
                                                            label={annotation.label}
                                                            value={annotation.value}
                                                            badges={annotation.badges}
                                                        />
                                                    );
                                                })}
                                            </div>
                                        )
                                    })
                                }
                            </div>
                            <div className={["collapsible-btn", this.state.expanded ? "expanded" : "collapsed"].join(" ").trim()} >
                                <div onClick={() => this.toggleExpansion()}>
                                    <Chevron/>
                                </div>
                            </div>
                        </>
                    }/>
            </>
        );
    }

    private toggleExpansion(open?: boolean): void {
        if(open != undefined) {
            this.setState({
                expanded: open
            });
        } else {
            this.setState({
                expanded: !this.state.expanded
            });
        }
    }
}
