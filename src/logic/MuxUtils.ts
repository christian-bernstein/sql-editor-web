import {MuxRenderer} from "./MuxRenderer";
import {BC} from "./BernieComponent";
import {Themeable} from "./style/Themeable";
import {utilizeGlobalTheme} from "./app/App";

/*export function mux<T extends BC<any, any, any>>(
    component: string,
    theme: Themeable.Theme = utilizeGlobalTheme()
): MuxRenderer<T> | undefined {
    if (theme.renderers === undefined) {
        return undefined;
    }
    return theme.renderers.get(component);
}

export function muxRender<T extends BC<any, any, any>>(
    muxer: string | MuxRenderer<T> | undefined,
    ifMux: (mux: MuxRenderer<T>) => JSX.Element | undefined,
    or: () => JSX.Element | undefined
): JSX.Element | undefined {
    let mr: MuxRenderer<T> | undefined;
    if (muxer === undefined) {
        return or();
    }
    if (typeof muxer === "string") {
        mr = mux(muxer as string);
    } else {
        mr = muxer as MuxRenderer<T>;
    }
    if (mr === undefined) {
        return or()
    } else {
        return ifMux(mr as MuxRenderer<T>);
    }
}
 */

// TODO: Remove -> only for compilation
export type MuxUtils = {}