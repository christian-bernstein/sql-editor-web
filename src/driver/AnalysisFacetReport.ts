import {FacetReportHealth} from "./FacetReportHealth";

export type AnalysisFacetReport = {
    health: FacetReportHealth,
    valueChangeType: "UP" | "DOWN" | "SAME",
    developmentRanking: "GOOD" | "MEDIUM" | "BAD"
}
