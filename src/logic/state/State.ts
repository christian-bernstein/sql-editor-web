export const cs: <T extends object>(obj: T) => State<T> = state => {
    return new State(state);
}

export class State<T extends object> {

    private readonly listeners: ((state: T, params: Map<string, any>) => void)[] = [];

    private _state: T;

    constructor(state: T) {
        this._state = state;
    }

    public setState(state: Partial<T>, params: Map<string, any> = new Map<string, any>()) {
        this._state = {
            ...this._state,
            ...state
        };
        this.listeners.forEach(value => {
            try {
                value(this._state, params);
            } catch (e) {
                console.log(e);
            }
        })
    }

    public on(handler: ((state: T, params: Map<string, any>) => void)) {
        this.listeners.push(handler);
    }

    get state(): T {
        return this._state;
    }
}
