import {BernieComponent} from "../../logic/BernieComponent";
import {Themeable} from "../../logic/style/Themeable";
import {Assembly} from "../../logic/assembly/Assembly";
import {UnitTestUtils} from "./UnitTestUtils";
import React from "react";
import {Flex} from "../../components/lo/FlexBox";
import {DevelopmentHuePlugToggleCard} from "../../projects/animate/components/DevelopmentHuePlugToggleCard";
import {Centered} from "../../components/lo/PosInCenter";
import {Button} from "../../components/lo/Button";
import {percent} from "../../logic/style/DimensionalMeasured";
import {Text} from "../../components/lo/Text";
import {v4} from "uuid";
import {Input} from "../../components/lo/Input";
import {Group} from "../../components/lo/Group";
import {HOCWrapper} from "../../components/HOCWrapper";
import fileDownload from "js-file-download";
import {AF} from "../../components/logic/ArrayFragment";
import {StringQuery} from "../../tests/atlas/components/queries/StringQuery";

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

                    <Button text={"StringQuery"} onClick={() => {
                        this.dialog(
                            <StringQuery title={"Choose multiplexer name"} onSubmit={string => {
                                this.dialog(
                                    <Text text={string}/>
                                );
                            }}/>
                        );
                    }}/>,

                    <Button text={"Get file"} onClick={() => {
                        const xmlHttp = new XMLHttpRequest();
                        xmlHttp.open("GET", "http://192.168.178.22:8080/files/", true);
                        xmlHttp.onreadystatechange = () => {
                            if (xmlHttp.readyState === 4) {
                                console.log(xmlHttp.response)
                                this.dialog(
                                    <img src={`data:image/jpg;base64, ${xmlHttp.response}`} alt={"Image"}/>
                                );
                            }
                        }
                        xmlHttp.send(body);
                    }}/>,

                    <HOCWrapper body={wrapper => {
                        type SharedFile = {
                            fileName: string,
                            content: string
                        }

                        return (
                            <AF elements={[
                                <Input autoFocus type={"file"} onChange={ev => {
                                    if (ev.target.files !== null) {
                                        const file: File = ev.target.files[0];
                                        const reader: FileReader = new FileReader();
                                        reader.onload = async (event: ProgressEvent<FileReader>) => {
                                            const src = event.target?.result;
                                            console.log("File content", src);
                                            const xmlHttp = new XMLHttpRequest();
                                            xmlHttp.open("POST", "http://192.168.178.22:8080/fss/", true);
                                            xmlHttp.onreadystatechange = () => {
                                                if (xmlHttp.readyState === XMLHttpRequest.DONE) {
                                                    this.dialog(
                                                        <Text text={`**HTTP:** '${xmlHttp.status}' **ID:** '${xmlHttp.response}'`}/>
                                                    );
                                                }
                                            }
                                            xmlHttp.send(JSON.stringify({
                                                fileName: file.name,
                                                content: src
                                            } as SharedFile));
                                        }
                                        reader.readAsDataURL(file);
                                    }
                                }}/>,

                                <HOCWrapper body={wrapper => {
                                    let id: String = "";

                                    function dataURItoBlob(dataURI: String): Blob {
                                        const byteString = atob(dataURI.split(',')[1]);
                                        const mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];
                                        const ab = new ArrayBuffer(byteString.length);
                                        const ia = new Uint8Array(ab);
                                        for (let i = 0; i < byteString.length; i++) {
                                            ia[i] = byteString.charCodeAt(i);
                                        }
                                        return new Blob([ab], {type: mimeString});
                                    }

                                    return (
                                        <Group width={percent(100)} elements={[
                                            <Input onChange={ev => id = ev.target.value}/>,
                                            <Button text={"Download"} onClick={() => {
                                                const xmlHttp = new XMLHttpRequest();
                                                xmlHttp.open("GET", `http://192.168.178.22:8080/fss/${id}`, true);
                                                xmlHttp.onreadystatechange = () => {
                                                    if (xmlHttp.readyState === XMLHttpRequest.DONE) {
                                                        const sf: SharedFile = JSON.parse(xmlHttp.response)
                                                        fileDownload(dataURItoBlob(sf.content), sf.fileName)
                                                        this.dialog(
                                                            <Text text={`**HTTP:** '${xmlHttp.status}'`}/>
                                                        );
                                                    }
                                                }
                                                xmlHttp.send();
                                            }}/>
                                        ]}/>
                                    );
                                }}/>
                            ]}/>
                        );
                    }}/>,







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
