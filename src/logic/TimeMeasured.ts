import {IToCSSConvertable} from "./IToCSSConvertable";
import {TimeUnit} from "./TimeUnit";

// noinspection SpellCheckingInspection
export class TimeMeasured implements IToCSSConvertable  {

    private _measurand: number;

    private _unit: TimeUnit;

    constructor(measurand: number, dimension: TimeUnit) {
        this._measurand = measurand;
        this._unit = dimension;
    }

    get measurand(): number {
        return this._measurand;
    }

    set measurand(value: number) {
        this._measurand = value;
    }

    get dimension(): TimeUnit {
        return this._unit;
    }

    set dimension(value: TimeUnit) {
        this._unit = value;
    }

    css(asCSSValue?: boolean): string {
        const s = `${this._measurand}${this._unit}`;
        if (asCSSValue) {
            return `"${s}"`;
        } else {
            return s;
        }
    }

    public static of(measurand: number, unit: TimeUnit): TimeMeasured {
        return new TimeMeasured(measurand, unit);
    }
}

// noinspection SpellCheckingInspection
export function time(measurand: number, unit: TimeUnit): TimeMeasured {
    return new TimeMeasured(measurand, unit);
}
