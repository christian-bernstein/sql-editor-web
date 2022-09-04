import {BernieComponent} from "../../logic/BernieComponent";
import {Q} from "../../logic/query/Queryable";
import {Themeable} from "../../logic/style/Themeable";
import {Assembly} from "../../logic/assembly/Assembly";
import {DataQueryState} from "../../logic/query/DataQueryState";
import {QueryError} from "../../logic/query/QueryError";

export interface QueryDisplayRenderer<T> {
    error?(q: Q<T>, error?: QueryError): JSX.Element,
    neural?(q: Q<T>): JSX.Element,
    success?(q: Q<T>, data: T): JSX.Element,
    successOrNeutral?(q: Q<T>, data: T): JSX.Element,
    processing?(q: Q<T>): JSX.Element,
}

export type QueryDisplayProps<T> = {
    q: Q<T>,
    renderer: QueryDisplayRenderer<T>
}

export class QueryDisplay<T> extends BernieComponent<QueryDisplayProps<T>, any, any> {

    componentRender(p: QueryDisplayProps<T>, s: any, l: any, t: Themeable.Theme, a: Assembly): JSX.Element | undefined {
        switch (p.q.get()[1]) {
            case DataQueryState.NEUTRAL: {
                if (p.renderer.neural !== undefined) {
                    return p.renderer.neural?.(p.q);
                } else {
                    return p.renderer.successOrNeutral?.(p.q, p.q.get()[0]);
                }
            }
            case DataQueryState.SUCCESS: {
                if (p.renderer.success !== undefined) {
                    return p.renderer.success?.(p.q, p.q.get()[0]);
                } else {
                    return p.renderer.successOrNeutral?.(p.q, p.q.get()[0]);
                }
            }
            case DataQueryState.ERROR: {
                return p.renderer.error?.(p.q, p.q.get()[2])
            }
            case DataQueryState.PROCESSING: {
                return p.renderer.processing?.(p.q)
            }
        }
    }
}
