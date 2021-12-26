import React from "react";
import {array} from "../../logic/Utils";
import {FlexBox} from "../../components/FlexBox";
import {FlexDirection} from "../../logic/FlexDirection";
import {Align} from "../../logic/Align";

let hook: () => void;

export class RerenderTest extends React.Component<any, {i: number}> {

    constructor(props: any) {
        super(props);
        this.state = {
            i: 0
        };
    }

    componentDidMount() {
        hook = () => this.setState({
            i: this.state.i + 1
        }, () => console.log("rerender completed"));
    }

    render() {
        return (
            <FlexBox flexDir={FlexDirection.ROW} align={Align.CENTER}>
                <RerenderTrigger/>
                <pre style={{margin: 0}}>{this.state.i}</pre>
                <pre style={{margin: 0}}>|</pre>
                {array(<SampleComponent/>, 10)}
            </FlexBox>
        );
    }
}

export const SampleComponent: React.FC = props => {
    return (
        <pre style={{margin: 0}}>{Math.round(Math.random() * 100)}</pre>
    );
}

export const RerenderTrigger: React.FC = props => {
    return (
        <button onClick={() => hook()}>rerender parent component</button>
    );
}
