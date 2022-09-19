import {BC} from "./BernieComponent";

export interface MuxRenderer<Component extends BC<any, any, any>> {
    render(component: Component): JSX.Element | undefined
}