import {BC} from "../sql/logic/BernieComponent";
import {Assembly} from "../sql/logic/assembly/Assembly";
import {Themeable} from "../sql/logic/style/Themeable";
import {Screen} from "../sql/components/lo/Page";
import {Centered} from "../sql/components/lo/PosInCenter";
import {Flex} from "../sql/components/lo/FlexBox";
import {Align} from "../sql/logic/style/Align";
import {Button} from "../../comsys/renaissance/components/Button";
import axios from "axios";
import {HOCWrapper} from "../sql/components/HOCWrapper";
import {AF} from "../sql/components/logic/ArrayFragment";

export class PortfolioMain extends BC<any, any, any> {

    componentDidMount() {
        super.componentDidMount();
        setInterval(() => this.rerender("con"), 1e3);

    }

    componentRender(p: any, s: any, l: any, t: Themeable.Theme, a: Assembly): JSX.Element | undefined {
        return (
            <Screen style={{ backgroundColor: "white" }} children={
                <Centered fullHeight children={
                    <Flex align={Align.CENTER} elements={[
                        this.component(() => {
                            if (navigator.onLine) {
                                return (
                                    <>Online; {new Date().toLocaleTimeString()}</>
                                );
                            } else return <>Offline; {new Date().toLocaleTimeString()}</>;
                        }, "con"),

                        <Button text={"Start websocket service"} onClick={() => {

                            const socket = new WebSocket("ws://192.168.178.22:8080/test");

                            socket.onopen = ev => {
                                console.log("Opened socket connection");
                            }

                            socket.onmessage = ev => {
                                this.dialog(
                                    <HOCWrapper body={wrapper => {
                                        const context = new AudioContext();

                                        function playSound(arr: any) {
                                            const buf = new Float32Array(arr.length);
                                            for (let i = 0; i < arr.length; i++) buf[i] = arr[i];
                                            const buffer = context.createBuffer(1, buf.length, context.sampleRate);
                                            buffer.copyToChannel(buf, 0)
                                            const source = context.createBufferSource();
                                            source.buffer = buffer;
                                            source.connect(context.destination);
                                            source.start(0);
                                        }

                                        function sineWaveAt(sampleNumber: any, tone: any) {
                                            const sampleFreq = context.sampleRate / tone;
                                            return Math.sin(sampleNumber / (sampleFreq / (Math.PI * 2)))
                                        }

                                        const arr: number[] = [], volume = 0.2, seconds = 0.5, tone = 441;
                                        for (let i = 0; i < context.sampleRate * seconds; i++) arr[i] = sineWaveAt(i, tone) * volume;

                                        const gen = (tone: number = 441, volume: number = .2, seconds: number = .5) => {
                                            const arr: number[] = [];
                                            for (let i = 0; i < context.sampleRate * seconds; i++) arr[i] = sineWaveAt(i, tone) * volume;
                                            return arr;
                                        }

                                        const hz441 = gen(441, 1), hzLow = gen(392);

                                        const concat = (base: number[], ...appendices: number[][]) => {
                                            return base.concat(...appendices);
                                        }

                                        let interval = setInterval(() => {
                                            playSound(hz441);
                                        }, 1e3);

                                        return (
                                            <Button text={"Acknowledge"} onClick={() => {
                                                clearInterval(interval);
                                                this.closeLocalDialog();
                                            }}/>
                                        );
                                    }}/>
                                );
                            }


                        }}/>,

                        <Button text={"Call"} onClick={() => {
                            axios({
                                method: "post",
                                baseURL: "http://192.168.178.22:9090/call"
                            });
                        }}/>,

                        <Button text={"Start net monitor"} onClick={() => {
                            const context = new AudioContext();

                            function playSound(arr: any) {
                                const buf = new Float32Array(arr.length);
                                for (let i = 0; i < arr.length; i++) buf[i] = arr[i];
                                const buffer = context.createBuffer(1, buf.length, context.sampleRate);
                                buffer.copyToChannel(buf, 0)
                                const source = context.createBufferSource();
                                source.buffer = buffer;
                                source.connect(context.destination);
                                source.start(0);
                            }

                            function sineWaveAt(sampleNumber: any, tone: any) {
                                const sampleFreq = context.sampleRate / tone;
                                return Math.sin(sampleNumber / (sampleFreq / (Math.PI * 2)))
                            }

                            const arr: number[] = [], volume = 0.2, seconds = 0.5, tone = 441;
                            for (let i = 0; i < context.sampleRate * seconds; i++) arr[i] = sineWaveAt(i, tone) * volume;

                            const gen = (tone: number = 441, volume: number = .2, seconds: number = .5) => {
                                const arr: number[] = [];
                                for (let i = 0; i < context.sampleRate * seconds; i++) arr[i] = sineWaveAt(i, tone) * volume;
                                return arr;
                            }

                            const hz441 = gen(), hzLow = gen(392);

                            const concat = (base: number[], ...appendices: number[][]) => {
                                return base.concat(...appendices);
                            }

                            let acknowledged = false;
                            setInterval(() => {
                                axios("/ping", {
                                    method: "get",
                                    timeout: 2e3,
                                    baseURL: "http://192.168.178.66:8080",
                                }).then(() => {
                                    if (acknowledged) {
                                        playSound(concat(hzLow, hz441));
                                        acknowledged = false;
                                    }
                                }).catch(() => {
                                    if (!acknowledged) {
                                        playSound(concat(hz441, hzLow));
                                        acknowledged = true;
                                    }
                                });
                            }, 1e3 * 1.2);

                            playSound(arr);
                        }}/>,

                        // <HOCWrapper body={wrapper => {
                        //     let rec: MediaRecorder;
                        //     return (
                        //         <AF elements={[
                        //             <audio id="voice" controls/>,
                        //             <Button text={"Toggle call"} onClick={() => {
                        //                 if (rec !== undefined) {
                        //                     rec.stop();
                        //                 }
                        //                 navigator.mediaDevices.getUserMedia({audio:true}).then(stream => {
                        //                     const audioChunks = new Array<Blob>();
                        //                     rec = new MediaRecorder(stream);
                        //                     rec.ondataavailable = ev => {
                        //                         audioChunks.push(ev.data);
                        //                         if (rec.state === "inactive"){
                        //                             const blob = new Blob(audioChunks,{type:'audio/x-mpeg-3'});
                        //                             const audioElem = document.getElementById("voice") as HTMLAudioElement;
                        //                             audioElem.src = URL.createObjectURL(blob);
                        //                             audioElem.controls=true;
                        //                             audioElem.autoplay=true;
                        //                         }
                        //                     }
                        //                     rec.start();
                        //                 }).catch(e => console.error(e));
                        //             }}/>
                        //         ]}/>
                        //     );
                        // }}/>
                    ]}/>
                }/>
            }/>
        );
    }
}
