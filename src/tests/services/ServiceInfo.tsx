import React from "react";
import {TitledContainer} from "../../components/TitledContainer";
import {ReactComponent as Server} from "../../assets/icons/server.svg";
import {Badge} from "../../components/Badge";
import {Color} from "../../Color";
import {ServiceLoadState} from "./ServiceLoadState";
import "./ServiceInfo.scss";
import {Annotation, AnnotationProps} from "../../components/Annotation";

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
        this.setState({
            expanded: false
        });
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
                            <div className={"service-container-body"}>
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
                            <div className={"collapsible-btn"} onClick={() => this.toggleExpansion()}/>
                        </>
                    }/>
            </>
        );
    }

    private toggleExpansion(open?: boolean): void {
        if(open != undefined) {
            this.setState({
                expanded: open
            })
        } else {
            this.setState({
                ...this.state,
                expanded: !this.state.expanded
            });
        }
    }
}
