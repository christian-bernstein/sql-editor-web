import {BernieComponent} from "../../libs/sql/logic/BernieComponent";
import {Assembly} from "../../libs/sql/logic/assembly/Assembly";
import {Themeable} from "../../libs/sql/logic/style/Themeable";
import {AnalysisFacet} from "../AnalysisFacet";
import {driver} from "../Driver";
import {Box} from "../../libs/sql/components/lo/Box";
import {px} from "../../libs/sql/logic/style/DimensionalMeasured";
import {Description} from "../../libs/sql/components/lo/Description";
import {equals, When} from "../../libs/sql/components/logic/When";
import {FacetReportHealth} from "../FacetReportHealth";
import {VM} from "../../libs/sql/logic/style/ObjectVisualMeaning";
import React from "react";
import {v4} from "uuid";
import {Q, Queryable} from "../../libs/sql/logic/query/Queryable";
import {Optional} from "../../libs/sql/logic/Optional";
import {QueryDisplay} from "../../libs/sql/components/logic/QueryDisplay";
import {Flex, FlexRow} from "../../libs/sql/components/lo/FlexBox";
import {Align} from "../../libs/sql/logic/style/Align";
import {Icon} from "../../libs/sql/components/lo/Icon";
import {ReactComponent as TrendingUpIcon} from "../../assets/icons/ic-20/ic20-trending-up.svg";
import {ReactComponent as TrendingDownIcon} from "../../assets/icons/ic-20/ic20-trending-down.svg";
import {ReactComponent as TrendingSameIcon} from "../../assets/icons/ic-20/ic20-arrow-right.svg";

export type AnalysisFacetChipProps = {
    facetID: string
}

export type AnalysisFacetChipLocalState = {
    facet: Q<Optional<AnalysisFacet>>
}

export class AnalysisFacetChip extends BernieComponent<AnalysisFacetChipProps, any, AnalysisFacetChipLocalState> {

    private id: string | undefined = undefined;

    constructor(props: AnalysisFacetChipProps) {
        super(props, undefined, {
            facet: new Queryable<Optional<AnalysisFacet>>({
                listeners: ["facet"],
                onTimeout(q: Queryable<AnalysisFacet | undefined>): void {},
                enable: true,
                component: () => this,
                fallback: undefined,
                process: (resolve, reject) => {
                    try {
                        resolve(driver().analyticsManager.getFacet(props.facetID));
                    } catch (e) {
                        reject({
                            code: -1,
                            object: e
                        });
                    }
                }
            })
        });
    }

    init() {
        super.init();
        this.id = v4();
        this.successAssembly();
        this.processingAssembly();
    }

    componentDidMount() {
        super.componentDidMount();
        driver().analyticsManager.FacetUpdateEvent.bind(this.id!, (source, data) => new Promise<void>((resolve, reject) => {
            this.ls().facet.query();
        }));
        this.ls().facet.query();
    }

    componentWillUnmount() {
        super.componentWillUnmount();
        driver().analyticsManager.FacetUpdateEvent.unbind(this.id!);
    }

    private successAssembly() {
        this.assembly.assembly("success", (theme, facet: AnalysisFacet) => {
            const text = facet.valueToTextGenerator?.(facet.value) ?? {
                main: String(facet.value)
            };

            const report = facet.healthAnalyzer?.(facet.value, facet);

            return (
                <Box fw fh bgColor={theme.colors.backgroundHighlightColor200}
                     paddingX={theme.paddings.defaultButtonPadding}
                     paddingY={theme.paddings.defaultButtonPadding}
                     elements={[
                    <FlexRow fw fh align={Align.CENTER} elements={[
                        <Icon colored visualMeaning={
                            report?.developmentRanking === "GOOD" ? VM.SUCCESS : VM.WARNING
                        } icon={
                            <When test={report?.valueChangeType} cases={new Map<(value: any) => boolean, () => JSX.Element>([
                                [equals("UP"), () => <TrendingUpIcon/>],
                                [equals("DOWN"), () => <TrendingDownIcon/>]
                            ])} default={() => <TrendingSameIcon/>}/>
                        }/>,


                        <Flex gap={px()} fh elements={[
                            <Description renderMarkdown={false} text={`${String(facet?.display)}`}/>,
                            // TODO: Better code design
                            <When test={report} cases={new Map<(value: any) => boolean, () => JSX.Element>([
                                [equals(FacetReportHealth.GOOD), () => (
                                    <FlexRow gap={px(3)} elements={[
                                        <Description fontSize={px(14)} coloredText visualMeaning={VM.SUCCESS} bold text={text.main}/>,
                                        text.unit === undefined ? <></> : <Description fontSize={px(14)} text={text.unit}/>
                                    ]}/>
                                )],
                                [equals(FacetReportHealth.ERROR), () => (
                                    <FlexRow gap={px(3)} elements={[
                                        <Description fontSize={px(14)} coloredText visualMeaning={VM.ERROR} bold text={text.main}/>,
                                        text.unit === undefined ? <></> : <Description fontSize={px(14)} text={text.unit}/>
                                    ]}/>
                                )],
                                [equals(FacetReportHealth.WARNING), () => (
                                    <FlexRow gap={px(3)} elements={[
                                        <Description fontSize={px(14)} coloredText visualMeaning={VM.WARNING} bold text={text.main}/>,
                                        text.unit === undefined ? <></> : <Description fontSize={px(14)} text={text.unit}/>
                                    ]}/>
                                )]
                            ])} default={() => (
                                <FlexRow gap={px(3)} elements={[
                                    <Description fontSize={px(14)} bold text={text.main}/>,
                                    text.unit === undefined ? <></> : <Description fontSize={px(14)} text={text.unit}/>
                                ]}/>
                            )}/>
                        ]}/>
                    ]}/>
                ]}/>
            );
        })
    }

    private processingAssembly() {
        this.assembly.assembly("processing", theme => {
            return (
                <Box fw fh elements={[]}/>
            );
        })
    }

    componentRender(p: AnalysisFacetChipProps, s: any, l: AnalysisFacetChipLocalState, t: Themeable.Theme, a: Assembly): JSX.Element | undefined {
        return this.component(() => (
            <QueryDisplay<Optional<AnalysisFacet>> q={this.ls().facet} renderer={{
                success: (q: Queryable<AnalysisFacet | undefined>, data: AnalysisFacet | undefined) => {
                    return this.a("success", data);
                },
                processing: (q: Queryable<AnalysisFacet | undefined>) => {
                    return this.a("processing");
                }
            }}/>
        ), ...Q.allChannels("facet"));
    }
}
