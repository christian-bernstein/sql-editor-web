import {BernieComponent} from "../../logic/BernieComponent";
import {Assembly} from "../../logic/assembly/Assembly";
import {Themeable} from "../../logic/style/Themeable";
import {Fragment, PropsWithChildren} from "react";
import {array, getOr} from "../../logic/Utils";
import {AF} from "./ArrayFragment";

export type MapProps<T> = {
    data: T[],
    renderer: (item: T, data: T[], index: number, component: Map<T>, ) => JSX.Element,
    wrapper?: (props: PropsWithChildren<any>) => JSX.Element,
    renderWrapperOnEmpty?: boolean,
    staticPrefix?: (props: MapProps<T>) => JSX.Element,
    staticPrefixDuplicationCount?: number,
    staticAppendix?: (props: MapProps<T>) => JSX.Element,
}

export class Map<T> extends BernieComponent<MapProps<T>, any, any> {

    private renderChildren(p: MapProps<T>): JSX.Element {
        return (
            <AF elements={[
                array(p.staticPrefix?.(p), getOr(p.staticPrefixDuplicationCount, 1)).filter(e => e) as Array<JSX.Element>,
                p.data.map((item, index) => p.renderer(item, p.data, index, this)),
                p.staticAppendix?.(p)
            ]}/>
        );
    }

    componentRender(p: MapProps<T>, s: any, l: any, t: Themeable.Theme, a: Assembly): JSX.Element | undefined {
        if (p.data.length === 0) {
            if (getOr(p.renderWrapperOnEmpty, false)) {
                if (p.wrapper !== undefined) {
                    return p.wrapper({});
                } else return undefined;
            } else return undefined;
        }

        if (p.wrapper !== undefined) {
            return p.wrapper({
                children: this.renderChildren(p)
            });
        }
        return this.renderChildren(p);
    }
}
