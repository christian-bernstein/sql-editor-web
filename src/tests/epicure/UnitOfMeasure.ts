import {Unit} from "./Unit";

export class UnitOfMeasure {

    private readonly _measurand: number;

    private readonly _unit: Unit

    constructor(measurand: number, unit: Unit) {
        this._measurand = measurand;
        this._unit = unit
    }

    get unit(): Unit {
        return this._unit;
    }

    get measurand(): number {
        return this._measurand;
    }

    public static amount(measurand: number): UnitOfMeasure {
        return new UnitOfMeasure(measurand, Unit.AMOUNT);
    }

    public static gram(measurand: number): UnitOfMeasure {
        return new UnitOfMeasure(measurand, Unit.GRAMS);
    }
}
