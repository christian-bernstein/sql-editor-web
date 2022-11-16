import {BernieComponent} from "../../logic/BernieComponent";
import {Themeable} from "../../logic/style/Themeable";
import {Assembly} from "../../logic/assembly/Assembly";
import {UnitTestUtils} from "./UnitTestUtils";
import React from "react";
import {Flex} from "../../components/lo/FlexBox";
import {DevelopmentHuePlugToggleCard} from "../../projects/animate/components/DevelopmentHuePlugToggleCard";
import {Centered} from "../../components/lo/PosInCenter";

export class QuickTest extends BernieComponent<any, any, any> {

    public static test = UnitTestUtils.createTestConfig({
        name: "quick-test",
        displayName: "Quick test",
        element: QuickTest,
        factory: Elem => <Elem/>
    });

    /**
     * Note: Test assembly can be re-rendered by calling the 'test' channel.
     */
    private testAssembly() {
        // You may use this pre-made utility function to rerender the test assembly
        const rerender = () => this.rerender("test");

        this.assembly.assembly("test", (theme, props) => {
            // Display your test component here
            let body = "";
            return (
                <Flex fw elements={[
                    // <CodeEditor value={body} theme={"dark"} classnames={["cm"]} upstreamHook={value => body = value}/>,
                    // <Button text={"Send"} width={percent(100)} onClick={() => {
                    //     const xmlHttp = new XMLHttpRequest();
                    //     xmlHttp.open("POST", "http://192.168.178.22:8080/", true);
                    //     xmlHttp.send(body);
                    // }}/>,
                    // <Flex fw height={px(500)} elements={[
                    //     <Editor
                    //         saveViewState
                    //         beforeMount={monaco => {
                    //             monaco.editor.defineTheme("SampleCommandPalette", {
                    //                 base: "vs-dark",
                    //                 inherit: true,
                    //                 rules: [
                    //                     { token: "", background: theme.colors.backgroundColor.toHex() }
                    //                 ],
                    //                 colors: {
                    //                     "editor.foreground": "#ffffff",
                    //                     "editor.background": theme.colors.backgroundColor.toHex()
                    //                 }
                    //             });
                    //         }}
                    //         onMount={(editor, monaco) => {
                    //             const update = (json: any) => {
                    //                 const candidate = (json as any[]).map((queueData: any) => {
                    //                     return `${queueData.name} :: ${queueData.idle_since}`;
                    //                 }).join("\n");
                    //
                    //                 if (candidate !== editor.getValue()) {
                    //                     editor.setValue(
                    //                         (json as any[]).map((queueData: any) => {
                    //                             return `${queueData.name} :: ${queueData.idle_since}`;
                    //                         }).join("\n")
                    //                     );
                    //                 }
                    //             }
                    //
                    //             setInterval(() => {
                    //                 fetch("http://192.168.178.22:8080/queues/").then(response => {
                    //                     response.json().then(json => update(json))
                    //                 }).catch(reason => console.error(reason))
                    //             }, 1e3)
                    //         }}
                    //         theme={"SampleCommandPalette"}
                    //         options={{
                    //             lineNumbers: 'off',
                    //             glyphMargin: false,
                    //             folding: false,
                    //             lineDecorationsWidth: 0,
                    //             lineNumbersMinChars: 0,
                    //             hideCursorInOverviewRuler: true,
                    //             renderValidationDecorations: "off",
                    //             overviewRulerBorder: false,
                    //             renderLineHighlight: "none",
                    //             codeLens: false,
                    //             cursorStyle: "block",
                    //             scrollbar: {
                    //                 vertical: "hidden",
                    //                 horizontal: "hidden"
                    //             },
                    //             minimap: {
                    //                 enabled: false
                    //             },
                    //             fontLigatures: true,
                    //             fontFamily: "OperatorMono",
                    //             fontWeight: "350",
                    //             fontSize: 12,
                    //             lineHeight: 21
                    //         }}
                    //     />
                    // ]}/>,

                    <Centered children={
                        <DevelopmentHuePlugToggleCard/>
                    }/>,

                    // <Box height={px(600)} fw overflowYBehaviour={OverflowBehaviour.SCROLL} elements={[
                    //     <Flex gap={px()} elements={
                    //         array(
                    //             <ReactCodeMirror
                    //                 value={"aiusdhiuahsidlaushdliauhsdliuahsd"}
                    //                 editable={false}
                    //                 theme={"dark"}
                    //                 width={"100%"}
                    //             />
                    //         , 1000)
                    //     }/>
                    // ]}/>
                ]}/>
            );
        });
    }

    init() {
        super.init();
        this.testAssembly();
    }

    componentRender(p: any, s: any, l: any, t: Themeable.Theme, a: Assembly): JSX.Element | undefined {
        return this.component(() => this.a("test"), "test");
    }
}
