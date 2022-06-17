import {BernieComponent} from "../../logic/BernieComponent";
import {Assembly} from "../../logic/assembly/Assembly";
import {Themeable} from "../../logic/style/Themeable";
import {Fragment, PropsWithChildren} from "react";
import {getOr} from "../../logic/Utils";

export type MapProps<T> = {
    data: T[],
    renderer: (item: T, component: Map<T>) => JSX.Element,
    wrapper?: (props: PropsWithChildren<any>) => JSX.Element,
    renderWrapperOnEmpty?: boolean
}

export class Map<T> extends BernieComponent<MapProps<T>, any, any> {

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
                children: (
                    <Fragment children={
                        p.data.map(item => p.renderer(item, this))
                    }/>
                )
            });
        }
        return (
            <Fragment children={
                p.data.map(item => p.renderer(item, this))
            }/>
        );
    }
}
