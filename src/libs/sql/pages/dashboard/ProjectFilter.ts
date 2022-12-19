import {ProjectInfoData} from "../../../../logic/data/ProjectInfoData";
import {WithVisualMeaning} from "../../../../logic/style/WithVisualMeaning";
import DashboardPage from "./DashboardPage";

export type ProjectFilter = WithVisualMeaning & {
    name: string,
    active: boolean,
    filterProps: Map<string, any>,
    filter: (page: DashboardPage, projects: ProjectInfoData[]) => ProjectInfoData[],
    shortName: string,
    index: number
}
