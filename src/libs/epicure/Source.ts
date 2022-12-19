import {SourceType} from "./SourceType";
import {Month} from "./Month";

export type MagazineSourceData = {
    title: string,
    month: Month,
    year: number,
    page: number
}

export type WebsiteSourceData = {
    url: string,
    websiteTitle: string
}

export type Source = {
    type: SourceType
    data: MagazineSourceData | WebsiteSourceData
}

export default Source;
