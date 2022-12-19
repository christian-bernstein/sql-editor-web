import {BC} from "../../../../../logic/BernieComponent";
import {Themeable} from "../../../../../logic/style/Themeable";
import {Assembly} from "../../../../../logic/assembly/Assembly";
import {UnitTestUtils} from "../UnitTestUtils";
import {Flex} from "../../../../../components/lo/FlexBox";
import {Box} from "../../../../../components/lo/Box";
import {Form} from "../../../../../components/Form";
import {Input} from "../../../../../components/lo/Input";
import {Button} from "../../../../../components/lo/Button";
import {FormTransactionType} from "../../../../../components/FormTransactionType";
import {HyperionAPI} from "../../../../../frameworks/hyperion/HyperionAPI";
import {px} from "../../../../../logic/style/DimensionalMeasured";
import {v4} from "uuid";
import {Description} from "../../../../../components/lo/Description";
import {HyperionIndexedDBStreamAdapter} from "../../../../../frameworks/hyperion/HyperionIndexedDBStreamAdapter";
import {FileInput} from "../../../../../components/ho/fileInput/FileInput";
import {QueryDisplay} from "../../../../../components/logic/QueryDisplay";
import {Q, Queryable} from "../../../../../logic/query/Queryable";
import {HyperionStorableEntry} from "../../../../../frameworks/hyperion/HyperionStorableEntry";
import {Optional} from "../../../../../logic/Optional";
import {QueryError} from "../../../../../logic/query/QueryError";
import {UpstreamTransactionType} from "../../../../../frameworks/hyperion/UpstreamTransactionType";

export type HyperionTestLocalState = {
    hyperionFileQueryable: Q<Optional<HyperionStorableEntry>>
}

export class HyperionTest extends BC<any, any, HyperionTestLocalState> {

    public static test = UnitTestUtils.createTestConfig({
        name: "hyperion-test",
        displayName: "Hyperion test",
        element: HyperionTest,
        factory: Elem => <Elem/>
    });

    constructor() {
        super(undefined, undefined, {
            hyperionFileQueryable: new Q<Optional<HyperionStorableEntry>>({
                component: () => this,
                fallback: undefined,
                listeners: ["hyperion-file"],
                process: (resolve, reject) => HyperionAPI.hyperion().get("document-view-background-image").then(value => resolve(value))
            })
        });
    }

    componentDidMount() {
        super.componentDidMount();
        this.ls().hyperionFileQueryable.query();
    }

    init() {
        super.init();
        HyperionAPI.hyperion(prop => prop.setStreamAdapter(new HyperionIndexedDBStreamAdapter()), () => new HyperionAPI());
    }

    componentRender(p: any, s: any, l: any, t: Themeable.Theme, a: Assembly): JSX.Element | undefined {
        return (
            <Flex elements={[

                // File Input Form
                <Box width={px(400)} elements={[
                    <FileInput onSubmit={ctx => {
                        HyperionAPI.hyperion(prop => prop.upstreamTransaction({
                            transactionID: v4(),
                            type: UpstreamTransactionType.OVERWRITE,
                            onStreamed: () => {
                                console.debug("onStreamed");
                                this.ls().hyperionFileQueryable.query();
                            },
                            entry: {
                                id: "document-view-background-image",
                                value: ctx.dataURL ?? "error"
                            }
                        }));
                    }}/>
                ]}/>,

                this.component(() => {
                    console.debug("rerender 'hyperion-file' component")

                    return (
                        <Box width={px(400)} elements={[
                            <QueryDisplay
                                q={this.ls().hyperionFileQueryable}
                                renderer={{
                                    success(q: Queryable<Optional<HyperionStorableEntry>>, data: Optional<HyperionStorableEntry>): JSX.Element {
                                        if (data === undefined || data.value === undefined) {
                                            return <Description text={"N/A"}/>
                                        }

                                        return (
                                            <img alt={"hyperion-file"} src={data.value}/>
                                        );
                                    },
                                    processing(q: Queryable<HyperionStorableEntry | undefined>): JSX.Element {
                                        return <>processing</>
                                    },
                                    error(q: Queryable<HyperionStorableEntry | undefined>, error?: QueryError): JSX.Element {
                                        return <>error</>
                                    }
                                }}
                            />
                        ]}/>
                    );
                }, ...Q.allChannels("hyperion-file")),


                // Input Form
                <Box width={px(400)} elements={[
                    <Form formID={"HyperionTest-Import"} onSubmit={(ctx, get) => {
                        console.log("form submitted")

                        HyperionAPI.hyperion(prop => {
                            console.log("using hyperion")

                            prop.upstreamTransaction({
                                transactionID: v4(),
                                type: UpstreamTransactionType.OVERWRITE,
                                onStreamed: () => {
                                    console.log("Import streamed")
                                },
                                entry: {
                                    id: get("id"),
                                    value: get("value")
                                }
                            });
                        });

                    }} renderer={ctx => {
                        return (
                            <Flex gap={t.gaps.smallGab} elements={[
                                <Input placeholder={"ID"} onChange={ev => ctx.data.set("id", ev.target.value)}/>,
                                <Input placeholder={"Value"} onChange={ev => ctx.data.set("value", ev.target.value)}/>,
                                <Button text={"Update"} onClick={() => ctx.transaction(FormTransactionType.SUBMIT)}/>
                            ]}/>
                        );
                    }}/>
                ]}/>,

                // Export Form
                <Box width={px(400)} elements={[
                    <Form formID={"HyperionTest-Export"} onSubmit={(ctx, get) => {
                        HyperionAPI.hyperion(prop => {
                            prop.get(get("id")).then(value => this.dialog(
                                <Description text={value?.value ?? "N/A"}/>
                            ));
                        });

                    }} renderer={ctx => {
                        return (
                            <Flex gap={t.gaps.smallGab} elements={[
                                <Input placeholder={"ID"} onChange={ev => ctx.data.set("id", ev.target.value)}/>,
                                <Button text={"Query"} onClick={() => ctx.transaction(FormTransactionType.SUBMIT)}/>
                            ]}/>
                        );
                    }}/>
                ]}/>
            ]}/>
        );
    }
}
