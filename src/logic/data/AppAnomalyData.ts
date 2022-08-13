import {AnomalyLevel} from "./AnomalyLevel";

export type AppAnomalyData = {
    description?: string,
    data?: any,
    level?: AnomalyLevel,
    origin?: string,
    detailedData?: Array<{
        title?: string,
        data?: any,
        description?: string
    }>
}
