import React from "react";
import {getOr} from "../../logic/Utils";
import {RenderExecutorProps} from "./RenderExecutorProps";

export class RenderExecutor extends React.Component<RenderExecutorProps> {

    componentDidMount() {
        this.props.componentDidMountRelay({
            rerenderHook: () => {
                this.forceUpdate();
            },
            channels: getOr(this.props.channels, []),
            id: this.props.id
        })
    }

    componentWillUnmount() {
        this.props.upstreamOnComponentUnmountHandler?.(this.props.id);
    }

    render() {
        return (
            <>
                {this.props.componentFactory()}
                {this.props.children}
            </>
        );
        // todo investigate bug
        // console.log("rerender")
        // if (getOr(this.props.renderChildren, false)) {
        //     return (
        //         <>
        //             {this.props.componentFactory()}
        //             {this.props.children}
        //         </>
        //     )
        // } else return <>{String(getOr(this.props.renderChildren, false))}</>;
    }
}
