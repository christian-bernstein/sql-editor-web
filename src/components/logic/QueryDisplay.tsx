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

    // TODO: Investigate bug -> successOrNeutral is never rendered
    componentRender(p: QueryDisplayProps<T>, s: any, l: any, t: Themeable.Theme, a: Assembly): JSX.Element | undefined {
        console.debug("QueryDisplay rendering", p.q.get());

        const q = p.q;
        const [data, status, error] = p.q.get();

        switch (status) {
            case DataQueryState.NEUTRAL: {
                if (p.renderer.neural !== undefined) {
                    return p.renderer.neural?.(q);
                } else {
                    return p.renderer.successOrNeutral?.(q, data);
                }
            }
            case DataQueryState.SUCCESS: {
                if (p.renderer.success !== undefined) {
                    return p.renderer.success?.(q, data);
                } else {
                    return p.renderer.successOrNeutral?.(q, data);
                }
            }
            case DataQueryState.ERROR: {
                return p.renderer.error?.(q, error)
            }
            case DataQueryState.PROCESSING: {
                return p.renderer.processing?.(q)
            }
        }
    }
}
