import {IToCSSConvertable} from "./IToCSSConvertable";

export class Color implements IToCSSConvertable {

    private _r: number;

    private _g: number;

    private _b: number;

    private _alpha: number;

    constructor(r: number, g: number, b: number, alpha: number = 1) {
        this._r = r;
        this._g = g;
        this._b = b;
        this._alpha = alpha;
    }

    public toHex(prefix: string = '#'): string {
        return prefix + ((1 << 24) + (this._r << 16) + (this._g << 8) + this._b).toString(16).substr(1);
    }

    public css(asCSSValue?: boolean): string {
        const css = `rgba(${this.r}, ${this.g}, ${this.b}, ${this.alpha})`;
        if (asCSSValue) {
            return `"${css}"`
        } else {
            return css;
        }
    }

    public copy(): Color {
        return new Color(
            this.r,
            this.g,
            this.b,
            this.alpha
        );
    }

    public withAlpha(a: number): Color {
        const color = this.copy();
        color.alpha = a;
        return color;
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

    get alpha(): number {
        return this._alpha;
    }

    set alpha(value: number) {
        this._alpha = value;
    }

    public static ofHex(hex: string, alpha: number = 1): Color {
        const shards: RegExpExecArray = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex.trim()) as RegExpExecArray;
        return new Color(
            parseInt(shards[1], 16),
            parseInt(shards[2], 16),
            parseInt(shards[3], 16),
            alpha
        );
    }
}
