import {Attributed} from "../misc/Attributed";
import {Themeable} from "../style/Themeable";

export type DialogData = Attributed<any> & {
    route: string,
    description: string,
    title: string,
    assemblyName: string,
    assemblyFactory: (theme: Themeable.Theme, props: any) => JSX.Element
}
