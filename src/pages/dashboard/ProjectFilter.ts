import {ProjectInfoData} from "../../logic/ProjectInfoData";
import {WithVisualMeaning} from "../../logic/WithVisualMeaning";
import DashboardPage from "./DashboardPage";

export type ProjectFilter = WithVisualMeaning & {
    name: string,
    active: boolean,
    filterProps: Map<string, any>,
    filter: (page: DashboardPage, projects: ProjectInfoData[]) => ProjectInfoData[],
    shortName: string,
    index: number
}
