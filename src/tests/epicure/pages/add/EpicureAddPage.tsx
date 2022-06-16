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
import {Text, TextType} from "../../../../components/lo/Text";
import {Button} from "../../../../components/lo/Button";
import {TitledBox} from "../../../../components/lo/TitledBox";
import {NavHeader} from "../../../../components/ho/navHeader/NavHeader";
import {EpicureAPI} from "../../EpicureAPI";
import {v4} from "uuid";
import {Select} from "../../../../components/lo/Select";
import {Month} from "../../Month";
import {Justify} from "../../../../logic/style/Justify";
import {Separator} from "../../../../components/lo/Separator";
import {Orientation} from "../../../../logic/style/Orientation";
import {Utils} from "../../../../logic/Utils";
import {Group} from "../../../../components/lo/Group";
import {SourceMode} from "../../SourceMode";
import Source, {MagazineSourceData} from "../../Source";
import {SourceType} from "../../SourceType";

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
        }, {
            componentID: "EpicureAddPage",
            enableLocalDialog: true
        });
    }

    init() {
        super.init();
        this.detailsAssembly();
        this.navHeaderAssembly();
        this.ingredientsAssembly();
        this.commentAssembly();
        this.sourceAssembly();
        this.sourceWrapperAssembly();
        this.sourceMagazineAssembly();
        this.sourceOffAssembly();

        this.local.setState({
            currentTab: this.rd("main-tab", "default")
        });
    }

    private switchCurrentTab(newTab: string, titledBoxInstance: TitledBox) {
        if (this.local.state.currentTab !== newTab) {
            this.local.setStateWithChannels({
                currentTab: newTab
            }, ["containers"], () => {
                titledBoxInstance.switchBodyRenderer(newTab);
                this.pd("main-tab", newTab);
            });
        }
    }

    private navHeaderAssembly() {
        this.assembly.assembly("nav-header", (theme, titledBoxInstance: TitledBox) => {
            return (
                <NavHeader element={this.local.state.currentTab} elements={new Map<string, (navInstance: NavHeader) => JSX.Element>([
                    ["default", navInstance => <Text text={"Details"}/>],
                    ["source", navInstance => <Text text={"Source"}/>],
                    ["ingredients", navInstance => <Text text={"Ingredients"}/>],
                    ["comment", navInstance => <Text text={"Comment"}/>],
                ])} onChange={(from, to) => {
                    this.switchCurrentTab(to, titledBoxInstance);
                }}/>
            );
        })
    }

    private sourceWrapperAssembly() {
        this.assembly.assembly("source-wrapper", (theme, props) => {
            return this.component(() => (
                <FormElement
                    id={"source-mode"}
                    title={"Type of source"}
                    initialValue={SourceMode.OFF}
                    description={"Select the type of source, the recipe originates from"}
                    fdh={this.local.state.fdh}
                    inputGenerator={(onChange, value, valid, component) => {
                        const mode: SourceMode = value;

                        return (
                            <Group width={percent(100)} enableSeparators elements={Object.keys(SourceMode).filter((item) => isNaN(Number(item))).map(sm => {
                                const m: SourceMode = sm as unknown as SourceMode;
                                const isCurrent = mode === m;

                                return (
                                    <Button opaque width={percent(100)} visualMeaning={isCurrent ? ObjectVisualMeaning.INFO : ObjectVisualMeaning.UI_NO_HIGHLIGHT} children={
                                        <Text coloredText bold={isCurrent} text={String(m).toLocaleUpperCase()} visualMeaning={isCurrent ? ObjectVisualMeaning.INFO : ObjectVisualMeaning.UI_NO_HIGHLIGHT}/>
                                    } onClick={() => {
                                        if (mode !== m) {
                                            onChange(m);
                                            this.rerender("source-wrapper");
                                        }
                                    }}/>
                                );
                            })}/>
                        )
                    }}
                />
            ), "source-wrapper");
        });
    }

    private sourceOffAssembly() {
        this.assembly.assembly("source-off", theme => {
            return (
                <Centered fullHeight>
                    <Text text={"No source"}/>
                </Centered>
            );
        })
    }

    private sourceMagazineAssembly() {
        this.assembly.assembly("source-magazine", theme => {
            return (
                <FlexBox width={percent(100)}>
                    {
                        this.component(() => {
                            return (
                                <LiteGrid columns={2} gap={theme.gaps.defaultGab}>
                                    <FormElement
                                        id={"source-month"}
                                        title={"Month"}
                                        description={"The month"}
                                        fdh={this.local.state.fdh}
                                        inputGenerator={(onChange, value, valid) => (
                                            <Select
                                                elements={() => Object.values(Month).map(month => {
                                                    return {
                                                        value: month
                                                    }
                                                })}
                                                bgColor={theme.colors.backgroundHighlightColor}
                                                onChange={value => onChange(value)}
                                                initialValue={value === undefined ? Month[new Date().getMonth()] : value}
                                            />
                                        )}
                                    />
                                    <FormElement
                                        id={"source-year"}
                                        title={"Year"}
                                        description={"The year"}
                                        fdh={this.local.state.fdh}
                                        inputGenerator={(onChange, value, valid, component) => (
                                            <Input
                                                type={"number"}
                                                defaultValue={value}
                                                min={"1000"}
                                                max={String(new Date().getFullYear())}
                                                step={"1"}
                                                onChange={ev => {
                                                    const hub = component.props.fdh;
                                                    const month = hub.get("source-month");
                                                    hub.set("source-time", `${ev.target.value}-${Utils.zeroPad(String(Month[month] + 1), 2)}`);
                                                    onChange(ev.target.value);
                                                    this.rerender("source-time-mono");
                                                }}
                                                placeholder={String(new Date().getFullYear())}
                                            />
                                        )}
                                    />
                                </LiteGrid>
                            );
                        }, "source-time-dual")
                    }
                    <FlexBox flexDir={FlexDirection.ROW} align={Align.CENTER} justifyContent={Justify.CENTER} width={percent(100)}>
                        <Separator orientation={Orientation.HORIZONTAL}/>
                        <Text text={"or"} uppercase type={TextType.secondaryDescription} fontSize={px(12)}/>
                        <Separator orientation={Orientation.HORIZONTAL}/>
                    </FlexBox>
                    {
                        this.component(() => {
                            return (
                                <FormElement
                                    id={"source-time"}
                                    title={"Month & year"}
                                    description={"Select the month & year"}
                                    fdh={this.local.state.fdh}
                                    inputGenerator={(onChange, value, valid, component) => (
                                        <Input
                                            type={"month"}
                                            defaultValue={value}
                                            onChange={ev => {
                                                const hub = component.props.fdh;
                                                const val = ev.target.value;
                                                const [year, month] = val.split("-");
                                                hub.set("source-month", Month[+month - 1]);
                                                hub.set("source-year", year);
                                                onChange(val);
                                                this.rerender("source-time-dual");
                                            }}
                                            placeholder={value === undefined ? Month[new Date().getMonth()] : value}
                                        />
                                    )}
                                />
                            );
                        }, "source-time-mono")
                    }
                    <FormElement
                        id={"source-page"}
                        title={"Page"}
                        description={"The page in the magazine"}
                        fdh={this.local.state.fdh}
                        inputGenerator={(onChange, value, valid, component) => (
                            <Input
                                type={"number"}
                                defaultValue={value}
                                inputMode={"numeric"}
                                min={"0"}
                                step={"1"}
                                onChange={ev => onChange(ev.target.value)}
                                placeholder={"42"}
                            />
                        )}
                    />
                    {
                        this.component(() => (
                            <FormElement
                                id={"source-magazine-name"}
                                title={"Magazine name"}
                                description={"The name of the magazine"}
                                fdh={this.local.state.fdh}
                                inputGenerator={(onChange, value, valid, component) => (
                                    <FlexBox width={percent(100)}>
                                        <Input
                                            defaultValue={value}
                                            onChange={ev => onChange(ev.target.value)}
                                            placeholder={"Kochen & genießen"}
                                        />
                                        <Text text={"**Or** select from a preset"} fontSize={px(12)} type={TextType.secondaryDescription}/>
                                        <FlexBox width={percent(100)} overflowXBehaviour={OverflowBehaviour.SCROLL}>
                                            <FlexBox flexDir={FlexDirection.ROW}>
                                                {
                                                    ["Kochen und genießen", "tegut"].map(magazine => (
                                                        <Button onClick={() => {
                                                            onChange(magazine);
                                                            this.rerender("source-magazine");
                                                        }} children={
                                                            <Text whitespace={"nowrap"} text={magazine}/>
                                                        }/>
                                                    ))
                                                }
                                            </FlexBox>
                                        </FlexBox>
                                    </FlexBox>
                                )}
                            />
                        ), "source-magazine")
                    }
                </FlexBox>
            );
        })
    }

    private renderSourceBody(): JSX.Element {
        const mode: string | undefined = this.local.state.fdh.get("source-mode");
        switch (mode) {
            case SourceMode.OFF:
                return this.a("source-off");
            case SourceMode.MAGAZINE:
                return this.a("source-magazine");
            default:
                return <>{mode}</>
        }
    }

    private sourceAssembly() {
        this.assembly.assembly("source", (theme, props) => {
            return (
                <FlexBox width={percent(100)} height={percent(100)} overflowYBehaviour={OverflowBehaviour.SCROLL}>
                    <FlexBox width={percent(100)} height={percent(100)}>
                        {
                            this.a("source-wrapper")
                        }

                        {
                            this.component(() => this.renderSourceBody(), "source-wrapper")
                        }
                    </FlexBox>
                </FlexBox>
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

    private generateSource(): Source | undefined {
        const hub = this.local.state.fdh;
        const sourceMode = hub.get("source-mode");

        switch (sourceMode) {
            case SourceMode.OFF:
                return undefined;
            case SourceMode.MAGAZINE:
                return {
                    type: SourceType.MAGAZINE,
                    data: {
                        title: hub.get("source-magazine-name"),
                        page: hub.get("source-page"),
                        year: hub.get("source-year"),
                        month: hub.get("source-month")
                    } as MagazineSourceData
                }
        }
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
            comment: hub.get("comment"),
            source: this.generateSource()
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
                                        ["source", instance => {
                                            return this.a("source");
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
