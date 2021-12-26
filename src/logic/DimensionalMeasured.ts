import {Dimension} from "./Dimension";
import {IToCSSConvertable} from "./IToCSSConvertable";

// noinspection SpellCheckingInspection
export class DimensionalMeasured implements IToCSSConvertable {

    private _measurand: number;

    private _dimension: Dimension;

    constructor(measurand: number, dimension: Dimension) {
        this._measurand = measurand;
        this._dimension = dimension;
    }

    get measurand(): number {
        return this._measurand;
    }

    set measurand(value: number) {
        this._measurand = value;
    }

    get dimension(): Dimension {
        return this._dimension;
    }

    set dimension(value: Dimension) {
        this._dimension = value;
    }

    public css(asCSSValue?: boolean): string {
        const s = `${this._measurand}${this._dimension}`;
        if (asCSSValue) {
            return `"${s}"`;
        } else {
            return s;
        }
    }

    public copy(): DimensionalMeasured {
        return DimensionalMeasured.of(this._measurand, this._dimension);
    }

    public withPlus(delta: number): DimensionalMeasured {
        const dm = this.copy();
        dm.measurand = dm.measurand + delta;
        return dm;
    }

    public static of(measurand: number, dimension: Dimension): DimensionalMeasured {
        return new DimensionalMeasured(measurand, dimension);
    }
}

// noinspection SpellCheckingInspection
export function dimension(measurand: number, dimension: Dimension): DimensionalMeasured {
    return new DimensionalMeasured(measurand, dimension);
}

// noinspection SpellCheckingInspection
export function px(measurand: number = 0): DimensionalMeasured {
    return dimension(measurand, Dimension.px);
}

// noinspection SpellCheckingInspection
export function percent(measurand: number = 0): DimensionalMeasured {
    return dimension(measurand, Dimension.percentage);
}
