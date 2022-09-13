import {BC, BernieComponent} from "../../logic/BernieComponent";
import {Themeable} from "../../logic/style/Themeable";
import {Assembly} from "../../logic/assembly/Assembly";
import {UnitTestUtils} from "./UnitTestUtils";
import React from "react";
import {Flex} from "../../components/lo/FlexBox";
import {Align} from "../../logic/style/Align";
import {Text, TextType} from "../../components/lo/Text";
import {LiteGrid} from "../../components/lo/LiteGrid";
import {AF} from "../../components/logic/ArrayFragment";
import {Button} from "../../components/lo/Button";
import {percent, px} from "../../logic/style/DimensionalMeasured";
import {ObjectVisualMeaning, VM} from "../../logic/style/ObjectVisualMeaning";
import {Utils} from "../../logic/Utils";

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

            const rnd = (min: number, max: number) => Math.floor(Math.random() * (max - min + 1)) + min;
            type NPM = "n" | "p" | "m";
            type NPMMap<T> = Map<NPM, T>;
            type NPMGenProps = { words: NPMMap<Array<string>> };
            class NPMGen extends BC<NPMGenProps, any, {
                chosen: NPMMap<string | undefined>
            }> {
                constructor(props: NPMGenProps) {
                    super(props, undefined, {
                        chosen: new Map<NPM, string | undefined>()
                    });
                }

                componentRender(p: NPMGenProps, s: any, l: { chosen: NPMMap<string> }, t: Themeable.Theme, a: Assembly): JSX.Element | undefined {
                    return this.component(local => (
                        <Flex align={Align.CENTER} width={percent(75)} elements={[
                            <LiteGrid columns={3} children={
                                <AF elements={["n", "p", "m"].map(char => {
                                    const charArr = p.words.get(char as NPM) as Array<string>;
                                    const chosen = this.local.state.chosen.get(char as NPM);
                                    const word = chosen === undefined ? charArr[rnd(0, charArr.length - 1)] : chosen;

                                    return (
                                        <Flex align={Align.CENTER} gap={t.gaps.smallGab} elements={[
                                            // <Text text={char} type={TextType.secondaryDescription} fontSize={px(11)}/>,
                                            <Text text={word}/>,
                                            <Button text={"LCK"} opaque visualMeaning={chosen === undefined ? VM.UI_NO_HIGHLIGHT : ObjectVisualMeaning.WARNING} onClick={() => {
                                                const newChosen = chosen === undefined ? word : undefined;
                                                this.local.state.chosen.set(char as NPM, newChosen);
                                                this.rerender("component");
                                            }}/>
                                        ]}/>
                                    );
                                })}/>
                            }/>,
                            <Button text={"Generate"} onClick={() => this.rerender("component")}/>
                        ]}/>
                    ), "component");
                }
            }

            let nmp = ["National", "Nautical", "Naughty", "Nerd", "Nerds", "Never", "New", "Newly", "Nice", "Nicely", "Nifty", "Ninja", "Ninjas", "No", "Non", "Nobody", "Nobody's", "Node", "Not", "Now"]
                    .map(n => n.toLowerCase()),
                nArr = [ "naked", "name", "narrative", "narrow", "nation", "national", "native", "natural", "naturally", "nature", "near", "nearby", "nearly", "necessarily", "necessary", "neck", "need", "negative", "negotiate", "negotiation", "neighbor", "neighborhood", "neither", "nerve", "nervous", "net", "network", "never", "nevertheless", "new", "newly", "news", "newspaper", "next", "nice", "night", "nine", "no", "nobody", "nod", "noise", "nomination", "none", "nonetheless", "nor", "normal", "normally", "north", "northern", "nose", "not", "note", "nothing", "notice", "notion", "novel", "now", "nowhere", "n't", "nuclear", "number", "numerous", "nurse", "nut" ]
                    .filter(n => !nmp.includes(n)),
                pArr = [ "pace", "pack", "package", "page", "pain", "painful", "paint", "painter", "painting", "pair", "pale", "palm", "pan", "panel", "pant", "paper", "parent", "park", "parking", "part", "participant", "participate", "participation", "particular", "particularly", "partly", "partner", "partnership", "party", "pass", "passage", "passenger", "passion", "past", "patch", "path", "patient", "pattern", "pause", "pay", "payment", "peace", "peak", "peer", "penalty", "people", "pepper", "per", "perceive", "percentage", "perception", "perfect", "perfectly", "perform", "performance", "perhaps", "period", "permanent", "permission", "permit", "person", "personal", "personality", "personally", "personnel", "perspective", "persuade", "pet", "phase", "phenomenon", "philosophy", "phone", "photo", "photograph", "photographer", "phrase", "physical", "physically", "physician", "piano", "pick", "picture", "pie", "piece", "pile", "pilot", "pine", "pink", "pipe", "pitch", "place", "plan", "plane", "planet", "planning", "plant", "plastic", "plate", "platform", "play", "player", "please", "pleasure", "plenty", "plot", "plus", "pocket", "poem", "poet", "poetry", "point", "pole", "police", "policy", "political", "politically", "politician", "politics", "poll", "pollution", "pool", "poor", "pop", "popular", "population", "porch", "port", "portion", "portrait", "portray", "pose", "position", "positive", "possess", "possibility", "possible", "possibly", "post", "pot", "potato", "potential", "potentially", "pound", "pour", "poverty", "powder", "power", "powerful", "practical", "practice", "pray", "prayer", "precisely", "predict", "prefer", "preference", "pregnancy", "pregnant", "preparation", "prepare", "prescription", "presence", "present", "presentation", "preserve", "president", "presidential", "press", "pressure", "pretend", "pretty", "prevent", "previous", "previously", "price", "pride", "priest", "primarily", "primary", "prime", "principal", "principle", "print", "prior", "priority", "prison", "prisoner", "privacy", "private", "probably", "problem", "procedure", "proceed", "process", "produce", "producer", "product", "production", "profession", "professional", "professor", "profile", "profit", "program", "progress", "project", "prominent", "promise", "promote", "prompt", "proof", "proper", "properly", "property", "proportion", "proposal", "propose", "proposed", "prosecutor", "prospect", "protect", "protection", "protein", "protest", "proud", "prove", "provide", "provider", "province", "provision", "psychological", "psychologist", "psychology", "public", "publication", "publicly", "publish", "publisher", "pull", "punishment", "purchase", "pure", "purpose", "pursue", "push", "put" ],
                mArr = [ "machine", "mad", "magazine", "mail", "main", "mainly", "maintain", "maintenance", "major", "majority", "make", "maker", "makeup", "male", "mall", "man", "manage", "management", "manager", "manner", "manufacturer", "manufacturing", "many", "map", "margin", "mark", "market", "marketing", "marriage", "married", "marry", "mask", "mass", "massive", "master", "match", "material", "math", "matter", "may", "maybe", "mayor", "me", "meal", "mean", "meaning", "meanwhile", "measure", "measurement", "meat", "mechanism", "media", "medical", "medication", "medicine", "medium", "meet", "meeting", "member", "membership", "memory", "mental", "mention", "menu", "mere", "merely", "mess", "message", "metal", "meter", "method", "middle", "might", "military", "milk", "million", "mind", "mine", "minister", "minor", "minority", "minute", "miracle", "mirror", "miss", "missile", "mission", "mistake", "mix", "mixture", "mm-hmm", "mode", "model", "moderate", "modern", "modest", "mom", "moment", "money", "monitor", "month", "mood", "moon", "moral", "more", "moreover", "morning", "mortgage", "most", "mostly", "mother", "motion", "motivation", "motor", "mount", "mountain", "mouse", "mouth", "move", "movement", "movie", "much", "multiple", "murder", "muscle", "museum", "music", "musical", "musician", "must", "mutual", "my", "myself", "mystery", "myth" ],
                n = nArr[rnd(0, nArr.length - 1)],
                p = pArr[rnd(0, pArr.length - 1)],
                m = mArr[rnd(0, mArr.length - 1)];

            // near political message
            // near private marriage

            return (
                <NPMGen words={new Map<NPM, Array<string>>([
                    ["n", nArr],
                    ["p", pArr],
                    ["m", mArr]
                ])}/>
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
