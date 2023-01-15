import {AnalysisFacetReport} from "./AnalysisFacetReport";

export type AnalysisFacet = {
    id: string,
    display: string,
    value?: any,
    valueHistory: Array<any>,
    healthAnalyzer?: (value: any, facet: AnalysisFacet) => AnalysisFacetReport,
    valueToTextGenerator?: (value: any) => {
        main: string,
        unit?: string
    }
}
