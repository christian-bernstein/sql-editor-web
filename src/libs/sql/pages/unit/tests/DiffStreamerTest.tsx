import {BC} from "../../../../../logic/BernieComponent";
import {UnitTestUtils} from "../UnitTestUtils";
import React from "react";
import {Assembly} from "../../../../../logic/assembly/Assembly";
import {Themeable} from "../../../../../logic/style/Themeable";
import Editor from "@monaco-editor/react";
import {State} from "../../../../../logic/state/State";
import {Screen} from "../../../../../components/lo/Page";
import {Centered} from "../../../../../components/lo/PosInCenter";
import {Flex, FlexRow} from "../../../../../components/lo/FlexBox";
import {Align} from "../../../../../logic/style/Align";
import {px, vh} from "../../../../../logic/style/DimensionalMeasured";
import {Box} from "../../../../../components/lo/Box";
import {Text} from "../../../../../components/lo/Text";
import {Separator} from "../../../../../components/lo/Separator";

export type DiffStreamerTestGlobalState = {
    apiCallCount: number,
}

export const diffGlobalState: State<DiffStreamerTestGlobalState> = new State({
    apiCallCount: 0
})

export class DiffStreamerTest extends BC<any, any, any> {

    public static test = UnitTestUtils.createTestConfig({
        name: "DiffStreamerTest",
        displayName: "DiffStreamer Test",
        element: DiffStreamerTest,
        factory: Elem => <Elem/>
    });

    componentRender(p: any, s: any, l: any, t: Themeable.Theme, a: Assembly): JSX.Element | undefined {
        // diff()

        return (
            <Screen children={
                <Centered fullHeight children={
                    <FlexRow align={Align.CENTER} gap={px(40)} elements={[
                        <ProducerDisplay/>,
                        <NetDisplay/>,
                        <ServerDisplay/>,
                    ]}/>
                }/>
            }/>
        );
    }
}

export type SavePacket = {
    data: string
}

class ProducerDisplay extends BC<any, any, any> {

    componentDidMount() {
        super.componentDidMount();
        setInterval(() => this.rerender("clk"), 1e3);
    }

    componentRender(p: any, s: any, l: any, t: Themeable.Theme, a: Assembly): JSX.Element | undefined {
        return (
            <Box width={px(400)} height={vh(70)} elements={[
                <Flex fw fh gap={t.gaps.smallGab} elements={[
                    <Text text={"Producer"} align={Align.CENTER} bold uppercase/>,
                    <Separator/>,

                    <Editor theme={"vs-dark"} onChange={(value) => {
                    }}/>
                ]}/>
            ]}/>
        );
    }
}

class NetDisplay extends BC<any, any, any> {

    componentDidMount() {
        super.componentDidMount();
        setInterval(() => this.rerender("clk"), 1e3);
    }

    componentRender(p: any, s: any, l: any, t: Themeable.Theme, a: Assembly): JSX.Element | undefined {
        return (
            <Box width={px(400)} height={vh(70)} elements={[
                <Flex fw fh gap={t.gaps.smallGab} elements={[
                    <Text text={"Network"} align={Align.CENTER} bold uppercase/>,
                    <Separator/>,
                ]}/>
            ]}/>
        );
    }
}

class ServerDisplay extends BC<any, any, any> {

    componentDidMount() {
        super.componentDidMount();
        setInterval(() => this.rerender("clk"), 1e3);
    }

    componentRender(p: any, s: any, l: any, t: Themeable.Theme, a: Assembly): JSX.Element | undefined {
        return (
            <Box width={px(400)} height={vh(70)} elements={[
                <Flex fw fh gap={t.gaps.smallGab} elements={[
                    <Text text={"Server"} align={Align.CENTER} bold uppercase/>,
                    <Separator/>,
                ]}/>
            ]}/>
        );
    }
}
