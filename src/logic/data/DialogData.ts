import {Attributed} from "../Attributed";
import {Themeable} from "../../Themeable";

export type DialogData = Attributed<any> & {
    route: string,
    description: string,
    title: string,
    assemblyName: string,
    assemblyFactory: (theme: Themeable.Theme, props: any) => JSX.Element
}
