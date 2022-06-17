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
import {EpicureAPI} from "../../EpicureAPI";
import {Map} from "../../../../components/logic/Map";
import {Filter} from "../Filter";
import {SideScroller} from "../../../../components/layout/SideScroller";
import {Box} from "../../../../components/lo/Box";
import {Icon} from "../../../../components/lo/Icon";
import {ReactComponent as CloseIcon} from "../../../../assets/icons/ic-20/ic20-close.svg";
import React from "react";
import {Centered} from "../../../../components/lo/PosInCenter";
import {If} from "../../../../components/logic/If";

export type EpicureFilterPageProps = {
    onFiltersUpdate: () => void
}

export type EpicureFilterPageLocalState = {
    fdh: FormDataHub
}

export class EpicureFilterPage extends BernieComponent<EpicureFilterPageProps, any, EpicureFilterPageLocalState> {

    constructor(props: EpicureFilterPageProps) {
        super(props, undefined, {
            fdh: new FormDataHub("EpicureFilterPage").loadFromLocalStore()
        });
    }

    init() {
        super.init();
        this.filterPreviewAssembly();
        this.filterTypeSelectorAssembly();
        this.filterAssembly();
    }

    private filterPreviewAssembly() {
        this.assembly.assembly("filter-preview", theme => {
            return this.component(() => {
                const filterName = this.local.state.fdh.get("filter-type");

                return (
                    <FlexBox height={percent(100)} width={percent(100)}>
                        <Centered children={
                            <Text text={"Current filters"}/>
                        }/>

                        {
                            (() => {
                                const activeFilters = EpicureAPI.api().filters.filter(filter => filter.type === filterName);
                                const inactiveFilters = EpicureAPI.api().filters.filter(filter => filter.type !== filterName);

                                return (
                                    <SideScroller useMouseDragging>
                                        <FlexBox flexDir={FlexDirection.ROW} align={Align.CENTER}>
                                            <Map<Filter<any>> data={activeFilters} renderWrapperOnEmpty={false} wrapper={props => <FlexBox flexDir={FlexDirection.ROW} align={Align.CENTER} {...props}/>} renderer={(item) => (
                                                <Box opaque visualMeaning={ObjectVisualMeaning.INFO} children={
                                                    <FlexBox flexDir={FlexDirection.ROW} align={Align.CENTER}>
                                                        <Text text={item.type} bold whitespace={"nowrap"}/>
                                                        <Text text={item.dataStringRenderer ? item.dataStringRenderer(item.data) : `${item.data}`} whitespace={"nowrap"} type={TextType.secondaryDescription} fontSize={px(12)}/>
                                                        <Icon icon={<CloseIcon/>} onClick={() => {
                                                            EpicureAPI.api().removeFilter(item.id);
                                                            this.rerender("filters", "recipes");
                                                            this.props.onFiltersUpdate();
                                                        }}/>
                                                    </FlexBox>
                                                }/>
                                            )}/>

                                            {
                                                activeFilters.length > 0 && inactiveFilters.length > 0 ? (
                                                    <Separator orientation={Orientation.VERTICAL} width={px(1)} style={{height: "30px"}}/>
                                                ) : undefined
                                            }

                                            <Map<Filter<any>> data={inactiveFilters} renderWrapperOnEmpty={false} wrapper={props => <FlexBox flexDir={FlexDirection.ROW} align={Align.CENTER} {...props}/>} renderer={(item) => (
                                                <Box children={
                                                    <FlexBox flexDir={FlexDirection.ROW} align={Align.CENTER}>
                                                        <Text text={item.type} bold whitespace={"nowrap"}/>
                                                        <Text text={item.dataStringRenderer ? item.dataStringRenderer(item.data) : `${item.data}`} whitespace={"nowrap"} type={TextType.secondaryDescription} fontSize={px(12)}/>
                                                        <Icon icon={<CloseIcon/>} onClick={() => {
                                                            EpicureAPI.api().removeFilter(item.id);
                                                            this.rerender("filters", "recipes");
                                                            this.props.onFiltersUpdate();
                                                        }}/>
                                                    </FlexBox>
                                                }/>
                                            )}/>


                                        </FlexBox>
                                    </SideScroller>
                                );
                            })()
                        }
                    </FlexBox>
                );
            }, "filters", "filter");
        })
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
            const filterName = this.local.state.fdh.get("filter-type", "Recipe title");
            const elem = Filters.filterSetupRenderers.get(filterName)?.setupRenderer(this);
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
        const setting = Filters.filterSetupRenderers.get(filterName);
        if (setting !== undefined) {
            const filter = setting.filterConvertor(this, this.local.state.fdh);
            EpicureAPI.api().addFilter(filter);
            this.rerender("filters");
            this.props.onFiltersUpdate();
        }
    }

    componentRender(p: EpicureFilterPageProps, s: any, l: any, t: Themeable.Theme, a: Assembly): JSX.Element | undefined {
        return (
            <Screen>
                <AppHeader title={"Filter page"}/>

                {this.a("filter-preview")}


                <FlexBox width={percent(100)} flexDir={FlexDirection.ROW} align={Align.CENTER} padding paddingX={px()} paddingY={t.gaps.defaultGab}>
                    <Separator orientation={Orientation.HORIZONTAL}/>
                    <Text text={"Filter type"} whitespace={"nowrap"} type={TextType.secondaryDescription} fontSize={px(12)}/>
                    <Separator orientation={Orientation.HORIZONTAL}/>
                </FlexBox>

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
