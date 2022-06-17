import {BernieComponent} from "../../../../logic/BernieComponent";
import {Screen} from "../../../../components/lo/Page";
import {Assembly} from "../../../../logic/assembly/Assembly";
import {Themeable} from "../../../../logic/style/Themeable";
import {AppHeader} from "../../../../components/lo/AppHeader";
import {FormDataHub} from "../../components/FormDataHub";
import {FormElement} from "../../components/FormElement";
import {Select} from "../../../../components/lo/Select";
import Filters from "../add/Filters";
import {InformationBox} from "../../../../components/ho/informationBox/InformationBox";
import {ObjectVisualMeaning} from "../../../../logic/style/ObjectVisualMeaning";
import {Text, TextType} from "../../../../components/lo/Text";
import {Separator} from "../../../../components/lo/Separator";
import {Orientation} from "../../../../logic/style/Orientation";
import {FlexBox} from "../../../../components/lo/FlexBox";
import {percent, px} from "../../../../logic/style/DimensionalMeasured";
import {FlexDirection} from "../../../../logic/style/FlexDirection";
import {Align} from "../../../../logic/style/Align";
import {Button} from "../../../../components/lo/Button";

export type EpicureFilterPageLocalState = {
    fdh: FormDataHub
}

export class EpicureFilterPage extends BernieComponent<any, any, EpicureFilterPageLocalState> {

    constructor() {
        super(undefined, undefined, {
            fdh: new FormDataHub("EpicureFilterPage").loadFromLocalStore()
        });
    }

    init() {
        super.init();
        this.filterTypeSelectorAssembly();
        this.filterAssembly();
    }

    private filterTypeSelectorAssembly() {
        this.assembly.assembly("filter-type-selector", theme => {
            return (
                <FormElement
                    title={"Filter type"}
                    id={"filter-type"}
                    onRawChange={() => this.rerender("filter")}
                    description={"Select the filter type, you want to set up"}
                    inputGenerator={(onChange, value) => (
                        <Select bgColor={theme.colors.backgroundHighlightColor} onChange={onChange} initialValue={value} elements={() => (
                            Array.from(Filters.filterSetupRenderers).map(([key, value]) => ({ key, value })).map(kv => ({value: kv.key}))
                        )}/>
                    )}
                    fdh={this.local.state.fdh}
                />
            );
        });
    }

    private filterAssembly() {
        this.assembly.assembly("filter", theme => {
            const filterName = this.local.state.fdh.get("filter-type", "title");
            const elem = Filters.filterSetupRenderers.get(filterName)?.(this);
            if (elem === undefined) {
                return (
                    <InformationBox visualMeaning={ObjectVisualMeaning.ERROR} children={
                        <Text text={`No filter setup available for filter '**${filterName}**'.`}/>
                    }/>
                );
            } else return elem;
        });
    }

    public addFilter() {
        const filterName = this.local.state.fdh.get("filter-type");
    }

    componentRender(p: any, s: any, l: any, t: Themeable.Theme, a: Assembly): JSX.Element | undefined {
        return (
            <Screen>
                <AppHeader title={"Filter page"}/>
                {this.a("filter-type-selector")}

                <FlexBox width={percent(100)} flexDir={FlexDirection.ROW} align={Align.CENTER} padding paddingX={px()} paddingY={t.gaps.defaultGab}>
                    <Separator orientation={Orientation.HORIZONTAL}/>
                    <Text text={"Filter setup"} whitespace={"nowrap"} type={TextType.secondaryDescription} fontSize={px(12)}/>
                    <Separator orientation={Orientation.HORIZONTAL}/>
                </FlexBox>

                {this.component(() => this.a("filter"), "filter")}

                <Button opaque visualMeaning={ObjectVisualMeaning.INFO} onClick={() => this.addFilter()} shrinkOnClick children={
                    <Text text={"Add filter"}/>
                }/>
            </Screen>
        );
    }
}
