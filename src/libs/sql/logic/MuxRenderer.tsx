import {BC} from "./BernieComponent";

export interface MuxRenderer<Component extends BC<any, any, any>> {
    render(c: Component): JSX.Element | undefined
}