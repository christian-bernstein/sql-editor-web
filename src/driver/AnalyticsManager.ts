import {AnalysisFacet} from "./AnalysisFacet";
import {AsyncSignal, IAsyncSignal} from "./Signal";

export class AnalyticsManager {

    private readonly onRegisterFacet = new AsyncSignal<AnalyticsManager, AnalysisFacet>();

    private readonly onFacetUpdate = new AsyncSignal<AnalyticsManager, AnalysisFacet>();

    private readonly facets: Map<string, AnalysisFacet> = new Map<string, AnalysisFacet>();

    private valueHistoryMaxLength: Number = 20;

    public registerFacet(facet: AnalysisFacet) {
        this.facets.set(facet.id, facet);
        this.onRegisterFacet.trigger(this, facet).then(() => {});
        this.onFacetUpdate.trigger(this, facet).then(() => {});
    }

    public updateFacet(id: string, value: any) {
        const facet = this.facets.get(id);
        if (facet === undefined) return;
        facet.valueHistory.push(facet.value);
        if (facet.valueHistory.length > this.valueHistoryMaxLength) {
            // TODO: valueHistoryMaxLength might change -> shift more than 1 element
            facet.valueHistory.shift()
        }
        facet.value = value;
        this.onFacetUpdate.trigger(this, facet).then(() => {});
    }

    public getFacet(id: string): AnalysisFacet | undefined {
        return this.facets.get(id);
    }

    public get FacetUpdateEvent(): IAsyncSignal<AnalyticsManager, AnalysisFacet> {
        return this.onFacetUpdate;
    }

    public get RegisterFacetEvent(): IAsyncSignal<AnalyticsManager, AnalysisFacet> {
        return this.onRegisterFacet;
    }
}
