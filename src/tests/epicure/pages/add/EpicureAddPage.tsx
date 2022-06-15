import {BernieComponent} from "../../../../logic/BernieComponent";
import {Screen} from "../../../../components/lo/Page";
import {Centered} from "../../../../components/lo/PosInCenter";
import {Assembly} from "../../../../logic/assembly/Assembly";
import {Themeable} from "../../../../logic/style/Themeable";
import {AppHeader} from "../../../../components/lo/AppHeader";
import {FlexBox} from "../../../../components/lo/FlexBox";
import {percent, px} from "../../../../logic/style/DimensionalMeasured";
import {OverflowBehaviour} from "../../../../logic/style/OverflowBehaviour";
import {Input} from "../../../../components/lo/Input";
import {TextArea} from "../../../../components/lo/TextArea";
import {LiteGrid} from "../../../../components/lo/LiteGrid";
import {FormElement} from "../../components/FormElement";
import {FormDataHub} from "../../components/FormDataHub";
import {ObjectVisualMeaning} from "../../../../logic/style/ObjectVisualMeaning";
import {FlexDirection} from "../../../../logic/style/FlexDirection";
import {Align} from "../../../../logic/style/Align";
import {Text} from "../../../../components/lo/Text";
import {Button} from "../../../../components/lo/Button";
import {utilizeGlobalTheme} from "../../../../logic/app/App";
import {TitledBox} from "../../../../components/lo/TitledBox";
import {NavHeader} from "../../../../components/ho/navHeader/NavHeader";
import {EpicureAPI} from "../../EpicureAPI";
import {v4} from "uuid";

export type EpicureAddPageProps = {
    onAdd: () => void
}

export type EpicureAddPageLocalState = {
    fdh: FormDataHub,
    currentTab: string
}

export class EpicureAddPage extends BernieComponent<EpicureAddPageProps, any, EpicureAddPageLocalState> {

    constructor(props: EpicureAddPageProps) {
        super(props, undefined, {
            fdh: new FormDataHub("EpicureAddPage").loadFromLocalStore(),
            currentTab: "default"
        });
    }

    init() {
        super.init();
        this.detailsAssembly();
        this.navHeaderAssembly();
        this.ingredientsAssembly();
        this.commentAssembly();
    }

    private navHeaderAssembly() {
        this.assembly.assembly("nav-header", (theme, titledBoxInstance: TitledBox) => {
            return (
                <NavHeader element={this.local.state.currentTab} elements={new Map<string, (navInstance: NavHeader) => JSX.Element>([
                    ["default", navInstance => <Text text={"Details"}/>],
                    ["ingredients", navInstance => <Text text={"Ingredients"}/>],
                    ["comment", navInstance => <Text text={"Comment"}/>],
                ])} onChange={(from, to) => {
                    this.local.setStateWithChannels({
                        currentTab: to
                    }, ["containers"], () => {
                        titledBoxInstance.switchBodyRenderer(to);
                    })
                }}/>
            );
        })
    }

    private detailsAssembly() {
        this.assembly.assembly("details", (theme, props) => {
            return (
                <FlexBox width={percent(100)} overflowYBehaviour={OverflowBehaviour.SCROLL}>
                    <FlexBox width={percent(100)}>
                        <FormElement
                            id={"title"}
                            title={"Title"}
                            description={"The recipes name, shown as it's title"}
                            fdh={this.local.state.fdh}
                            validate={value => {
                                const empty = String(value).length === 0;
                                return {
                                    valid: !empty,
                                    message: empty ? "Title cannot be left blank" : undefined
                                }
                            }}
                            inputGenerator={(onChange, value, valid, component) => (
                                <Input
                                    opaque
                                    visualMeaning={!component.local.state.edited || valid ? ObjectVisualMeaning.UI_NO_HIGHLIGHT : ObjectVisualMeaning.ERROR}
                                    defaultValue={value}
                                    onChange={ev => onChange(ev.target.value)}
                                    placeholder={"Currywurst"}
                                    onBlur={() => component.forceUpdate()}
                                />
                            )}
                        />

                        <FormElement
                            id={"description"}
                            title={"Description"}
                            description={"The description is shown in the preview"}
                            fdh={this.local.state.fdh}
                            inputGenerator={(onChange, value, valid) => (
                                <TextArea
                                    label={""}
                                    placeholder={"A traditional food"}
                                    defaultValue={value}
                                    onChange={ev => onChange(ev.target.value)}
                                />
                            )}
                        />

                        <LiteGrid columns={2} gap={theme.gaps.defaultGab}>
                            <FormElement
                                id={"cooking-time"}
                                title={"Cooking time"}
                                description={"Time in minutes"}
                                fdh={this.local.state.fdh}
                                inputGenerator={(onChange, value, valid) => (
                                    <Input
                                        type={"number"}
                                        defaultValue={value}
                                        inputMode={"numeric"}
                                        onChange={ev => onChange(ev.target.value)}
                                        placeholder={"20"}
                                    />
                                )}
                            />

                            <FormElement
                                id={"kcal"}
                                title={"Kcal"}
                                description={"Energy"}
                                fdh={this.local.state.fdh}
                                inputGenerator={(onChange, value, valid) => (
                                    <Input
                                        type={"number"}
                                        defaultValue={value}
                                        inputMode={"numeric"}
                                        onChange={ev => onChange(ev.target.value)}
                                        placeholder={"450"}
                                    />
                                )}
                            />
                        </LiteGrid>
                    </FlexBox>
                </FlexBox>
            );
        })
    }

    private ingredientsAssembly() {
        this.assembly.assembly("ingredients", (theme, props) => {
            return (
                <FlexBox width={percent(100)} overflowYBehaviour={OverflowBehaviour.SCROLL}>
                    <FlexBox width={percent(100)}>

                    </FlexBox>
                </FlexBox>
            );
        })
    }

    private commentAssembly() {
        this.assembly.assembly("comment", (theme, props) => {
            return (
                <FormElement
                    height={percent(100)}
                    id={"comment"}
                    title={"Comment"}
                    description={"Write any command or note"}
                    fdh={this.local.state.fdh}
                    inputGenerator={(onChange, value, valid) => (
                        <TextArea
                            height={percent(100)}
                            label={""}
                            placeholder={"Peel the carrots first"}
                            defaultValue={value}
                            onChange={ev => onChange(ev.target.value)}
                        />
                    )}
                />
            );
        })
    }

    private saveRecipe() {
        const hub = this.local.state.fdh;
        EpicureAPI.api().saveRecipe({
            id: v4(),
            title: hub.get("title"),
            description: hub.get("description"),
            steps: [],
            ingredients: [],
            categories: [],
            cookingTimeInMin: hub.get("cooking-time"),
            kcal: hub.get("kcal"),
            comment: hub.get("comment")
        });
        this.props.onAdd();
    }

    componentRender(p: any, s: any, l: any, t: Themeable.Theme, a: Assembly): JSX.Element | undefined {
        return (
            <Screen children={
                <Centered fullHeight>
                    <FlexBox width={percent(100)} height={percent(100)}>
                        <AppHeader title={"Add recipe"} right={
                            <FlexBox flexDir={FlexDirection.ROW} align={Align.CENTER}>
                                <Button border={false} bgColorOnDefault={false} opaque visualMeaning={ObjectVisualMeaning.INFO} onClick={() => this.saveRecipe()} children={
                                    <Text text={"save"} uppercase highlight coloredText visualMeaning={ObjectVisualMeaning.INFO}/>
                                }/>
                            </FlexBox>
                        }/>

                        {
                            this.component(local => {
                                return (
                                    <TitledBox width={percent(100)} headerBoxStyle={{paddingBottom: "0", paddingTop: t.gaps.smallGab.css()}} showFooter={true} height={percent(100)} body={this.local.state.currentTab} titleRenderer={instance => this.a("nav-header", instance)} bodyRenderers={new Map<string, (instance: TitledBox) => JSX.Element>([
                                        ["default", instance => {
                                            return this.a("details");
                                        }],
                                        ["ingredients", instance => {
                                            return this.a("ingredients");
                                        }],
                                        ["comment", instance => {
                                            return this.a("comment");
                                        }]
                                    ])}/>
                                );
                            }, "containers")
                        }

                    </FlexBox>
                </Centered>
            }/>
        );
    }
}
