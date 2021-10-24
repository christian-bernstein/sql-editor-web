export class Color {

    private _r: number;

    private _g: number;

    private _b: number;

    constructor(r: number, g: number, b: number) {
        this._r = r;
        this._g = g;
        this._b = b;
    }

    public toHex(prefix: string = '#'): string {
        return prefix + ((1 << 24) + (this._r << 16) + (this._g << 8) + this._b).toString(16).substr(1);
    }

    get b(): number {
        return this._b;
    }

    set b(value: number) {
        this._b = value;
    }

    get g(): number {
        return this._g;
    }

    set g(value: number) {
        this._g = value;
    }

    get r(): number {
        return this._r;
    }

    set r(value: number) {
        this._r = value;
    }

    public static ofHex(hex: string): Color {
        const shards: RegExpExecArray = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex) as RegExpExecArray;
        return new Color(
            parseInt(shards[1], 16),
            parseInt(shards[2], 16),
            parseInt(shards[3], 16),
        );
    }
}
